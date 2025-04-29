import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Define the props for the AddressAutocomplete component
interface AddressAutocompleteProps {
  onAddressSelect: (
    address: string, 
    coordinates?: { latitude: number; longitude: number }, 
    placeId?: string
  ) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  id?: string;
  required?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
}

export function AddressAutocomplete({
  onAddressSelect,
  placeholder = "",
  defaultValue = "",
  className,
  id,
  required,
  autoFocus,
  disabled
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(defaultValue || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const scriptLoadedRef = useRef(false);
  
  // Handle changes to input value
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Always notify parent of changes to prevent form validation issues
    onAddressSelect(value);
  };

  // Load the Google Maps script if not already loaded
  useEffect(() => {
    // If script is already loaded, don't load it again
    if (window.google?.maps?.places || scriptLoadedRef.current) {
      return;
    }
    
    scriptLoadedRef.current = true;
    
    try {
      const googleMapsScript = document.createElement('script');
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      googleMapsScript.async = true;
      googleMapsScript.defer = true;
      googleMapsScript.onload = () => {
        // Initialize autocomplete when script loads
        if (inputRef.current && window.google?.maps?.places) {
          initializeAutocomplete();
        }
      };
      document.head.appendChild(googleMapsScript);
    } catch (error) {
      console.error("Error loading Google Maps script:", error);
    }
  }, []);

  // Initialize autocomplete when the input reference is available
  useEffect(() => {
    if (window.google?.maps?.places && inputRef.current) {
      initializeAutocomplete();
    }
  }, [inputRef.current]);

  // Initialize the Google Maps autocomplete
  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google?.maps?.places) return;
    
    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        fields: ['formatted_address', 'geometry', 'place_id']
      });
      
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (place?.formatted_address) {
          setInputValue(place.formatted_address);
          
          let coordinates;
          if (place.geometry?.location) {
            coordinates = {
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng()
            };
          }
          
          onAddressSelect(place.formatted_address, coordinates, place.place_id);
        }
      });
    } catch (error) {
      console.error("Error initializing autocomplete:", error);
    }
  };

  // Clean up listeners when component unmounts
  useEffect(() => {
    return () => {
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        id={id}
        placeholder={placeholder}
        className={cn("w-full outline-none bg-transparent text-sm", className)}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={() => {
          // If user tabs/clicks away, make sure we pass the current value
          onAddressSelect(inputValue);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            onAddressSelect(inputValue);
          }
        }}
        required={required}
        autoFocus={autoFocus}
        disabled={disabled}
        autoComplete="off"
        spellCheck="false"
        aria-label="Enter your address"
      />
    </div>
  );
}

// Define global types for TypeScript
declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: Record<string, any>
          ) => any;
        };
        event?: {
          clearInstanceListeners: (instance: any) => void;
        };
      };
    };
  }
}