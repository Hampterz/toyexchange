import { useState, useEffect } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Password reset validation schema
const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password is too long"),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const [match, params] = useRoute("/reset-password/:token");
  const token = params?.token || "";
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  
  // Form definition
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        setIsVerifying(true);
        
        if (!token) {
          throw new Error("Invalid or missing reset token");
        }
        
        const response = await apiRequest("GET", `/api/verify-reset-token/${token}`);
        const data = await response.json();
        
        if (!data.valid) {
          throw new Error("This password reset link is invalid or has expired");
        }
        
        setIsValidToken(true);
      } catch (error: any) {
        toast({
          title: "Invalid Link",
          description: error.message || "This password reset link is invalid or has expired.",
          variant: "destructive",
        });
        
        // Redirect to forgot password page after a short delay
        setTimeout(() => {
          navigate("/forgot-password");
        }, 3000);
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyToken();
  }, [token, toast, navigate]);

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    try {
      setIsSubmitting(true);
      
      const response = await apiRequest("POST", "/api/reset-password", {
        token,
        newPassword: data.newPassword,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong. Please try again.");
      }
      
      setIsSuccess(true);
      
      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset successfully. You can now log in with your new password.",
      });
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 page-transition">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center mb-6">
            <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
              <i className="fas fa-gamepad text-white text-xl"></i>
            </div>
            <span className="text-2xl font-bold font-heading text-blue-700 ml-2">ToyShare</span>
          </Link>
          <h1 className="text-2xl font-bold text-blue-900 mb-1">Reset Password</h1>
          <p className="text-blue-700">Enter your new password</p>
        </div>

        <Card className="border-blue-100">
          <CardContent className="pt-6">
            {isVerifying ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-700 mb-4" />
                <p className="text-blue-700">Verifying your reset link...</p>
              </div>
            ) : isSuccess ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-check text-2xl"></i>
                </div>
                <h3 className="text-xl font-medium text-blue-900 mb-2">Password Reset Complete</h3>
                <p className="text-blue-700 mb-4">
                  Your password has been reset successfully.
                </p>
                <p className="text-sm text-blue-500">
                  You'll be redirected to the login page shortly.
                </p>
                <Button 
                  className="mt-4 w-full bg-blue-700 hover:bg-blue-800 btn-animated"
                  onClick={() => navigate("/auth")}
                >
                  Go to Login
                </Button>
              </div>
            ) : isValidToken ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-800">New Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter your new password" 
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
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-800">Confirm Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Confirm your new password" 
                            className="border-blue-200 focus-visible:ring-blue-700" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-700 hover:bg-blue-800 btn-animated"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating Password..." : "Reset Password"}
                  </Button>
                  
                  <div className="text-center mt-4">
                    <Link href="/auth" className="text-blue-600 hover:text-blue-800 underline">
                      Cancel and return to login
                    </Link>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-exclamation-triangle text-xl"></i>
                </div>
                <h3 className="text-xl font-medium text-blue-900 mb-2">Invalid Reset Link</h3>
                <p className="text-blue-700 mb-4">
                  This password reset link is invalid or has expired.
                </p>
                <p className="text-sm text-blue-500">
                  Please request a new password reset link.
                </p>
                <Button 
                  className="mt-4 w-full bg-blue-700 hover:bg-blue-800 btn-animated"
                  onClick={() => navigate("/forgot-password")}
                >
                  Request New Link
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}