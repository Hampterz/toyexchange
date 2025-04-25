// Define interfaces for Google Identity Services
interface CredentialResponse {
  credential: string;
  clientId: string;
  select_by: string;
}

interface DecodedCredential {
  iss: string;
  nbf: number;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  azp: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
}

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  givenName: string;
  familyName: string;
  imageUrl: string;
  token: string;
}

// Declare global window object with Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: (notification?: any) => void;
          disableAutoSelect: () => void;
        };
      };
    };
    handleGoogleCredential?: (response: CredentialResponse) => void;
  }
}

// Client ID for the application
const CLIENT_ID = '107759557190-0j8kms29569g55to0sv10i9ilig10qbv.apps.googleusercontent.com';

// Function to decode JWT token
function decodeJWT(token: string): DecodedCredential | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// Function to initialize Google Sign-In
export const initializeGoogleAuth = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.google) {
      console.log('Current origin:', window.location.origin);
      console.error('Google Identity Services not available');
      reject(new Error('Google Identity Services not available'));
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (response: CredentialResponse) => {
          if (window.handleGoogleCredential) {
            window.handleGoogleCredential(response);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      
      console.log('Google Identity Services initialized successfully');
      resolve();
    } catch (error) {
      console.error('Error initializing Google Identity Services:', error);
      reject(error);
    }
  });
};

// Function to render Google Sign-In button
export const renderGoogleButton = (element: HTMLElement): void => {
  if (!window.google) {
    console.error('Google Identity Services not loaded');
    return;
  }

  try {
    window.google.accounts.id.renderButton(element, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      width: element.offsetWidth,
    });
    console.log('Google Sign-In button rendered');
  } catch (error) {
    console.error('Error rendering Google Sign-In button:', error);
  }
};

// Function to sign in with Google (prompt user to select account)
export const signInWithGoogle = (): void => {
  if (!window.google) {
    console.error('Google Identity Services not loaded');
    return;
  }
  
  try {
    window.google.accounts.id.prompt();
    console.log('Google Sign-In prompt displayed');
  } catch (error) {
    console.error('Error showing Google Sign-In prompt:', error);
  }
};

// Function to sign out from Google
export const signOutFromGoogle = (): void => {
  if (!window.google) {
    console.error('Google Identity Services not loaded');
    return;
  }
  
  try {
    window.google.accounts.id.disableAutoSelect();
    console.log('Google Sign-Out successful');
  } catch (error) {
    console.error('Error signing out from Google:', error);
  }
};

// Function to handle credential response
export const handleCredential = (response: CredentialResponse): GoogleUser | null => {
  try {
    const decodedCredential = decodeJWT(response.credential);
    
    if (!decodedCredential) {
      throw new Error('Failed to decode credential');
    }
    
    const userData: GoogleUser = {
      id: decodedCredential.sub,
      email: decodedCredential.email,
      name: decodedCredential.name,
      givenName: decodedCredential.given_name,
      familyName: decodedCredential.family_name,
      imageUrl: decodedCredential.picture,
      token: response.credential,
    };
    
    console.log('Google sign-in successful:', userData);
    return userData;
  } catch (error) {
    console.error('Error handling Google credential:', error);
    return null;
  }
};

// Set the global callback
window.handleGoogleCredential = handleCredential;