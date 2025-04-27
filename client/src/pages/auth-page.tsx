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
        
        // Render Google buttons in containers
        if (googleButtonRef.current) {
          renderGoogleButton(googleButtonRef.current);
        }
        
        if (registerGoogleButtonRef.current) {
          renderGoogleButton(registerGoogleButtonRef.current);
        }
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
          
          try {
            // Call our backend API to create/login the user with Google credentials
            const res = await apiRequest('POST', '/api/google-auth', {
              id: googleUser.id,
              email: googleUser.email,
              name: googleUser.name,
              picture: googleUser.imageUrl,
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
                      
                      {/* Container for Google's Identity Services button (will be rendered by script) */}
                      <div className="w-full mt-2">
                        <div ref={googleButtonRef} id="google-signin-button" className="w-full"></div>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Google sign-in requires domain registration in Google Cloud Console.
                      </p>
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
                              <Input 
                                placeholder="e.g. 123 Main St, Apt 4, Seattle, WA 98101" 
                                className="border-blue-200 focus-visible:ring-blue-700" 
                                {...field} 
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
                      
                      {/* Container for Google's Identity Services button (register tab) */}
                      <div className="w-full mt-2">
                        <div ref={registerGoogleButtonRef} id="google-register-button" className="w-full"></div>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Google sign-in requires domain registration in Google Cloud Console.
                      </p>
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