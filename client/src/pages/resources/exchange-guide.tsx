import React from 'react';
import { 
  Book, Share, Calendar, MessageSquare, Map, Check, 
  Award, ShieldCheck, Camera, Star, UserCheck, Clock,
  Sparkles, GanttChart
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ExchangeGuide() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col">
        <div className="text-center mb-10">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Book className="h-8 w-8 text-blue-700" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">Toy Exchange Guide</h1>
          <p className="text-lg text-blue-700 max-w-2xl mx-auto">
            Learn how to successfully share and exchange toys on our platform with
            this comprehensive guide for new and experienced members.
          </p>
        </div>
        
        <Tabs defaultValue="step-by-step" className="max-w-3xl mx-auto mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="step-by-step">Step-by-step</TabsTrigger>
            <TabsTrigger value="tips">Tips & Best Practices</TabsTrigger>
            <TabsTrigger value="etiquette">Community Etiquette</TabsTrigger>
          </TabsList>
          
          {/* Step by Step Guide */}
          <TabsContent value="step-by-step" className="pt-6">
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex items-center justify-center shrink-0">
                    <div className="bg-blue-100 rounded-full p-3">
                      <Share className="h-6 w-6 text-blue-700" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-800 mb-2">1. List Your Toy</h3>
                    <p className="text-blue-700 mb-4">
                      Start by creating a detailed listing for the toy you want to share.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Take clear, well-lit photos of the toy from multiple angles</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Write a detailed description including condition, age range, and any missing pieces</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Add appropriate tags like #educational, #outdoor, or #plush to help others find your toy</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Set your preferred exchange location (general neighborhood is sufficient)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex items-center justify-center shrink-0">
                    <div className="bg-blue-100 rounded-full p-3">
                      <MessageSquare className="h-6 w-6 text-blue-700" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-800 mb-2">2. Respond to Requests</h3>
                    <p className="text-blue-700 mb-4">
                      When someone is interested in your toy, they'll send a request. Review and respond promptly.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Check the requester's profile to view their sustainability badge and history</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Accept or decline the request based on your comfort level</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Use the messaging system to discuss details further</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Be honest about any issues or concerns</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex items-center justify-center shrink-0">
                    <div className="bg-blue-100 rounded-full p-3">
                      <Calendar className="h-6 w-6 text-blue-700" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-800 mb-2">3. Schedule the Exchange</h3>
                    <p className="text-blue-700 mb-4">
                      Once you've accepted a request, arrange a time and place to meet.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Suggest a public, well-lit location (See our Safety Center for recommendations)</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Choose a time that works for both parties, preferably during daylight hours</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Confirm the meetup details at least 24 hours in advance</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Have a backup plan in case of no-shows or cancellations</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex items-center justify-center shrink-0">
                    <div className="bg-blue-100 rounded-full p-3">
                      <Map className="h-6 w-6 text-blue-700" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-800 mb-2">4. Meet and Exchange</h3>
                    <p className="text-blue-700 mb-4">
                      On the day of the exchange, meet at the agreed-upon location and time.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Arrive on time (or notify the other party if you're running late)</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Bring the exact toy that was advertised in your listing</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Allow the recipient to inspect the toy before completing the exchange</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Keep the interaction friendly and brief</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex items-center justify-center shrink-0">
                    <div className="bg-blue-100 rounded-full p-3">
                      <Star className="h-6 w-6 text-blue-700" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-800 mb-2">5. Leave Feedback</h3>
                    <p className="text-blue-700 mb-4">
                      After the exchange, take a moment to rate your experience and leave feedback.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Rate the exchange experience from 1-5 stars</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Leave honest, constructive feedback about the toy and the exchange</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Mark the exchange as completed in your dashboard</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Your sustainability score will automatically update, potentially earning you a new badge</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Tips Tab */}
          <TabsContent value="tips" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-700 flex items-center">
                    <Camera className="h-5 w-5 mr-2" /> Creating Great Listings
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-blue-600 space-y-4">
                  <p>
                    The quality of your toy listing directly affects how quickly it gets requested.
                    Follow these tips for creating standout listings:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Use natural lighting when photographing toys</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Include photos of any wear, damage, or missing pieces</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Show the toy being played with (if appropriate)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Mention the brand, original price, and any special features</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Be specific about the age range the toy is suitable for</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-700 flex items-center">
                    <UserCheck className="h-5 w-5 mr-2" /> Building Trust
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-blue-600 space-y-4">
                  <p>
                    Building trust in the community helps you get more successful exchanges
                    and higher-quality toys. Here's how to establish yourself as a trusted member:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Complete your profile with a real photo and bio</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Respond to messages promptly (within 24-48 hours)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Honor your commitments - show up when you say you will</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Share multiple toys to build your sustainability badge</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Leave thoughtful feedback for others</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-700 flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-2" /> Safety First
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-blue-600 space-y-4">
                  <p>
                    Safety should always be your top priority during toy exchanges.
                    Follow these essential safety guidelines:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Always meet in public places (coffee shops, libraries, etc.)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Bring a friend or family member with you if possible</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Trust your instincts - if something feels off, cancel</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Keep communication within the platform until you're comfortable</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Report any suspicious behavior to our support team</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-700 flex items-center">
                    <Clock className="h-5 w-5 mr-2" /> Managing Your Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-blue-600 space-y-4">
                  <p>
                    Toy exchanges can be time-consuming. Here are some tips to 
                    make the process more efficient:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Batch your meetups - try to schedule multiple exchanges in the same area</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Turn on notifications so you don't miss messages</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Set a specific window of time for meetups (e.g., "I'm available Saturdays 2-4pm")</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Cancel or reschedule well in advance if needed</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>Choose meetup locations that are convenient for you</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <Alert className="mt-6 bg-blue-50 border-blue-200">
              <Sparkles className="h-5 w-5 text-blue-700" />
              <AlertTitle className="text-blue-800 font-medium">Pro Tip</AlertTitle>
              <AlertDescription className="text-blue-700">
                Consider grouping similar toys together in a "bundle" to make exchanges more
                worthwhile. This is especially helpful for smaller items like board books,
                small stuffed animals, or action figures.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          {/* Etiquette Tab */}
          <TabsContent value="etiquette" className="pt-6">
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2" /> Community Guidelines
                </h3>
                <p className="text-blue-700 mb-4">
                  Our ToyShare community is built on mutual respect, generosity, and sustainability.
                  Following these guidelines ensures a positive experience for everyone:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Do</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Be honest about the condition of your toys</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Respond to messages within 48 hours</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Clean toys thoroughly before sharing</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Be on time for meetups</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-blue-600">Leave constructive, honest feedback</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Don't</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-red-600">Share toys with missing essential parts</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-red-600">No-show for arranged meetups</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-red-600">Share personal contact information too early</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-red-600">Ask for payment or trades for toys</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-red-600">Share toys that are recalled or unsafe</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" /> Communication Etiquette
                </h3>
                <p className="text-blue-700 mb-4">
                  Effective, respectful communication is key to successful toy exchanges.
                  Here are some guidelines for messaging other members:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-blue-700 font-medium">Be clear and concise</span>
                      <p className="text-blue-600 text-sm">Keep messages focused on the toy and exchange details.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-blue-700 font-medium">Respond promptly</span>
                      <p className="text-blue-600 text-sm">Even if you need to decline, a quick response is appreciated.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-blue-700 font-medium">Communicate changes</span>
                      <p className="text-blue-600 text-sm">If you need to cancel or reschedule, let the other member know ASAP.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-blue-700 font-medium">Be respectful</span>
                      <p className="text-blue-600 text-sm">Remember that everyone is volunteering their time and toys.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-blue-700 font-medium">Ask questions</span>
                      <p className="text-blue-600 text-sm">If you need more information about a toy, don't hesitate to ask.</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                  <GanttChart className="h-5 w-5 mr-2" /> Handling Common Situations
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-blue-700 mb-1">No-Shows</h4>
                    <p className="text-blue-600 mb-2">
                      If someone doesn't show up for a scheduled exchange:
                    </p>
                    <ul className="list-disc pl-5 text-blue-600 text-sm space-y-1">
                      <li>Wait at least 15 minutes past the arranged time</li>
                      <li>Try messaging them through the app</li>
                      <li>If they don't respond, you can report the no-show in your exchange history</li>
                      <li>Give them the benefit of the doubt - emergencies happen</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-blue-700 mb-1">Toy Condition Discrepancies</h4>
                    <p className="text-blue-600 mb-2">
                      If a toy's condition doesn't match the description:
                    </p>
                    <ul className="list-disc pl-5 text-blue-600 text-sm space-y-1">
                      <li>Politely discuss the discrepancy in person</li>
                      <li>You can decide not to accept the toy if it's significantly different</li>
                      <li>Leave honest feedback about the condition</li>
                      <li>Report serious misrepresentations to our support team</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-blue-700 mb-1">Multiple Requests</h4>
                    <p className="text-blue-600 mb-2">
                      If multiple people request the same toy:
                    </p>
                    <ul className="list-disc pl-5 text-blue-600 text-sm space-y-1">
                      <li>Consider the requester's sustainability badge and feedback history</li>
                      <li>First-come-first-served is a fair approach</li>
                      <li>Consider proximity for easier meetups</li>
                      <li>Let declined requesters know politely that the toy has been claimed</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-blue-700 mb-1">Cancellations</h4>
                    <p className="text-blue-600 mb-2">
                      If you need to cancel a scheduled exchange:
                    </p>
                    <ul className="list-disc pl-5 text-blue-600 text-sm space-y-1">
                      <li>Give as much notice as possible</li>
                      <li>Explain briefly (you don't need to share personal details)</li>
                      <li>Offer to reschedule if you're still interested in the exchange</li>
                      <li>Remember that repeated cancellations may affect your reputation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Ready to Start Sharing?</h2>
          <p className="text-blue-700 mb-6">
            Now that you know the ins and outs of toy exchanges, it's time to start sharing and
            making a positive impact on the environment and your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-700 hover:bg-blue-800">
              <Share className="mr-2 h-4 w-4" />
              List Your First Toy
            </Button>
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Book className="mr-2 h-4 w-4" />
              Browse Available Toys
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}