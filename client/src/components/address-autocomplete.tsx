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
  placeholder = "",
  defaultValue = "",
  className,
  id,
  required,
  autoFocus,
  disabled
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [isInitialized, setIsInitialized] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [showFallbackMessage, setShowFallbackMessage] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Check if Google Maps API is already loaded
  const isGoogleMapsLoaded = () => {
    return window.google && window.google.maps && window.google.maps.places;
  };

  // Use an effect to show the fallback message after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isInitialized) {
        setShowFallbackMessage(true);
      }
    }, 3000); // Show fallback message after 3 seconds if autocomplete not initialized
    
    return () => clearTimeout(timer);
  }, [isInitialized]);

  // Load the Google Maps script on component mount
  useEffect(() => {
    // If Google Maps is already loaded, initialize autocomplete directly
    if (isGoogleMapsLoaded()) {
      initializeAutocomplete();
      setScriptLoaded(true);
      return;
    }

    // Only load the script if it hasn't been loaded already
    if (!scriptLoaded && !window.googleMapsScriptLoading) {
      window.googleMapsScriptLoading = true;
      
      try {
        // Define the callback function that will be called when the script loads
        window.initAutocomplete = () => {
          setScriptLoaded(true);
          window.googleMapsScriptLoading = false;
          
          // Small delay to ensure the Google Maps API is fully initialized
          setTimeout(() => {
            if (inputRef.current) {
              initializeAutocomplete();
            }
          }, 100);
        };

        // Create the script element
        const scriptElement = document.createElement("script");
        scriptElement.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initAutocomplete`;
        scriptElement.async = true;
        scriptElement.defer = true;
        
        // Add error handling to the script
        scriptElement.onerror = (error) => {
          console.error("Error loading Google Maps API:", error);
          window.googleMapsScriptLoading = false;
          // If the API key is invalid or has errors, still allow manual input
          setShowFallbackMessage(true);
        };
        
        // Add the script to the document
        document.head.appendChild(scriptElement);
        
        // Set a timeout to ensure the input is enabled if the API fails to load
        const enableInputTimeout = setTimeout(() => {
          if (!isInitialized) {
            setShowFallbackMessage(true);
          }
        }, 5000); // 5 second timeout
        
        return () => {
          clearTimeout(enableInputTimeout);
        };
      } catch (error) {
        console.error("Error setting up Google Maps script:", error);
        setShowFallbackMessage(true);
        window.googleMapsScriptLoading = false;
      }
    }
  }, [apiKey]);

  // Re-initialize when the script loads
  useEffect(() => {
    if (scriptLoaded && !isInitialized && inputRef.current) {
      initializeAutocomplete();
    }
  }, [scriptLoaded, inputRef.current]);

  // Initialize the autocomplete functionality
  const initializeAutocomplete = () => {
    if (!inputRef.current || !isGoogleMapsLoaded()) {
      setShowFallbackMessage(true);
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
      
      // Mark as initialized
      setIsInitialized(true);
      setShowFallbackMessage(false);
    } catch (error) {
      console.error("Error initializing Google Maps Autocomplete:", error);
      setShowFallbackMessage(true);
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
      if (!isInitialized || showFallbackMessage) {
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
        autoComplete="off" // Changed to off to prevent conflicts with Google Autocomplete
        spellCheck="false"
        aria-label="Enter your address"
        // Make mobile keyboard more suitable for address entry
        inputMode="text"
      />
      {showFallbackMessage && (
        <p className="text-xs text-amber-500 mt-1">
          Address autocomplete unavailable. You can still type your address manually.
        </p>
      )}
    </div>
  );
}