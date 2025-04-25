// Define interfaces for Google auth types
interface GoogleUser {
  getBasicProfile(): GoogleProfile;
  getAuthResponse(includeAuthorizationData?: boolean): GoogleAuthResponse;
  getId(): string;
  isSignedIn(): boolean;
  hasGrantedScopes(scopes: string): boolean;
  disconnect(): void;
  grantOfflineAccess(options: object): Promise<{code: string}>;
  signIn(options?: object): Promise<any>;
}

interface GoogleProfile {
  getId(): string;
  getName(): string;
  getGivenName(): string;
  getFamilyName(): string;
  getImageUrl(): string;
  getEmail(): string;
}

interface GoogleAuthResponse {
  access_token: string;
  id_token: string;
  scope: string;
  expires_in: number;
  first_issued_at: number;
  expires_at: number;
}

interface AuthInstance {
  isSignedIn: {
    get(): boolean;
    listen(listener: (isSignedIn: boolean) => void): void;
  };
  currentUser: {
    get(): GoogleUser;
    listen(listener: (user: GoogleUser) => void): void;
  };
  signIn(options?: object): Promise<GoogleUser>;
  signOut(): Promise<void>;
  disconnect(): Promise<void>;
}

// Declare global gapi object
declare global {
  interface Window {
    gapi: {
      load(api: string, callback: () => void): void;
      auth2: {
        init(params: {client_id: string}): Promise<AuthInstance>;
        getAuthInstance(): AuthInstance;
      };
    };
    onGoogleSignIn?: (user: any) => void;
  }
}

// Will store the auth instance once initialized
let googleAuth: AuthInstance | null = null;

// Function to initialize Google Auth
export const initializeGoogleAuth = (): Promise<AuthInstance> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.gapi) {
      reject(new Error('Google API not available'));
      return;
    }

    if (googleAuth) {
      resolve(googleAuth);
      return;
    }

    window.gapi.load('auth2', () => {
      try {
        // Log the current origin to help with debugging
        console.log('Current origin:', window.location.origin);
        
        // Cast params to any to bypass TypeScript limitations
        window.gapi.auth2
          .init({
            client_id: '107759557190-0j8kms29569g55to0sv10i9ilig10qbv.apps.googleusercontent.com',
            cookie_policy: 'single_host_origin',
            scope: 'profile email',
          } as any)
          .then((auth: AuthInstance) => {
            googleAuth = auth;
            console.log('Google Auth initialized successfully');
            resolve(auth);
          })
          .catch((error: Error) => {
            console.error('Error initializing Google Auth:', error);
            reject(error);
          });
      } catch (error) {
        console.error('Error loading auth2:', error);
        reject(error);
      }
    });
  });
};

// Function to sign in with Google
export const signInWithGoogle = async (): Promise<any> => {
  try {
    const auth = await initializeGoogleAuth();
    const googleUser = await auth.signIn({
      scope: 'profile email',
    });
    
    const profile = googleUser.getBasicProfile();
    const authResponse = googleUser.getAuthResponse();
    
    return {
      id: profile.getId(),
      email: profile.getEmail(),
      name: profile.getName(),
      givenName: profile.getGivenName(),
      familyName: profile.getFamilyName(),
      imageUrl: profile.getImageUrl(),
      token: authResponse.id_token,
    };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Function to sign out from Google
export const signOutFromGoogle = async (): Promise<void> => {
  try {
    const auth = await initializeGoogleAuth();
    await auth.signOut();
  } catch (error) {
    console.error('Error signing out from Google:', error);
    throw error;
  }
};

// Function to check if user is signed in
export const isGoogleSignedIn = async (): Promise<boolean> => {
  try {
    const auth = await initializeGoogleAuth();
    return auth.isSignedIn.get();
  } catch (error) {
    console.error('Error checking Google sign-in status:', error);
    return false;
  }
};

// Callback function for Google Sign-In button
export const onSignIn = (googleUser: any) => {
  try {
    const profile = googleUser.getBasicProfile();
    const id = profile.getId();
    const name = profile.getName();
    const imageUrl = profile.getImageUrl();
    const email = profile.getEmail();
    
    const userData = {
      id,
      name,
      imageUrl,
      email,
    };
    
    console.log('Google user signed in:', userData);
    
    // Call the global callback if defined
    if (window.onGoogleSignIn) {
      window.onGoogleSignIn(userData);
    }
    
    return userData;
  } catch (error) {
    console.error('Error in onSignIn callback:', error);
    throw error;
  }
};

// Set the global callback
window.onGoogleSignIn = onSignIn;