declare namespace google {
  namespace maps {
    namespace places {
      class Autocomplete {
        constructor(inputField: HTMLInputElement, options?: AutocompleteOptions);
        addListener(eventName: string, handler: Function): void;
        getPlace(): AutocompleteResult;
      }

      interface AutocompleteOptions {
        bounds?: any;
        componentRestrictions?: { country: string | string[] };
        fields?: string[];
        strictBounds?: boolean;
        types?: string[];
      }

      interface AutocompleteResult {
        address_components?: AddressComponent[];
        formatted_address?: string;
        geometry?: {
          location: {
            lat(): number;
            lng(): number;
          };
          viewport: any;
        };
        name?: string;
        place_id?: string;
      }

      interface AddressComponent {
        long_name: string;
        short_name: string;
        types: string[];
      }
    }

    namespace event {
      function clearInstanceListeners(instance: any): void;
    }
  }
}