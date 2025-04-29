import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AddressAutocomplete } from "@/components/address-autocomplete";

// Profile customization schema
const profileCustomizationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  name: z.string().min(2, "Full name must be at least 2 characters").max(100),
  location: z.string().min(5, "Please provide a complete address"),
  bio: z.string().optional(),
});

type ProfileCustomizationData = z.infer<typeof profileCustomizationSchema>;

export default function ProfileCustomizationPage() {
  const { user, isLoading } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Redirect to home if user is not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);
  
  // Set up form with default values from user data
  const form = useForm<ProfileCustomizationData>({
    resolver: zodResolver(profileCustomizationSchema),
    defaultValues: {
      username: user?.username || "",
      name: user?.name || "",
      location: user?.location || "",
      bio: user?.bio || "",
    },
  });
  
  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username || "",
        name: user.name || "",
        location: user.location || "",
        bio: user.bio || "",
      });
    }
  }, [user, form]);
  
  const onSubmit = async (data: ProfileCustomizationData) => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      
      const response = await apiRequest("PATCH", `/api/users/${user.id}`, data);
      
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      
      const updatedUser = await response.json();
      
      // Update user data in cache
      queryClient.setQueryData(["/api/user"], updatedUser);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
        variant: "default",
      });
      
      // Redirect to profile page
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An error occurred while updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-700 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <Card className="border-blue-100 shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription className="text-blue-100">
            Welcome to ToyShare! Please provide some additional information to complete your profile.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800">Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Choose a unique username" 
                        className="border-blue-200 focus-visible:ring-blue-700" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-blue-500 mt-1">
                      This username will be visible to other users in the community.
                    </p>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your full name" 
                        className="border-blue-200 focus-visible:ring-blue-700" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800">Your Location</FormLabel>
                    <FormControl>
                      <AddressAutocomplete 
                        placeholder="Enter your full address" 
                        className="border-blue-200 focus-visible:ring-blue-700" 
                        defaultValue={field.value}
                        onAddressSelect={(address) => {
                          field.onChange(address);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-blue-500 mt-1">
                      Your address helps us connect you with families nearby. It will only be shared when you agree to a toy exchange.
                    </p>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-800">About You (Optional)</FormLabel>
                    <FormControl>
                      <textarea 
                        className="flex min-h-20 w-full rounded-md border border-blue-200 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                        placeholder="Tell us a bit about yourself and your family..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="border-blue-200"
                >
                  Skip For Now
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-700 hover:bg-blue-800"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}