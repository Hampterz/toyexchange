import React from "react";
import { Link } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(1, { message: "Please select a subject." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(1000, { message: "Message cannot exceed 1000 characters." }),
});

export default function ContactSupport() {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    // In a real implementation, this would send the data to an API endpoint
    toast({
      title: "Support request submitted",
      description: "We've received your message and will respond within 24-48 hours.",
    });
    form.reset();
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-blue-700 hover:underline flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Contact Support</h1>
        <p className="text-blue-700 border-b border-blue-100 pb-4">We're here to help with any questions or issues</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Support Hours</h2>
            <p className="text-gray-700 mb-4">
              Our support team is available:
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Monday-Friday:</strong> 9am - 8pm EST
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Saturday-Sunday:</strong> 10am - 6pm EST
            </p>
            
            <h2 className="text-xl font-semibold text-blue-800 mb-4 mt-6">Alternative Contact</h2>
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> support@toyshare.example.com
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong> (555) 123-4567
            </p>
            
            <div className="mt-8 p-4 bg-white rounded-lg border border-blue-100">
              <h3 className="text-blue-800 font-medium mb-2">Emergency?</h3>
              <p className="text-sm text-gray-700">
                For urgent safety concerns or emergencies, please contact your local authorities.
              </p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border border-blue-100 p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Send Us a Message</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-800">Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" className="border-blue-200 focus-visible:ring-blue-700" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-800">Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" className="border-blue-200 focus-visible:ring-blue-700" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-800">Subject</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-blue-200 focus:ring-blue-700">
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="account">Account Issues</SelectItem>
                          <SelectItem value="technical">Technical Problems</SelectItem>
                          <SelectItem value="safety">Safety Concerns</SelectItem>
                          <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                          <SelectItem value="report">Report a User</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-800">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please describe your issue or question in detail..." 
                          className="min-h-[120px] border-blue-200 focus-visible:ring-blue-700"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-blue-600 mt-1">
                        {form.watch("message")?.length || 0}/1000 characters
                      </p>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-700 hover:bg-blue-800"
                >
                  Submit Support Request
                </Button>
              </form>
            </Form>
            
            <p className="text-xs text-gray-600 mt-6">
              By submitting this form, you acknowledge that the information provided will be handled in accordance with our <Link href="/legal/privacy-policy" className="text-blue-700 hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}