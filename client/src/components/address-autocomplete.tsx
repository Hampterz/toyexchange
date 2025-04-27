import { useEffect, useRef, useState } from "react";
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

// The window interface is extended in global.d.ts

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
  const [showFallbackMessage, setShowFallbackMessage] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Use an effect to show the fallback message after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFallbackMessage(!autocompleteRef.current);
    }, 2000); // Show fallback message after 2 seconds if autocomplete not initialized
    
    return () => clearTimeout(timer);
  }, [autocompleteRef.current]);

  // Load the Google Maps script on component mount
  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null;
    let scriptAddedToHead = false;

    // Check if Google Maps script is already loaded
    if (!window.google || !window.google.maps) {
      try {
        // Define the callback function that will be called when the script loads
        window.initAutocomplete = () => {
          if (inputRef.current && window.google) {
            initializeAutocomplete();
          }
        };

        // Create the script element
        scriptElement = document.createElement("script");
        scriptElement.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initAutocomplete`;
        scriptElement.async = true;
        scriptElement.defer = true;
        
        // Add error handling to the script
        scriptElement.onerror = (error) => {
          console.error("Error loading Google Maps API:", error);
          // If the API key is invalid or has errors, still allow manual input
          if (inputRef.current) {
            // Remove the disabled attribute if present
            inputRef.current.disabled = false;
          }
        };
        
        // Add the script to the document
        document.head.appendChild(scriptElement);
        scriptAddedToHead = true;
        
        // Set a timeout to ensure the input is enabled if the API fails to load
        const enableInputTimeout = setTimeout(() => {
          if (inputRef.current && inputRef.current.disabled) {
            inputRef.current.disabled = false;
          }
        }, 5000); // 5 second timeout
        
        return () => {
          // Clean up timeout
          clearTimeout(enableInputTimeout);
          
          // Remove the script from head if it was added
          if (scriptAddedToHead && scriptElement) {
            try {
              document.head.removeChild(scriptElement);
            } catch (e) {
              console.error("Error removing script:", e);
            }
          }
          window.initAutocomplete = undefined;
        };
      } catch (error) {
        console.error("Error setting up Google Maps script:", error);
        // If there's an error, make sure the input is still usable
        if (inputRef.current) {
          inputRef.current.disabled = false;
        }
      }
    } else {
      // If the script is already loaded, initialize autocomplete directly
      initializeAutocomplete();
    }
  }, [apiKey]);

  // Initialize the autocomplete functionality
  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google || !window.google.maps || !window.google.maps.places) {
      // If Google Maps Places isn't available, make sure the input works manually
      if (inputRef.current) {
        inputRef.current.disabled = false;
      }
      return;
    }
    
    try {
      // Create the autocomplete instance
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        fields: ["formatted_address", "place_id", "geometry"],
      });
  
      // Add listener for place_changed event
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        
        if (place && place.formatted_address) {
          setInputValue(place.formatted_address);
          
          // If we have geometry/location data, extract coordinates
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
      
      // Successfully initialized - hide the fallback message
      setShowFallbackMessage(false);
    } catch (error) {
      console.error("Error initializing Google Maps Autocomplete:", error);
      if (inputRef.current) {
        inputRef.current.disabled = false;
      }
    }
  };

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // If the field is cleared, call the callback with empty string
    if (newValue === "") {
      onAddressSelect("");
    } else {
      // If Google Maps autocomplete isn't working, still update with manual input
      // This ensures manual entry works even without API access
      if (!autocompleteRef.current) {
        onAddressSelect(newValue);
      }
    }
  };

  // Handle manual form submission if user presses enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Call the callback with the current manual input value
      onAddressSelect(inputValue);
    }
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        id={id}
        placeholder={placeholder}
        className={cn("address-autocomplete", className)}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        required={required}
        autoFocus={autoFocus}
        disabled={disabled}
      />
      {showFallbackMessage && (
        <p className="text-xs text-amber-500 mt-1">
          Address autocomplete unavailable. You can still type addresses manually.
        </p>
      )}
    </div>
  );
}