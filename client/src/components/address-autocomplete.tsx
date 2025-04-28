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
  const [apiLoaded, setApiLoaded] = useState(false);
  const [showFallbackMessage, setShowFallbackMessage] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  // Check if Google Maps script is already loaded in the DOM
  const isScriptLoaded = () => {
    return document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`) !== null;
  };

  // Check if Google Maps API is fully initialized
  const isGoogleMapsLoaded = () => {
    return window.google && window.google.maps && window.google.maps.places;
  };

  // Load Google Maps script if not already loaded
  useEffect(() => {
    // Skip if already initialized or script is loading
    if (isInitialized || window.googleMapsScriptLoading) {
      return;
    }
    
    // If API already loaded, initialize directly
    if (isGoogleMapsLoaded()) {
      console.log("Google Maps API already loaded, initializing autocomplete");
      setApiLoaded(true);
      return;
    }
    
    // Skip if script already in DOM but API not fully loaded yet
    if (isScriptLoaded()) {
      // Wait for API to initialize
      const checkInterval = setInterval(() => {
        if (isGoogleMapsLoaded()) {
          setApiLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);
      
      // Timeout after 5 seconds
      const timeout = setTimeout(() => {
        clearInterval(checkInterval);
        setShowFallbackMessage(true);
      }, 5000);
      
      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeout);
      };
    }
    
    // Load the script
    console.log("Loading Google Maps API script");
    window.googleMapsScriptLoading = true;
    
    // Create callback function for when script loads
    window.initAutocomplete = () => {
      console.log("Google Maps API initialized via callback");
      window.googleMapsScriptLoading = false;
      setApiLoaded(true);
    };
    
    // Create and append script element
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initAutocomplete`;
    script.async = true;
    script.defer = true;
    
    script.onerror = () => {
      console.error("Failed to load Google Maps API");
      window.googleMapsScriptLoading = false;
      setShowFallbackMessage(true);
    };
    
    document.head.appendChild(script);
    
    // Fallback timeout
    const fallbackTimer = setTimeout(() => {
      if (!isGoogleMapsLoaded()) {
        setShowFallbackMessage(true);
      }
    }, 7000);
    
    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [apiKey]);

  // Initialize autocomplete when API is loaded
  useEffect(() => {
    if (apiLoaded && inputRef.current && !isInitialized) {
      initializeAutocomplete();
    }
  }, [apiLoaded, inputRef.current, isInitialized]);

  // Initialize the autocomplete functionality
  const initializeAutocomplete = () => {
    if (!inputRef.current || !isGoogleMapsLoaded()) {
      console.log("Cannot initialize autocomplete - missing input ref or Google API");
      setShowFallbackMessage(true);
      return;
    }
    
    try {
      console.log("Initializing Google Maps Autocomplete");
      
      // Create the autocomplete instance
      if (window.google?.maps?.places?.Autocomplete) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ["address"],
          fields: ["formatted_address", "geometry", "place_id"],
        });
      } else {
        throw new Error("Google Maps Places Autocomplete not available");
      }
      
      // Add listener for place_changed event
      autocompleteRef.current.addListener("place_changed", () => {
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
      
      setIsInitialized(true);
      setShowFallbackMessage(false);
      console.log("Google Maps Autocomplete initialized successfully");
    } catch (error) {
      console.error("Error initializing Google Maps Autocomplete:", error);
      setShowFallbackMessage(true);
    }
  };

  // When component unmounts, clean up the autocomplete
  useEffect(() => {
    return () => {
      if (autocompleteRef.current && autocompleteRef.current.unbindAll) {
        autocompleteRef.current.unbindAll();
      }
      autocompleteRef.current = null;
    };
  }, []);

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Always pass the value to parent to prevent validation errors
    onAddressSelect(newValue);
  };

  // Handle manual form submission if user presses enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Don't block Enter key if autocomplete dropdown is showing
    if (e.key === 'Enter' && document.querySelector('.pac-container:not(.pac-logo)')) {
      return;
    }
    
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        onAddressSelect(inputValue);
      }
    }
  };

  // Focus handling to help with autocomplete
  const handleFocus = () => {
    // Re-initialize on focus if needed and API is available
    if (!isInitialized && isGoogleMapsLoaded() && inputRef.current) {
      initializeAutocomplete();
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
        onFocus={handleFocus}
        required={required}
        autoFocus={autoFocus}
        disabled={disabled}
        autoComplete="off"
        spellCheck="false"
        aria-label="Enter your address"
        inputMode="text"
      />
      {showFallbackMessage && (
        <p className="text-xs text-amber-500 mt-1">
          Address suggestions unavailable. You can still type your address manually.
        </p>
      )}
    </div>
  );
}