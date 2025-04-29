import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

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

// This is an ultra-simplified version focusing on keeping the input enabled
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
  // Use a simple controlled input
  const [inputValue, setInputValue] = useState(defaultValue || "");
  const inputRef = useRef<HTMLInputElement>(null);
  
  // When the user types, update the internal state and notify parent
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    // Notify parent but don't validate - this prevents form control from disabling input
    onAddressSelect(value);
  };
  
  // Simple Google Maps script loader with minimal dependencies
  useEffect(() => {
    // Only add the script once
    if (document.getElementById('google-maps-script')) {
      return;
    }
    
    // Create and add the script element
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    // No cleanup needed - script will remain loaded
  }, []);
  
  // Handle Enter key presses
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      if (inputValue) {
        onAddressSelect(inputValue);
      }
    }
  };
  
  // Return a simple input element with minimal props
  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        id={id}
        placeholder={placeholder}
        className={cn("w-full outline-none bg-transparent text-sm", className)}
        autoComplete="off"
        spellCheck="false"
        aria-label="Enter your address"
      />
    </div>
  );
}

// Note: We've intentionally removed Google Maps Autocomplete initialization
// This version focuses on keeping the input enabled while typing
// After we verify that works, we can add back the autocomplete functionality