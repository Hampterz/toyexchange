// Import global type definitions from global.d.ts

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

// Client ID for the application - using environment variable with fallback
const CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID || '107759557190-0j8kms29569g55to0sv10i9ilig10qbv.apps.googleusercontent.com';

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

// Wait for Google Identity Services to load
const waitForGoogleLibrary = (timeout = 10000): Promise<void> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkLibrary = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        console.log(`Google Identity Services loaded after ${Date.now() - startTime}ms`);
        resolve();
        return;
      }

      if (Date.now() - startTime > timeout) {
        reject(new Error(`Google Identity Services not loaded after ${timeout}ms`));
        return;
      }

      setTimeout(checkLibrary, 100);
    };

    checkLibrary();
  });
};

// Function to initialize Google Sign-In
export const initializeGoogleAuth = async (): Promise<void> => {
  try {
    console.log('Current origin:', window.location.origin);
    
    // Wait for Google Identity Services to load
    await waitForGoogleLibrary();

    // Initialize Google Identity Services
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      throw new Error('Google Identity Services not loaded or properly initialized');
    }
    
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (response: CredentialResponse) => {
        // This sets handleCredentialResponse as the official callback
        if (window.handleCredentialResponse) {
          window.handleCredentialResponse(response);
        }
        
        // Also support our custom callback
        if (window.handleGoogleCredential) {
          window.handleGoogleCredential(response);
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    
    console.log('Google Identity Services initialized successfully');
  } catch (error) {
    console.error('Error initializing Google Identity Services:', error);
    throw error;
  }
};

// Function to render Google Sign-In button
export const renderGoogleButton = (element: HTMLElement): void => {
  if (!window.google || !window.google.accounts || !window.google.accounts.id) {
    console.error('Google Identity Services not loaded when trying to render button');
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
      width: element.offsetWidth || 240,
    });
    console.log('Google Sign-In button rendered');
  } catch (error) {
    console.error('Error rendering Google Sign-In button:', error);
  }
};

// Function to sign in with Google (prompt user to select account)
export const signInWithGoogle = (): void => {
  if (!window.google || !window.google.accounts || !window.google.accounts.id) {
    console.error('Google Identity Services not loaded when trying to sign in');
    return;
  }
  
  try {
    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        console.error('Google Sign-In prompt not displayed:', notification.getNotDisplayedReason() || notification.getSkippedReason());
      } else {
        console.log('Google Sign-In prompt displayed');
      }
    });
  } catch (error) {
    console.error('Error showing Google Sign-In prompt:', error);
  }
};

// Function to sign out from Google
export const signOutFromGoogle = (email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      console.error('Google Identity Services not loaded when trying to sign out');
      reject(new Error('Google Identity Services not loaded'));
      return;
    }
    
    try {
      window.google.accounts.id.disableAutoSelect();
      
      window.google.accounts.id.revoke(email, () => {
        console.log('Google Sign-Out successful');
        resolve();
      });
    } catch (error) {
      console.error('Error signing out from Google:', error);
      reject(error);
    }
  });
};

// Function to handle credential response
export const handleCredential = (response: CredentialResponse): GoogleUser | null => {
  try {
    if (!response || !response.credential) {
      console.error('Invalid credential response');
      return null;
    }
    
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
window.handleCredentialResponse = handleCredential;