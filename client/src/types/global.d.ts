// Global type definitions for the application

// Type definitions for Google Identity Services
declare global {
  interface CredentialResponse {
    credential: string;
    clientId: string;
    select_by: string;
  }
}

// Extend the window interface for global objects
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
            getPlace: () => { 
              formatted_address?: string; 
              place_id?: string;
              geometry?: {
                location?: {
                  lat: () => number;
                  lng: () => number;
                }
              }
            };
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
    handleGoogleCredential?: (response: CredentialResponse) => void;
    handleCredentialResponse?: (response: CredentialResponse) => void;
    initAutocomplete?: () => void;
    googleMapsScriptLoading?: boolean;
  }
}

export {};