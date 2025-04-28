import { useEffect, useRef, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
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
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Load the Google Maps script
  useEffect(() => {
    // If Google Maps is already loaded, don't load again
    if (window.google && window.google.maps && window.google.maps.places) {
      setScriptLoaded(true);
      return;
    }
    
    // Check if script tag already exists
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      // Script already exists, wait for it to load
      const checkLoaded = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          setScriptLoaded(true);
          clearInterval(checkLoaded);
        }
      }, 100);
      
      // Set a timeout for the check
      setTimeout(() => clearInterval(checkLoaded), 10000);
      return;
    }
    
    // Create a global callback that will be called when Google Maps loads
    window.initGoogleMapsAutocomplete = function() {
      setScriptLoaded(true);
    };
    
    // Create and append the script element
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsAutocomplete`;
    script.async = true;
    document.head.appendChild(script);
    
    // Clean up
    return () => {
      // Remove the global callback
      window.initGoogleMapsAutocomplete = function() {};
    };
  }, [apiKey]);

  // Initialize autocomplete once the script is loaded
  useEffect(() => {
    if (!scriptLoaded || !inputRef.current) {
      return;
    }
    
    try {
      // Create the autocomplete instance
      if (window.google?.maps?.places?.Autocomplete) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['address'],
          fields: ['formatted_address', 'geometry', 'place_id']
        });
      } else {
        return;
      }
      
      // Add listener for place selection
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
    } catch (error) {
      console.error('Error initializing Google Maps Autocomplete:', error);
    }
    
    // Clean up on unmount
    return () => {
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [scriptLoaded, inputRef.current]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Always notify the parent component about the input change
    // This is crucial to prevent form validation errors from disabling the input
    onAddressSelect(value);
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        onAddressSelect(inputValue);
      }
    }
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
        onKeyDown={handleKeyDown}
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