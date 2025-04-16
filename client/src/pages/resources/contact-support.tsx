import React from "react";
import { Mail, MapPin, Phone, MessageSquare, Globe, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/layout/contact-form";

export default function ContactSupport() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col">
        <div className="text-center mb-10">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Mail className="h-8 w-8 text-blue-700" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">Contact Support</h1>
          <p className="text-lg text-blue-700 max-w-2xl mx-auto">
            Have questions, feedback, or need assistance? Our team is here to help.
            Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <ContactForm 
              title="Send us a message" 
              description="Fill out the form below and we'll respond within 24-48 hours on business days."
            />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" /> Our Office
                </h3>
                <address className="not-italic text-blue-700">
                  <p>ToyShare Headquarters</p>
                  <p>123 Sharing Street</p>
                  <p>San Francisco, CA 94107</p>
                </address>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-600" /> Get in Touch
                </h3>
                <div className="space-y-3 text-blue-700">
                  <p className="flex items-center">
                    <Phone className="h-4 w-4 mr-3 text-blue-600" />
                    <span>(555) 123-4567</span>
                  </p>
                  <p className="flex items-center">
                    <Mail className="h-4 w-4 mr-3 text-blue-600" />
                    <span>support@toyshare.com</span>
                  </p>
                  <p className="flex items-center">
                    <Globe className="h-4 w-4 mr-3 text-blue-600" />
                    <span>www.toyshare.com</span>
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" /> Support Hours
                </h3>
                <div className="space-y-3 text-blue-700">
                  <p className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM PT</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Saturday:</span>
                    <span>10:00 AM - 4:00 PM PT</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </p>
                  <p className="text-sm mt-4 text-blue-600">
                    Response times may vary during weekends and holidays.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">How long does it take to get a response?</h3>
              <p className="text-blue-700">
                We typically respond to all inquiries within 24-48 hours during business days.
                For urgent matters, please include "URGENT" in your subject line.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">I'm having trouble with a toy exchange</h3>
              <p className="text-blue-700">
                Please provide details about the exchange, including the toy ID and the username
                of the other party. We'll look into the issue and help resolve any conflicts.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">How do I report inappropriate content?</h3>
              <p className="text-blue-700">
                You can report inappropriate content directly on the platform using the "Report"
                button, or contact us here with the details of the content.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Can I get help with my account?</h3>
              <p className="text-blue-700">
                Yes! For account-related issues, please provide your username (not password)
                and a description of the problem you're experiencing.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">Other Ways to Get Help</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="border-blue-100 hover:border-blue-300 transition-all cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="bg-blue-100 rounded-full p-3 mb-4">
                  <Globe className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="font-semibold text-blue-800 mb-2">Help Center</h3>
                <p className="text-blue-700 text-sm text-center">
                  Browse our extensive knowledge base for answers to common questions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-blue-100 hover:border-blue-300 transition-all cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="bg-blue-100 rounded-full p-3 mb-4">
                  <MessageSquare className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="font-semibold text-blue-800 mb-2">Community Forum</h3>
                <p className="text-blue-700 text-sm text-center">
                  Connect with other members and share experiences and solutions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-blue-100 hover:border-blue-300 transition-all cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="bg-blue-100 rounded-full p-3 mb-4">
                  <Mail className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="font-semibold text-blue-800 mb-2">Email Support</h3>
                <p className="text-blue-700 text-sm text-center">
                  For private inquiries, email us directly at support@toyshare.com.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}