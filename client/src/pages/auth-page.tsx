import { useEffect, useState } from "react";
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
import { signInWithGoogle, handleGoogleCallback } from "@/lib/googleAuth";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [_, navigate] = useLocation();
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const { toast } = useToast();
  
  // Check for Google OAuth callback and for logged in users
  useEffect(() => {
    // If user is already logged in, redirect to home page
    if (user) {
      navigate("/");
      return;
    }

    // Check if this is a callback from Google OAuth
    if (window.location.hash && window.location.hash.includes('access_token')) {
      const processGoogleCallback = async () => {
        try {
          setIsGoogleSigningIn(true);
          const googleUserData = await handleGoogleCallback();
          
          if (googleUserData) {
            // Show success message
            toast({
              title: "Google Sign-in Successful",
              description: `Welcome, ${googleUserData.displayName || 'User'}!`,
              variant: "default",
            });
            
            // Here you would integrate with your backend to create/login the user
            // For now, we'll just redirect to home page
            navigate('/');
          }
        } catch (error) {
          console.error("Error processing Google callback:", error);
          toast({
            title: "Google Sign-in Failed",
            description: "Unable to process Google sign-in. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsGoogleSigningIn(false);
        }
      };
      
      processGoogleCallback();
    }
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
  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleSigningIn(true);
      // This function redirects to Google and doesn't return anything meaningful
      await signInWithGoogle();
      // The rest of the logic will be handled in the useEffect when Google redirects back
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
                        <span>{isGoogleSigningIn ? "Signing in..." : "Sign up with Google"}</span>
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <p className="text-xs text-blue-500 text-center mt-6">
            By signing up, you agree to our <Link href="#" className="text-blue-700 hover:underline">Terms of Service</Link> and <Link href="#" className="text-blue-700 hover:underline">Privacy Policy</Link>
          </p>
        </div>
        
        {/* Right Side - Hero Content */}
        <div className="md:w-1/2 bg-gradient-to-r from-blue-700 to-blue-900 p-6 md:p-10 text-white flex flex-col justify-center relative">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 relative">
            <h2 className="text-3xl font-bold mb-4">Share Toys, Create Smiles!</h2>
            <p className="mb-4 text-white/90">
              Join our community of parents reducing waste and helping each other by sharing outgrown toys.
            </p>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <i className="fas fa-check-circle mt-1 mr-2 text-blue-300"></i>
                <span>Free toy exchanges with families near you</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle mt-1 mr-2 text-blue-300"></i>
                <span>Safe, trusted community of parents</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle mt-1 mr-2 text-blue-300"></i>
                <span>Help reduce waste and environmental impact</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle mt-1 mr-2 text-blue-300"></i>
                <span>Save money on children's toys and games</span>
              </li>
            </ul>
            
            <div className="flex items-center space-x-4 bg-blue-800/50 p-4 rounded-lg">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-blue-200 flex items-center justify-center text-blue-700 text-xl font-bold">
                <span>G</span>
              </div>
              <div>
                <p className="font-semibold">"ToyShare has been amazing for our family!"</p>
                <p className="text-sm text-white/80">Guest User</p>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-6 right-6 flex space-x-2">
            <div className="h-2 w-2 rounded-full bg-white/30"></div>
            <div className="h-2 w-2 rounded-full bg-white"></div>
            <div className="h-2 w-2 rounded-full bg-white/30"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
