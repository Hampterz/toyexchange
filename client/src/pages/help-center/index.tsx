import React from "react";
import { HelpCircle, Send, Search, Mail, MessageSquare, BookOpen, LifeBuoy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HelpCenter() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col">
        <div className="text-center mb-10">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <HelpCircle className="h-8 w-8 text-blue-700" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">Help Center</h1>
          <p className="text-lg text-blue-700 max-w-2xl mx-auto">
            Find answers to common questions and learn how to make the most of ToyShare.
          </p>
        </div>
        
        {/* Search Section */}
        <div className="max-w-3xl mx-auto mb-12 w-full">
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Find the answer you need</h2>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />
                <Input
                  type="text"
                  placeholder="Search for help..."
                  className="pl-10 border-blue-200 focus:border-blue-500"
                />
              </div>
              <Button className="bg-blue-700 hover:bg-blue-800">
                Search
              </Button>
            </div>
          </div>
        </div>
        
        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-blue-100 transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-700 flex items-center text-lg">
                <BookOpen className="h-5 w-5 mr-2" /> Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-blue-700">
                <li className="hover:text-blue-500 cursor-pointer">How to create an account</li>
                <li className="hover:text-blue-500 cursor-pointer">Setting up your profile</li>
                <li className="hover:text-blue-500 cursor-pointer">Browsing available toys</li>
                <li className="hover:text-blue-500 cursor-pointer">Finding and requesting toys</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-blue-100 transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-700 flex items-center text-lg">
                <MessageSquare className="h-5 w-5 mr-2" /> Sharing & Exchanging
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-blue-700">
                <li className="hover:text-blue-500 cursor-pointer">How to list a toy</li>
                <li className="hover:text-blue-500 cursor-pointer">Requesting a toy</li>
                <li className="hover:text-blue-500 cursor-pointer">Meeting safely for exchanges</li>
                <li className="hover:text-blue-500 cursor-pointer">Rating and feedback</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-blue-100 transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-700 flex items-center text-lg">
                <LifeBuoy className="h-5 w-5 mr-2" /> Account & Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-blue-700">
                <li className="hover:text-blue-500 cursor-pointer">Account settings</li>
                <li className="hover:text-blue-500 cursor-pointer">Privacy options</li>
                <li className="hover:text-blue-500 cursor-pointer">Reporting issues</li>
                <li className="hover:text-blue-500 cursor-pointer">Contact support</li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Frequently Asked Questions</h2>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="sharing">Sharing Toys</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-blue-700">What is ToyShare?</AccordionTrigger>
                  <AccordionContent className="text-blue-600">
                    ToyShare is a community platform where families can share gently-used toys they no longer need
                    with other families. It promotes sustainability, reduces waste, and helps build community connections.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-blue-700">Is ToyShare free to use?</AccordionTrigger>
                  <AccordionContent className="text-blue-600">
                    Yes! ToyShare is completely free to use. There are no membership fees or charges for
                    listing or requesting toys. The platform is built around the principle of sharing and community.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-blue-700">What types of toys can be shared?</AccordionTrigger>
                  <AccordionContent className="text-blue-600">
                    Almost any gently-used, clean, and safe toys can be shared. This includes board games, puzzles,
                    stuffed animals, educational toys, outdoor play equipment, and more. We ask that all toys
                    be in good condition, with all parts included, and suitable for the age ranges specified.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-blue-700">What are sustainability badges?</AccordionTrigger>
                  <AccordionContent className="text-blue-600">
                    Sustainability badges are earned by active members who regularly share toys and complete
                    successful exchanges. They represent your contribution to reducing waste and building
                    a more sustainable community. The more you share, the higher your badge level becomes!
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            
            <TabsContent value="sharing" className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-blue-700">How do I list a toy for sharing?</AccordionTrigger>
                  <AccordionContent className="text-blue-600">
                    To list a toy, click the "Add Toy" button from the home page or your profile. Fill out the toy
                    details including title, description, condition, age range, and category. Add clear photos
                    of the toy and relevant tags to help others find it. Once submitted, your toy will be visible to the community.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-blue-700">How do I arrange a toy exchange?</AccordionTrigger>
                  <AccordionContent className="text-blue-600">
                    When you find a toy you're interested in, click the "Request" button on the listing. Write a message
                    to the owner explaining why you're interested. If they accept, you'll use our in-app messaging
                    to arrange a meeting time and public location for the exchange.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-blue-700">What if a toy is in high demand?</AccordionTrigger>
                  <AccordionContent className="text-blue-600">
                    When multiple families request the same toy, the owner can choose which request to accept.
                    We encourage choosing based on need, pickup convenience, and the requester's community involvement.
                    All other requesters will be notified if their request wasn't selected.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-blue-700">Do I need to clean toys before sharing?</AccordionTrigger>
                  <AccordionContent className="text-blue-600">
                    Yes, please thoroughly clean and sanitize all toys before sharing. Remove batteries if applicable,
                    ensure all parts are included, and check for any damage or safety concerns. Be honest about
                    the toy's condition in your listing description.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            
            <TabsContent value="account" className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-blue-700">How do I update my profile information?</AccordionTrigger>
                  <AccordionContent className="text-blue-600">
                    Navigate to your profile page by clicking on your avatar in the top right corner and selecting "Profile".
                    Click the "Edit Profile" button to update your personal information, change your profile picture,
                    or modify your location.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-blue-700">Can I delete my account?</AccordionTrigger>
                  <AccordionContent className="text-blue-600">
                    Yes, you can delete your account by going to your profile settings and selecting "Delete Account"
                    at the bottom of the page. This will permanently remove your account and all associated listings.
                    Please note that completed exchanges and messages cannot be deleted from other users' histories.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-blue-700">How do I change my password?</AccordionTrigger>
                  <AccordionContent className="text-blue-600">
                    To change your password, go to your profile settings and select "Security". You'll need to
                    enter your current password and then set a new password. For security reasons, make sure
                    to choose a strong, unique password.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-blue-700">What if I forget my password?</AccordionTrigger>
                  <AccordionContent className="text-blue-600">
                    If you forget your password, click "Forgot Password" on the login page. Enter the email
                    address associated with your account, and we'll send you a password reset link.
                    Follow the instructions in the email to set a new password.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Contact Support Section */}
        <div className="bg-blue-50 rounded-xl p-6 lg:p-8 max-w-3xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="md:w-2/3">
              <h2 className="text-xl font-bold text-blue-800 mb-2">Still Need Help?</h2>
              <p className="text-blue-700 mb-4">
                Can't find what you're looking for? Our support team is ready to help.
                We typically respond within 24 hours on business days.
              </p>
              <div className="flex gap-4">
                <Button className="bg-blue-700 hover:bg-blue-800">
                  <Mail className="mr-2 h-4 w-4" /> Email Support
                </Button>
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100">
                  <MessageSquare className="mr-2 h-4 w-4" /> Live Chat
                </Button>
              </div>
            </div>
            <div className="hidden md:block md:w-1/3">
              <div className="w-32 h-32 bg-blue-200 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-16 w-16 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Community Resources */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">Community Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="border-blue-100 transition-all hover:shadow-md cursor-pointer">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="font-semibold text-blue-800 mb-2">User Guide</h3>
                <p className="text-blue-600 text-sm">
                  Complete documentation on using all ToyShare features.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-blue-100 transition-all hover:shadow-md cursor-pointer">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="font-semibold text-blue-800 mb-2">Community Forum</h3>
                <p className="text-blue-600 text-sm">
                  Connect with other families and share toy sharing tips.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-blue-100 transition-all hover:shadow-md cursor-pointer">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="font-semibold text-blue-800 mb-2">Newsletter</h3>
                <p className="text-blue-600 text-sm">
                  Sign up for monthly updates and toy sharing inspiration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}