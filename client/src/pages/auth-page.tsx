import { useEffect } from "react";
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

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [_, navigate] = useLocation();
  
  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

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

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
              <TabsTrigger value="login" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">Create Account</TabsTrigger>
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
                        className="w-full bg-blue-700 hover:bg-blue-800"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Signing in..." : "Sign In"}
                      </Button>

                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-blue-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="bg-white px-4 text-blue-500">Or continue with</span>
                        </div>
                      </div>

                      <Button 
                        type="button" 
                        className="w-full bg-white border border-blue-200 text-blue-800 hover:bg-blue-50 flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
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
                            <FormLabel className="text-blue-800">Location (City/Neighborhood)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Capitol Hill, Seattle" className="border-blue-200 focus-visible:ring-blue-700" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-blue-700 hover:bg-blue-800"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Creating account..." : "Create Account"}
                      </Button>

                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-blue-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="bg-white px-4 text-blue-500">Or continue with</span>
                        </div>
                      </div>

                      <Button 
                        type="button" 
                        className="w-full bg-white border border-blue-200 text-blue-800 hover:bg-blue-50 flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Sign up with Google
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
