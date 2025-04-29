import { useState } from "react";
import { Link } from "wouter";
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

// Email validation schema 
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form definition
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    try {
      setIsSubmitting(true);
      
      const response = await apiRequest("POST", "/api/request-password-reset", data);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong. Please try again.");
      }
      
      setIsSuccess(true);
      
      toast({
        title: "Reset link sent",
        description: "If an account with that email exists, you'll receive a password reset link shortly.",
      });
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
          <h1 className="text-2xl font-bold text-blue-900 mb-1">Forgot Password</h1>
          <p className="text-blue-700">Enter your email to receive a reset link</p>
        </div>

        <Card className="border-blue-100">
          <CardContent className="pt-6">
            {isSuccess ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-check text-2xl"></i>
                </div>
                <h3 className="text-xl font-medium text-blue-900 mb-2">Check your email</h3>
                <p className="text-blue-700 mb-4">
                  If an account with that email exists, we've sent a link to reset your password.
                </p>
                <p className="text-sm text-blue-500">
                  Don't see it? Check your spam folder or <Link href="/forgot-password" className="text-blue-700 underline">try again</Link>.
                </p>
                <Button 
                  className="mt-4 w-full bg-blue-700 hover:bg-blue-800 btn-animated"
                  onClick={() => setIsSuccess(false)}
                >
                  Try another email
                </Button>
                <div className="mt-4">
                  <Link href="/auth" className="text-blue-600 hover:text-blue-800 underline">
                    Return to login
                  </Link>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-800">Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Enter your email address" 
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
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                  </Button>
                  
                  <div className="text-center mt-4">
                    <Link href="/auth" className="text-blue-600 hover:text-blue-800 underline">
                      Back to login
                    </Link>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}