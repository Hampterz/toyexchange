// Define the OAuth client ID
const GOOGLE_CLIENT_ID = '107759557190-0j8kms29569g55to0sv10i9ilig10qbv.apps.googleusercontent.com';

// This function initiates Google OAuth sign-in by redirecting the user to Google's authorization page
export const signInWithGoogle = async () => {
  try {
    // Google OAuth endpoint
    const authUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    
    // OAuth parameters
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: `${window.location.origin}/auth`,
      response_type: 'token',
      scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      state: Math.random().toString(36).substring(2),
      prompt: 'select_account',
    });
    
    // Redirect to Google's OAuth sign-in page
    window.location.href = `${authUrl}?${params.toString()}`;
    
    // Return a dummy success since this function redirects and doesn't return
    return { redirecting: true };
  } catch (error) {
    console.error("Error initiating Google sign in:", error);
    throw error;
  }
};

// This function handles the OAuth callback after Google authorization
export const handleGoogleCallback = async () => {
  // Parse the access token from the URL hash
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  
  if (!accessToken) {
    return null;
  }
  
  try {
    // Use the access token to get user info from Google
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const userData = await response.json();
    
    // Return the user data
    return {
      sub: userData.sub, // This is like a user ID
      email: userData.email,
      displayName: userData.name,
      givenName: userData.given_name,
      familyName: userData.family_name,
      photoURL: userData.picture,
      token: accessToken
    };
  } catch (error) {
    console.error("Error processing Google sign-in callback:", error);
    throw error;
  }
};