import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Define the interface for the component props
interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string, additionalData?: { city?: string; state?: string; zip?: string }) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  required?: boolean;
  name?: string;
  id?: string;
  disabled?: boolean;
  error?: string;
  description?: string;
}

// Define the component itself
export function AddressAutocomplete({
  value,
  onChange,
  placeholder = "Start typing your address...",
  label,
  className,
  required,
  name,
  id,
  disabled,
  error,
  description
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingScript, setIsLoadingScript] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Load the Google Maps API script
  useEffect(() => {
    if (window.google?.maps?.places) {
      setIsLoaded(true);
      return;
    }

    setIsLoadingScript(true);

    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
      setIsLoadingScript(false);
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps API");
      setIsLoadingScript(false);
    };

    document.head.appendChild(script);

    return () => {
      // Clean up script if component unmounts during loading
      if (document.head.contains(script) && !isLoaded) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize the autocomplete once the API is loaded
  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    const options = {
      componentRestrictions: { country: "us" }, // Restrict to US addresses
      fields: ["address_components", "formatted_address", "geometry", "name"],
      types: ["address"]
    };

    autocompleteRef.current = new google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    // Add a listener for place selection
    autocompleteRef.current.addListener("place_changed", () => {
      if (!autocompleteRef.current) return;

      const place = autocompleteRef.current.getPlace();
      
      if (!place.address_components) return;
      
      // Get formatted address
      const fullAddress = place.formatted_address || "";
      
      // Extract address components
      let city = "";
      let state = "";
      let zip = "";
      
      place.address_components.forEach(component => {
        const types = component.types;
        
        if (types.includes("locality")) {
          city = component.long_name;
        } else if (types.includes("administrative_area_level_1")) {
          state = component.short_name;
        } else if (types.includes("postal_code")) {
          zip = component.long_name;
        }
      });
      
      // Call the onChange handler with the full address and additional data
      onChange(fullAddress, { city, state, zip });
    });

    return () => {
      // Clean up listener if component unmounts
      if (autocompleteRef.current && window.google?.maps?.event) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, onChange]);

  return (
    <div className="relative">
      {label && (
        <Label htmlFor={id || name} className={cn("text-blue-800", required && "after:content-['*'] after:ml-1 after:text-red-500")}>
          {label}
        </Label>
      )}
      <div className="relative mt-1">
        <Input
          ref={inputRef}
          type="text"
          name={name}
          id={id || name}
          disabled={disabled || isLoadingScript}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isLoadingScript ? "Loading address search..." : placeholder}
          className={cn("border-blue-200 focus-visible:ring-blue-700", error && "border-red-500", className)}
        />
        {isLoadingScript && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>
      {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
      {description && <div className="text-xs text-blue-500 mt-1">{description}</div>}
    </div>
  );
}

// Form field version of the component for use with react-hook-form
export function FormAddressAutocomplete({
  form, name, label, placeholder, description, disabled
}: {
  form: any;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <FormItem>
      {label && <FormLabel className="text-blue-800">{label}</FormLabel>}
      <FormControl>
        <AddressAutocomplete
          value={form.watch(name) || ""}
          onChange={(value, additionalData) => {
            form.setValue(name, value, { shouldValidate: true });
            
            // If we have additional fields to update and they exist in the form
            if (additionalData) {
              if (additionalData.city && form.getValues('city') !== undefined) {
                form.setValue('city', additionalData.city, { shouldValidate: true });
              }
              if (additionalData.state && form.getValues('state') !== undefined) {
                form.setValue('state', additionalData.state, { shouldValidate: true });
              }
              if (additionalData.zip && form.getValues('zip') !== undefined) {
                form.setValue('zip', additionalData.zip, { shouldValidate: true });
              }
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          error={form.formState.errors[name]?.message}
          description={description}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}