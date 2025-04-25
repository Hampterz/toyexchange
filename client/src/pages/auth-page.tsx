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

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [_, navigate] = useLocation();
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
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
    const processGoogleCredential = (response: any) => {
      try {
        setIsGoogleSigningIn(true);
        const googleUser = handleCredential(response);
        
        if (googleUser) {
          // Show a toast notification
          toast({
            title: "Google Sign-in Successful",
            description: `Welcome, ${googleUser.name || 'User'}!`,
            variant: "default",
          });
          
          // For now, just log and redirect (you'd normally call your backend here)
          console.log("Google sign-in successful:", googleUser);
          
          // Redirect to home page
          navigate('/');
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
                      
                      {/* Custom Google Sign-In Button */}
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full flex items-center justify-center space-x-2 border-blue-200 hover:bg-blue-50"
                        disabled={isGoogleSigningIn}
                        onClick={handleGoogleSignIn}
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                          <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        <span>{isGoogleSigningIn ? "Signing in..." : "Sign in with Google"}</span>
                      </Button>
                      
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Google sign-in requires domain registration in Google Cloud Console.
                      </p>
                      
                      {/* Container for Google's Identity Services button (will be rendered by script) */}
                      <div className="w-full mt-3">
                        <div ref={googleButtonRef} id="google-signin-button" className="w-full"></div>
                      </div>
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

                      {/* Custom Google Sign-In Button */}
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full flex items-center justify-center space-x-2 border-blue-200 hover:bg-blue-50"
                        disabled={isGoogleSigningIn}
                        onClick={handleGoogleSignIn}
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                          <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        <span>{isGoogleSigningIn ? "Signing in..." : "Sign in with Google"}</span>
                      </Button>
                      
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Google sign-in requires domain registration in Google Cloud Console.
                      </p>
                      
                      {/* Container for Google's Identity Services button (register tab) */}
                      <div className="w-full mt-3">
                        <div ref={registerGoogleButtonRef} id="google-register-button" className="w-full"></div>
                      </div>
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