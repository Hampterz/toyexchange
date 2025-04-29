// Type definitions for Google Identity and Maps APIs

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: () => void;
        };
        oauth2?: {
          initTokenClient: (config: any) => any;
        };
      };
      maps?: {
        places?: {
          Autocomplete: new (input: HTMLInputElement, options?: Record<string, any>) => any;
          PlaceAutocompleteElement?: any;
        };
        event?: {
          clearInstanceListeners: (instance: any) => void;
        };
      };
    };
    handleCredentialResponse?: (response: any) => void;
    handleGoogleCredential?: (response: any) => void;
  }
}

export {};