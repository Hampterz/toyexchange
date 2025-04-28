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
  const [autocompleteAttempted, setAutocompleteAttempted] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Always pass the current value back to parent component
    // to prevent form validation errors from blocking typing
    onAddressSelect(newValue);
  };

  // Called when address is selected from autocomplete dropdown
  const handlePlaceSelect = () => {
    try {
      if (!autocompleteRef.current) return;
      
      const place = autocompleteRef.current.getPlace();
      
      if (place && place.formatted_address) {
        // Update the input value with the selected address
        setInputValue(place.formatted_address);
        
        // Extract coordinates if available
        let coordinates;
        if (place.geometry && place.geometry.location) {
          coordinates = {
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng()
          };
        }
        
        // Pass the selected address and coordinates to parent
        onAddressSelect(place.formatted_address, coordinates, place.place_id);
      }
    } catch (error) {
      console.error("Error handling place selection:", error);
      // If there's an error, we'll still use the current input value
      onAddressSelect(inputValue);
    }
  };

  // Attempt to initialize Google Maps Autocomplete when the component mounts
  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places || !window.google.maps.places.Autocomplete) {
      // If Google Maps API not available, switch to manual mode
      setManualMode(true);
      return;
    }

    try {
      if (inputRef.current) {
        // Create autocomplete instance
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ["address"],
          fields: ["formatted_address", "geometry", "place_id"]
        });
        
        // Add listener for when a place is selected
        autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
        
        // Mark that we've attempted to initialize autocomplete
        setAutocompleteAttempted(true);
      }
    } catch (error) {
      console.error("Failed to initialize Google Maps Autocomplete:", error);
      setManualMode(true);
    }
    
    // Cleanup function
    return () => {
      if (autocompleteRef.current) {
        // No formal way to destroy the autocomplete instance,
        // but we can remove the reference
        autocompleteRef.current = null;
      }
    };
  }, [inputRef.current]);

  // Form submission handling
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
      {manualMode && autocompleteAttempted && (
        <p className="text-xs text-amber-500 mt-1">
          Using manual address entry mode.
        </p>
      )}
    </div>
  );
}