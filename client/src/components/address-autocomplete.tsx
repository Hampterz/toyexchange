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
  const [apiError, setApiError] = useState(false);
  const [isAutocompleteActive, setIsAutocompleteActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const apiLoadAttemptedRef = useRef(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Initialize Google Maps Autocomplete
  useEffect(() => {
    // Only attempt to load once
    if (apiLoadAttemptedRef.current) return;
    apiLoadAttemptedRef.current = true;

    try {
      // Check if Google Maps API is already loaded
      if (window.google?.maps?.places?.Autocomplete) {
        initializeAutocomplete();
        return;
      }

      // Set a global callback for when the script loads
      const callbackName = 'gmapsCallback' + Date.now();
      window[callbackName] = () => {
        if (window.google?.maps?.places?.Autocomplete) {
          initializeAutocomplete();
        } else {
          setApiError(true);
        }
        // Clean up callback
        delete window[callbackName];
      };

      // Load the Google Maps API script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callbackName}`;
      script.async = true;
      script.onerror = () => setApiError(true);
      document.head.appendChild(script);

      // Timeout for API loading
      const timeout = setTimeout(() => {
        if (!isAutocompleteActive) {
          setApiError(true);
        }
      }, 5000);

      return () => {
        clearTimeout(timeout);
        // Clean up the global callback
        if (window[callbackName]) {
          delete window[callbackName];
        }
      };
    } catch (error) {
      console.error("Error setting up Google Maps API:", error);
      setApiError(true);
    }
  }, [apiKey]);

  // Initialize autocomplete on the input element
  const initializeAutocomplete = () => {
    if (!inputRef.current) return;

    try {
      // Create the autocomplete instance
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        fields: ['formatted_address', 'geometry', 'place_id']
      });

      // Add place selection handler
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.formatted_address) {
          setInputValue(place.formatted_address);
          
          let coordinates;
          if (place.geometry && place.geometry.location) {
            coordinates = {
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng()
            };
          }
          
          onAddressSelect(place.formatted_address, coordinates, place.place_id);
        }
      });

      setIsAutocompleteActive(true);
    } catch (error) {
      console.error("Error initializing autocomplete:", error);
      setApiError(true);
    }
  };

  // Clean up the autocomplete instance when the component unmounts
  useEffect(() => {
    return () => {
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, []);

  // Called when the input value changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Always update the parent with the current value
    // This prevents form validation from disabling input in the middle of typing
    onAddressSelect(value);
  };

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
        inputMode="text"
      />
    </div>
  );
}

// Declare the global callback for TypeScript
declare global {
  interface Window {
    [key: string]: any;
  }
}