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
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <i className="fas fa-gamepad text-white text-xl"></i>
              </div>
              <span className="text-2xl font-bold font-heading text-primary ml-2">ToyShare</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome to ToyShare</h1>
            <p className="text-gray-600">Connect with parents in your community</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Create Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardContent className="pt-6">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your username" {...field} />
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardContent className="pt-6">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
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
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Choose a username" {...field} />
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
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter your email" {...field} />
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Create a password" {...field} />
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
                            <FormLabel>Location (City/Neighborhood)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Capitol Hill, Seattle" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <p className="text-xs text-gray-500 text-center mt-6">
            By signing up, you agree to our <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </div>
        
        {/* Right Side - Hero Content */}
        <div className="md:w-1/2 bg-gradient-to-r from-green-400 to-primary p-6 md:p-10 text-white flex flex-col justify-center relative">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 relative">
            <h2 className="text-3xl font-bold mb-4">Share Toys, Spread Joy</h2>
            <p className="mb-4 text-white/90">
              Join our community of parents reducing waste and helping each other by sharing outgrown toys.
            </p>
            
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <i className="fas fa-check-circle mt-1 mr-2"></i>
                <span>Free toy exchanges with families near you</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle mt-1 mr-2"></i>
                <span>Safe, trusted community of parents</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle mt-1 mr-2"></i>
                <span>Help reduce waste and environmental impact</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-check-circle mt-1 mr-2"></i>
                <span>Save money on children's toys and games</span>
              </li>
            </ul>
            
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8cGVvcGxlfHx8fHx8MTY4NDg3NDg4Mg&ixlib=rb-4.0.3&q=80&w=100" 
                  alt="User" 
                  className="h-full w-full object-cover" 
                />
              </div>
              <div>
                <p className="font-semibold">"ToyShare has been amazing for our family!"</p>
                <p className="text-sm text-white/80">Sarah, mother of two</p>
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
