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
  const mapsLoadedRef = useRef(false);
  
  // Handle input changes without disabling the field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onAddressSelect(value);
  };

  // Load Google Maps API once
  useEffect(() => {
    // Only attempt to load the script once
    if (mapsLoadedRef.current || document.getElementById('google-maps-script')) {
      // Script already loading or loaded
      return;
    }
    
    // Mark as loaded to prevent duplicate loading
    mapsLoadedRef.current = true;
    
    // Load the Google Maps script
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    // Check periodically if Google Maps is available
    const checkGoogleMaps = setInterval(() => {
      if (window.google?.maps?.places) {
        clearInterval(checkGoogleMaps);
        setupAutocomplete();
      }
    }, 300);
    
    // Set a timeout to clear the interval
    const timeout = setTimeout(() => {
      clearInterval(checkGoogleMaps);
    }, 10000);
    
    // Add the script to the page
    document.head.appendChild(script);
    
    // Cleanup function
    return () => {
      clearInterval(checkGoogleMaps);
      clearTimeout(timeout);
    };
  }, []);
  
  // Attach autocomplete to the input field
  const setupAutocomplete = () => {
    if (!inputRef.current || !window.google?.maps?.places) {
      return;
    }
    
    try {
      // Clean up any existing autocomplete
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
      
      // Create a new autocomplete instance
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        fields: ['formatted_address', 'geometry', 'place_id']
      });
      
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
      console.error('Error setting up Google Maps Autocomplete:', error);
    }
  };
  
  // Initialize autocomplete when the input element is available
  useEffect(() => {
    if (window.google?.maps?.places && inputRef.current) {
      setupAutocomplete();
    }
  }, [inputRef.current]);
  
  // Clean up on unmount
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
        value={inputValue}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (inputValue) {
              onAddressSelect(inputValue);
            }
          }
        }}
        id={id}
        placeholder={placeholder}
        className={cn("w-full outline-none bg-transparent text-sm", className)}
        autoComplete="off"
        spellCheck="false"
        aria-label="Enter your address"
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
      />
    </div>
  );
}

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