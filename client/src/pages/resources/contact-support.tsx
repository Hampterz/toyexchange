import React, { useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ContactSupport() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent",
        description: "We've received your message and will respond within 24-48 hours.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        category: "general"
      });
    }, 1500);
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
        <p className="text-blue-700 border-b border-blue-100 pb-4">Get help from our support team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <div className="bg-white border border-blue-100 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-6">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border-blue-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border-blue-200"
                  />
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-md border border-blue-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                >
                  <option value="general">General Inquiry</option>
                  <option value="account">Account Issues</option>
                  <option value="technical">Technical Problems</option>
                  <option value="safety">Safety Concerns</option>
                  <option value="feature">Feature Request</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
              
              <div className="space-y-2 mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full border-blue-200"
                />
              </div>
              
              <div className="space-y-2 mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Your Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full border-blue-200"
                />
              </div>
              
              <Button 
                type="submit" 
                className="bg-blue-700 hover:bg-blue-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
        
        <div>
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Contact Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-blue-900">Email</h3>
                  <p className="text-gray-700">support@toyshare.example.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-blue-900">Support Hours</h3>
                  <p className="text-gray-700">Monday - Friday<br />9:00 AM - 6:00 PM EST</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-blue-900">Response Time</h3>
                  <p className="text-gray-700">We aim to respond to all inquiries within 24-48 hours during business days.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-blue-100 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Quick Links</h2>
            
            <ul className="space-y-3">
              <li>
                <Link href="/resources/faq" className="text-blue-700 hover:underline flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/help-center" className="text-blue-700 hover:underline flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/safety-center" className="text-blue-700 hover:underline flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Safety Center
                </Link>
              </li>
              <li>
                <Link href="/resources/community-guidelines" className="text-blue-700 hover:underline flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">Common Support Topics</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-100 flex flex-col">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Account Issues</h3>
            <p className="text-gray-700 text-sm mb-3 flex-grow">Help with account settings, password resets, and profile management.</p>
            <Link href="/help-center" className="text-blue-700 hover:underline text-sm">Learn more</Link>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100 flex flex-col">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Toy Listings</h3>
            <p className="text-gray-700 text-sm mb-3 flex-grow">Assistance with creating, editing, or removing toy listings.</p>
            <Link href="/help-center" className="text-blue-700 hover:underline text-sm">Learn more</Link>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100 flex flex-col">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Messaging</h3>
            <p className="text-gray-700 text-sm mb-3 flex-grow">Help with the messaging system, notifications, and communication problems.</p>
            <Link href="/help-center" className="text-blue-700 hover:underline text-sm">Learn more</Link>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100 flex flex-col">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Safety Concerns</h3>
            <p className="text-gray-700 text-sm mb-3 flex-grow">Reporting safety issues, suspicious activity, or inappropriate content.</p>
            <Link href="/safety-center" className="text-blue-700 hover:underline text-sm">Learn more</Link>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100 flex flex-col">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Technical Issues</h3>
            <p className="text-gray-700 text-sm mb-3 flex-grow">Help with app functionality, bugs, and technical problems.</p>
            <Link href="/resources/faq" className="text-blue-700 hover:underline text-sm">Learn more</Link>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-blue-100 flex flex-col">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Feature Requests</h3>
            <p className="text-gray-700 text-sm mb-3 flex-grow">Submit ideas for new features or improvements to ToyShare.</p>
            <Link href="/help-center" className="text-blue-700 hover:underline text-sm">Learn more</Link>
          </div>
        </div>
      </div>
    </div>
  );
}