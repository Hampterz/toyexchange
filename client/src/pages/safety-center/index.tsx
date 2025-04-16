import React, { useState } from "react";
import { Shield, MapPin, AlertTriangle, Users, CheckCircle, Share, MessageCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SafetyCenter() {
  const [activeTab, setActiveTab] = useState("guidelines");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col">
        <div className="text-center mb-10">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Shield className="h-8 w-8 text-blue-700" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">ToyShare Safety Center</h1>
          <p className="text-lg text-blue-700 max-w-2xl mx-auto">
            We're committed to creating a safe environment for families to share toys. 
            Learn about our safety guidelines and best practices.
          </p>
        </div>
        
        <Tabs defaultValue="guidelines" className="max-w-4xl mx-auto mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="guidelines" onClick={() => setActiveTab("guidelines")}>Safety Guidelines</TabsTrigger>
            <TabsTrigger value="meetups" onClick={() => setActiveTab("meetups")}>Safe Meetups</TabsTrigger>
            <TabsTrigger value="report" onClick={() => setActiveTab("report")}>Report Issues</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guidelines" className="mt-6">
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <AlertTriangle className="h-5 w-5 text-blue-700" />
              <AlertTitle className="text-blue-800 font-medium">Safety First</AlertTitle>
              <AlertDescription className="text-blue-800">
                Always prioritize your family's safety when participating in toy exchanges.
              </AlertDescription>
            </Alert>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-blue-700 font-medium">Verify User Profiles</AccordionTrigger>
                <AccordionContent className="text-blue-700">
                  <p>Always check user profiles before arranging a meetup. Look for:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Completed profile with real name and location</li>
                    <li>Profile picture (preferably family appropriate)</li>
                    <li>Sustainability badges and exchange history</li>
                    <li>Reviews from other users</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-blue-700 font-medium">Communication Safety</AccordionTrigger>
                <AccordionContent className="text-blue-700">
                  <p>Keep all communication within the ToyShare platform:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Use our messaging system for all exchanges</li>
                    <li>Don't share personal contact information until you're comfortable</li>
                    <li>Report suspicious communication immediately</li>
                    <li>Never share financial information with other users</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-blue-700 font-medium">Toy Safety Guidelines</AccordionTrigger>
                <AccordionContent className="text-blue-700">
                  <p>Before sharing or accepting toys:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Check for safety recalls on <a href="https://www.cpsc.gov/Recalls" target="_blank" rel="noopener noreferrer" className="underline">CPSC.gov</a></li>
                    <li>Inspect toys for damage, sharp edges, or small parts</li>
                    <li>Clean and sanitize toys before and after exchanges</li>
                    <li>Be honest about the condition and age-appropriateness</li>
                    <li>Never share toys with significant damage or missing safety features</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-blue-700 font-medium">Trust Indicators</AccordionTrigger>
                <AccordionContent className="text-blue-700">
                  <p>Build trust in the community by:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Starting with smaller exchanges before large items</li>
                    <li>Providing detailed descriptions and clear photos</li>
                    <li>Responding promptly to messages</li>
                    <li>Following through on exchange agreements</li>
                    <li>Leaving honest feedback after exchanges</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
          
          <TabsContent value="meetups" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-700 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" /> Recommended Meetup Locations
                  </CardTitle>
                  <CardDescription>
                    Always choose public, well-populated areas for exchanges
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-blue-700">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Library or community center lobbies</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Coffee shops and family-friendly restaurants</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Shopping mall common areas</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Police station lobbies (safest option)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Grocery store or pharmacy parking lots (during daylight)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-700 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" /> Safety Precautions
                  </CardTitle>
                  <CardDescription>
                    Tips to keep your family safe during exchanges
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-blue-700">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Bring a friend or family member with you</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Meet during daylight hours</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Tell someone where you're going and when</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Use your phone's location sharing with a trusted person</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Trust your instincts - leave if something feels wrong</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <Alert className="mt-6 bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <AlertTitle className="text-yellow-800 font-medium">Never meet at your home</AlertTitle>
              <AlertDescription className="text-yellow-700">
                For your family's safety, always meet in public places. Never invite strangers to your home
                or agree to meet at their residence for toy exchanges.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="report" className="mt-6">
            <Card className="border-blue-200 mb-6">
              <CardHeader>
                <CardTitle className="text-blue-700">Reporting Issues</CardTitle>
                <CardDescription>
                  ToyShare takes safety concerns seriously. If you encounter any issues with users or exchanges,
                  please report them immediately.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mr-4 bg-blue-100 p-2 rounded-full">
                      <AlertTriangle className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-700">When to Report</h3>
                      <ul className="list-disc pl-5 mt-1 text-blue-600 space-y-1">
                        <li>Suspicious user behavior or communication</li>
                        <li>Unsafe or recalled toys being shared</li>
                        <li>Misrepresented toy condition or details</li>
                        <li>Inappropriate messages or content</li>
                        <li>No-shows at arranged meetups</li>
                        <li>Any other safety concerns</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 bg-blue-100 p-2 rounded-full">
                      <Info className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-700">How to Report</h3>
                      <p className="text-blue-600 mt-1">
                        You can report issues through:
                      </p>
                      <ul className="list-disc pl-5 mt-1 text-blue-600 space-y-1">
                        <li>The Report button on user profiles</li>
                        <li>The Report option on toy listings</li>
                        <li>The Report option in message threads</li>
                        <li>Contacting our support team directly</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button className="w-full bg-blue-700 hover:bg-blue-800">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Alert className="bg-blue-50 border-blue-200">
              <Shield className="h-5 w-5 text-blue-700" />
              <AlertTitle className="text-blue-800 font-medium">Community Moderation</AlertTitle>
              <AlertDescription className="text-blue-700">
                Our team reviews all reports within 24 hours. Serious safety violations may result in immediate
                account suspension. We work with local authorities when necessary to ensure community safety.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Our Safety Commitment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Verified Users</h3>
              <p className="text-blue-700">
                We verify user information and encourage community ratings to build trust.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">In-App Messaging</h3>
              <p className="text-blue-700">
                Our secure messaging system keeps communication safe until you're ready to meet.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Moderated Content</h3>
              <p className="text-blue-700">
                We actively monitor listings and messages to ensure a safe, family-friendly environment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}