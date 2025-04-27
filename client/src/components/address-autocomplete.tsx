import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Define the props for the AddressAutocomplete component
interface AddressAutocompleteProps {
  onAddressSelect: (address: string, placeId?: string) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  id?: string;
  required?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
}

// Extend the window interface to include the google object and initialization function
declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: { types: string[]; fields: string[] }
          ) => {
            addListener: (event: string, callback: () => void) => void;
            getPlace: () => { formatted_address?: string; place_id?: string };
          };
        };
      };
      accounts?: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: (notification?: any) => void;
          disableAutoSelect: () => void;
          revoke: (hint: string, callback: () => void) => void;
        };
      };
    };
    initAutocomplete?: () => void;
  }
}

export function AddressAutocomplete({
  onAddressSelect,
  placeholder = "Enter your address",
  defaultValue = "",
  className,
  id,
  required,
  autoFocus,
  disabled
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Load the Google Maps script on component mount
  useEffect(() => {
    // Check if Google Maps script is already loaded
    if (!window.google || !window.google.maps) {
      // Define the callback function that will be called when the script loads
      window.initAutocomplete = () => {
        if (inputRef.current && window.google) {
          initializeAutocomplete();
        }
      };

      // Create the script element
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initAutocomplete`;
      script.async = true;
      script.defer = true;
      
      // Add the script to the document
      document.head.appendChild(script);
      
      // Cleanup function to remove the script when the component unmounts
      return () => {
        document.head.removeChild(script);
        window.initAutocomplete = undefined;
      };
    } else {
      // If the script is already loaded, initialize autocomplete directly
      initializeAutocomplete();
    }
  }, [apiKey]);

  // Initialize the autocomplete functionality
  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google || !window.google.maps || !window.google.maps.places) return;
    
    try {
      // Create the autocomplete instance
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        fields: ["formatted_address", "place_id"],
      });
  
      // Add listener for place_changed event
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        
        if (place && place.formatted_address) {
          setInputValue(place.formatted_address);
          onAddressSelect(place.formatted_address, place.place_id);
        }
      });
    } catch (error) {
      console.error("Error initializing Google Maps Autocomplete:", error);
    }
  };

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    
    // If the field is cleared or manually edited, call the callback with the current value
    if (e.target.value === "") {
      onAddressSelect("");
    }
  };

  return (
    <Input
      ref={inputRef}
      type="text"
      id={id}
      placeholder={placeholder}
      className={cn("address-autocomplete", className)}
      value={inputValue}
      onChange={handleInputChange}
      required={required}
      autoFocus={autoFocus}
      disabled={disabled}
    />
  );
}