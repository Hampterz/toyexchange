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
}: AddressAutocompleteProps): JSX.Element {
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
      
      // Create a new autocomplete instance with specific options to improve clickability
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
          
          // Log the selected place and call the callback
          console.log("Place selected:", place.formatted_address);
          if (coordinates) console.log("Selected coordinates:", coordinates);
          onAddressSelect(place.formatted_address, coordinates, place.place_id);
        } else if (place && place.name) {
          // Sometimes place.formatted_address is missing but place.name exists
          setInputValue(place.name);
          
          let coordinates;
          if (place.geometry && place.geometry.location) {
            coordinates = {
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng()
            };
          }
          
          onAddressSelect(place.name, coordinates, place.place_id);
        }
      });
    } catch (error) {
      console.error('Error setting up Google Maps Autocomplete:', error);
    }
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

  // Update the Google Autocomplete styling to make it more clickable
  // and prevent the dialog from closing when selecting an address
  useEffect(() => {
    // Add a style tag to make Google's autocomplete dropdown more clickable
    const styleId = "google-autocomplete-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        .pac-container {
          z-index: 9999 !important;
          pointer-events: auto !important;
        }
        .pac-item {
          cursor: pointer !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Add a global event listener to prevent clicks within the pac-container
    // from bubbling up and closing parent dialogs
    const preventClosing = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if the click is within a pac-container
      if (target.closest('.pac-container')) {
        e.stopPropagation();
      }
    };
    
    document.addEventListener('mousedown', preventClosing, true);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', preventClosing, true);
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
          // Prevent form submission on Enter key to allow selecting from dropdown
          if (e.key === 'Enter') {
            e.preventDefault();
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