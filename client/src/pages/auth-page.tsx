import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { loginUserSchema, registerUserSchema } from "@/hooks/use-auth";
import { initializeGoogleAuth, renderGoogleButton, signInWithGoogle, handleCredential } from "@/lib/googleAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { KonamiConfetti } from "@/components/ui/konami-confetti";
import { AddressAutocomplete } from "@/components/address-autocomplete";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [_, navigate] = useLocation();
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const registerGoogleButtonRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Initialize Google Auth when component mounts
  useEffect(() => {
    // If user is already logged in, redirect to home page
    if (user) {
      navigate("/");
      return;
    }

    let googleAuthInitialized = false;

    // Setup Google Identity Services
    const setupGoogleAuth = async () => {
      if (googleAuthInitialized) return;
      
      try {
        // Set the global credential handler
        window.handleCredentialResponse = (response) => {
          processGoogleCredential(response);
        };
        
        window.handleGoogleCredential = (response) => {
          processGoogleCredential(response);
        };
        
        // Wait for Google Identity Services to load and initialize
        await initializeGoogleAuth();
        googleAuthInitialized = true;
        
        // We're not using the Google native buttons anymore, just our custom ones
        // Keeping this comment for reference in case we need to revert
      } catch (error) {
        console.error("Failed to initialize Google Auth:", error);
        toast({
          title: "Google Sign-in Error",
          description: "Could not initialize Google sign-in. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    // Process Google credential response
    const processGoogleCredential = async (response: any) => {
      try {
        setIsGoogleSigningIn(true);
        const googleUser = handleCredential(response);
        
        if (googleUser) {
          console.log("Google user data:", googleUser);
          
          // Try to get user's location
          let location = "";
          
          try {
            if (navigator.geolocation) {
              // Create a promise from the geolocation API
              const getPosition = () => new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                  position => resolve(position),
                  error => reject(error),
                  { timeout: 5000, maximumAge: 60000 }
                );
              });
              
              // Try to get location
              const position = await getPosition() as GeolocationPosition;
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              
              // We have coordinates, now try to get a formatted address via reverse geocoding
              const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
              
              try {
                const geocodeResponse = await fetch(geocodingUrl);
                const geocodeData = await geocodeResponse.json();
                
                if (geocodeData.results && geocodeData.results.length > 0) {
                  location = geocodeData.results[0].formatted_address;
                  console.log("Got user location:", location);
                }
              } catch (geocodeError) {
                console.error("Error during reverse geocoding:", geocodeError);
                // Just use coordinates as a fallback
                location = `${lat.toFixed(6)},${lng.toFixed(6)}`;
              }
            }
          } catch (geoError) {
            console.error("Error getting user location:", geoError);
            // Continue with no location - we'll prompt them for it later
          }
          
          try {
            // Call our backend API to create/login the user with Google credentials
            const res = await apiRequest('POST', '/api/google-auth', {
              id: googleUser.id,
              email: googleUser.email,
              name: googleUser.name,
              picture: googleUser.imageUrl,
              location: location, // Add location if we have it
            });
            
            if (!res.ok) {
              throw new Error(`Server error: ${res.status}`);
            }
            
            // Get the authenticated user from response
            const userData = await res.json();
            
            // Show success notification
            toast({
              title: "Google Sign-in Successful",
              description: `Welcome, ${userData.name || 'User'}!`,
              variant: "default",
            });
            
            // Redirect to home page
            navigate('/');
          } catch (apiError) {
            console.error("API error during Google auth:", apiError);
            throw new Error("Failed to authenticate with server");
          }
        } else {
          throw new Error("Could not process Google credentials");
        }
      } catch (error) {
        console.error("Error handling Google sign-in:", error);
        toast({
          title: "Google Sign-in Failed",
          description: "Unable to process Google sign-in. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsGoogleSigningIn(false);
      }
    };
    
    // Try to initialize Google Auth
    if (document.readyState === 'complete') {
      setupGoogleAuth();
    } else {
      window.addEventListener('load', setupGoogleAuth);
    }
    
    // Clean up
    return () => {
      window.removeEventListener('load', setupGoogleAuth);
    };
  }, [user, navigate, toast]);
  
  // Konami code Easter egg - admin login sequence: ↑ ↑ ↓ ↓ ← → ← → B A
  useEffect(() => {
    // Skip if user is already logged in
    if (user) return;
    
    const konamiCode = [
      'ArrowUp', 'ArrowUp',
      'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight',
      'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    let konamiIndex = 0;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the key pressed matches the next key in the Konami code
      const requiredKey = konamiCode[konamiIndex].toLowerCase();
      const pressedKey = e.key.toLowerCase();
      
      if (pressedKey === requiredKey) {
        konamiIndex++;
        
        // If all keys have been pressed in the correct sequence
        if (konamiIndex === konamiCode.length) {
          adminLogin();
          konamiIndex = 0; // Reset after successful entry
        }
      } else {
        konamiIndex = 0; // Reset on any wrong key
        
        // If the user pressed the first key of the sequence, start over
        if (pressedKey === konamiCode[0].toLowerCase()) {
          konamiIndex = 1;
        }
      }
    };
    
    const adminLogin = async () => {
      // Visual feedback that the Konami code was recognized
      toast({
        title: "Admin Mode Activated!",
        description: "Welcome, ToyShare Admin. Logging you in...",
        variant: "default",
      });
      
      // Show confetti celebration animation
      setShowConfetti(true);
      
      try {
        // Use the login mutation to properly update auth context with the main admin account
        loginMutation.mutate(
          { 
            username: "adminsreyas",
            password: "Jell1boi!!"
          },
          {
            onSuccess: () => {
              // Keep showing confetti for a moment before redirecting
              setTimeout(() => {
                navigate("/");
              }, 2000);
            },
            onError: () => {
              setShowConfetti(false);
              toast({
                title: "Admin Login Failed",
                description: "Unable to login as admin. Please try again later.",
                variant: "destructive",
              });
            }
          }
        );
      } catch (error) {
        setShowConfetti(false);
        toast({
          title: "Admin Login Failed",
          description: "Unable to login as admin. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [user, navigate, toast, loginMutation]);

  // Login form
  const loginForm = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerUserSchema>>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      name: "",
      location: "",
      profilePicture: "",
    },
  });

  const onLoginSubmit = (data: z.infer<typeof loginUserSchema>) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: z.infer<typeof registerUserSchema>) => {
    registerMutation.mutate(data);
  };
  
  // Handle Google Sign-in
  const handleGoogleSignIn = () => {
    try {
      setIsGoogleSigningIn(true);
      
      // Show Google Sign-In prompt
      signInWithGoogle();
      
      // Note: The actual sign-in will be handled by the callback registered in useEffect
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Google Sign-in Failed",
        description: "Unable to sign in with Google. Please try again.",
        variant: "destructive",
      });
      setIsGoogleSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 page-transition">
      {/* Konami Code Confetti */}
      {showConfetti && <KonamiConfetti />}
      
      <div className="max-w-6xl w-full flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Left Side - Auth Forms */}
        <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center mb-6">
              <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
                <i className="fas fa-gamepad text-white text-xl"></i>
              </div>
              <span className="text-2xl font-bold font-heading text-blue-700 ml-2">ToyShare</span>
            </Link>
            <h1 className="text-2xl font-bold text-blue-900 mb-1">Welcome to ToyShare</h1>
            <p className="text-blue-700">Connect with parents in your community</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-blue-50">
              <TabsTrigger value="login" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white click-scale">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white click-scale">Create Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="border-blue-100">
                <CardContent className="pt-6">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-800">Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your username" className="border-blue-200 focus-visible:ring-blue-700" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-800">Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter your password" className="border-blue-200 focus-visible:ring-blue-700" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-blue-700 hover:bg-blue-800 btn-animated"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Signing in..." : "Sign In"}
                      </Button>

                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-blue-200"></span>
                        </div>
                        <div className="relative flex justify-center text-xs text-blue-500">
                          <span className="px-2 bg-white">Or continue with</span>
                        </div>
                      </div>
                      

                      
                      <Button 
                        type="button"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => signInWithGoogle()}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                          </g>
                        </svg>
                        Sign in with Google
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card className="border-blue-100">
                <CardContent className="pt-6">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-800">Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" className="border-blue-200 focus-visible:ring-blue-700" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-blue-800">Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Choose a username" className="border-blue-200 focus-visible:ring-blue-700" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-blue-800">Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter your email" className="border-blue-200 focus-visible:ring-blue-700" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-800">Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Create a password" className="border-blue-200 focus-visible:ring-blue-700" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-800">Location (Full Address)</FormLabel>
                            <FormControl>
                              <AddressAutocomplete 
                                placeholder="Start typing your address..." 
                                className="border-blue-200 focus-visible:ring-blue-700" 
                                defaultValue={field.value}
                                onAddressSelect={(address) => {
                                  field.onChange(address);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-blue-500 mt-1">
                              Please provide your full address for accurate toy exchange locations.
                              Your exact address will only be shared when you agree to exchange a toy.
                            </p>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-blue-700 hover:bg-blue-800 btn-animated"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Creating account..." : "Create Account"}
                      </Button>

                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-blue-200"></span>
                        </div>
                        <div className="relative flex justify-center text-xs text-blue-500">
                          <span className="px-2 bg-white">Or continue with</span>
                        </div>
                      </div>
                      
                      <Button 
                        type="button"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => signInWithGoogle()}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                          </g>
                        </svg>
                        Sign up with Google
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right Side - Hero Section */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 p-8 md:p-12 flex flex-col justify-center text-white">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-4">Share Toys, Build Community</h2>
            <p className="mb-6 text-blue-100">
              Join our growing community of parents exchanging toys, reducing waste, and 
              creating connections. ToyShare helps you find and give away toys to other
              families near you.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 p-2 rounded-full mt-1">
                  <i className="fas fa-leaf text-lg"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Sustainable Parenting</h3>
                  <p className="text-blue-100">
                    Extend the life of toys by passing them on when your children outgrow them.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 p-2 rounded-full mt-1">
                  <i className="fas fa-users text-lg"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Local Connections</h3>
                  <p className="text-blue-100">
                    Meet other parents in your neighborhood through toy exchanges.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 p-2 rounded-full mt-1">
                  <i className="fas fa-piggy-bank text-lg"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Save Money</h3>
                  <p className="text-blue-100">
                    Access quality toys without the cost of buying new every time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}