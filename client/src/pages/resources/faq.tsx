import React from "react";
import { Link } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-blue-700 hover:underline flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Frequently Asked Questions</h1>
        <p className="text-blue-700 border-b border-blue-100 pb-4">Answers to common questions about ToyShare</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">General Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="what-is-toyshare">
            <AccordionTrigger className="text-blue-700 hover:text-blue-900">What is ToyShare?</AccordionTrigger>
            <AccordionContent className="text-gray-700">
              ToyShare is a community platform that enables parents to give away toys their children have outgrown to other families. Our mission is to reduce waste, save money, and build community connections through sustainable toy sharing.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="who-can-use">
            <AccordionTrigger className="text-blue-700 hover:text-blue-900">Who can use ToyShare?</AccordionTrigger>
            <AccordionContent className="text-gray-700">
              ToyShare is designed for parents, guardians, and caregivers of children who want to share toys within their community. Anyone can create an account, but all users must adhere to our community guidelines and terms of service.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="cost-to-use">
            <AccordionTrigger className="text-blue-700 hover:text-blue-900">How much does it cost to use ToyShare?</AccordionTrigger>
            <AccordionContent className="text-gray-700">
              ToyShare is completely free to use. There are no membership fees, listing fees, or transaction costs. All toy exchanges are gift-based, meaning no money changes hands for the toys themselves.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="geographical-coverage">
            <AccordionTrigger className="text-blue-700 hover:text-blue-900">Where is ToyShare available?</AccordionTrigger>
            <AccordionContent className="text-gray-700">
              ToyShare currently operates across the United States. The platform is designed to facilitate local exchanges, so you'll primarily see listings from people in your geographic area to make pickup and delivery convenient.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">Account Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="create-account">
            <AccordionTrigger className="text-blue-700 hover:text-blue-900">How do I create an account?</AccordionTrigger>
            <AccordionContent className="text-gray-700">
              To create an account, click on the "Sign Up" button on our homepage. You'll need to provide some basic information including your name, email, and location. You can sign up using your email and password.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="delete-account">
            <AccordionTrigger className="text-blue-700 hover:text-blue-900">How do I delete my account?</AccordionTrigger>
            <AccordionContent className="text-gray-700">
              To delete your account, go to your Account Settings and select "Delete Account" at the bottom of the page. Note that account deletion is permanent and will remove all your listings and message history.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="change-location">
            <AccordionTrigger className="text-blue-700 hover:text-blue-900">How do I update my location?</AccordionTrigger>
            <AccordionContent className="text-gray-700">
              You can update your location at any time by going to your profile settings. This will refresh the toy listings you see to match your new location.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">Toy Exchange Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="share-toy">
            <AccordionTrigger className="text-blue-700 hover:text-blue-900">How do I share a toy?</AccordionTrigger>
            <AccordionContent className="text-gray-700">
              To share a toy, click the "Add Toy" button on your dashboard or homepage. You'll need to add photos, a description, the toy's condition, recommended age range, and your general location. The more details you provide, the better!
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="request-toy">
            <AccordionTrigger className="text-blue-700 hover:text-blue-900">How do I request a toy?</AccordionTrigger>
            <AccordionContent className="text-gray-700">
              When you find a toy you're interested in, click the "Request" button on the toy listing. You'll be prompted to send a message to the toy owner explaining why you're interested. Once sent, the owner will receive a notification and can respond to your request.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="meetup-arrangements">
            <AccordionTrigger className="text-blue-700 hover:text-blue-900">How do toy exchanges work?</AccordionTrigger>
            <AccordionContent className="text-gray-700">
              After a request is accepted, you can use our in-app messaging to arrange the exchange details. We recommend meeting in a public place during daylight hours. Both parties should confirm the meetup location and time through the app. After the exchange, both users can leave feedback about the experience.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="toy-condition">
            <AccordionTrigger className="text-blue-700 hover:text-blue-900">What condition should toys be in?</AccordionTrigger>
            <AccordionContent className="text-gray-700">
              All toys should be clean, sanitized, and in working condition with no major damage. Be honest about any minor wear or missing pieces in your description. We don't allow recalled toys or items that pose a safety risk. If in doubt, don't list it.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="shipping-toys">
            <AccordionTrigger className="text-blue-700 hover:text-blue-900">Can I ship toys instead of meeting up?</AccordionTrigger>
            <AccordionContent className="text-gray-700">
              We primarily encourage local, in-person exchanges. However, if both parties agree, you can arrange to ship toys at your own expense and risk. ToyShare doesn't handle shipping logistics or provide shipping protection.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">Safety and Community</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="safety-guidelines">
            <AccordionTrigger className="text-blue-700 hover:text-blue-900">How does ToyShare ensure safety?</AccordionTrigger>
            <AccordionContent className="text-gray-700">
              Safety is our top priority. We have a user rating system, message monitoring, and community reporting tools. We recommend following our safety guidelines for all exchanges, including meeting in public places. See our Safety Tips page for comprehensive guidance.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="inappropriate-behavior">
            <AccordionTrigger className="text-blue-700 hover:text-blue-900">How do I report inappropriate behavior?</AccordionTrigger>
            <AccordionContent className="text-gray-700">
              If you encounter inappropriate behavior, click the "Report" button on the user's profile or in your conversation with them. Our moderation team reviews all reports and takes appropriate action according to our community guidelines.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="verify-toy-safety">
            <AccordionTrigger className="text-blue-700 hover:text-blue-900">How can I verify a toy is safe?</AccordionTrigger>
            <AccordionContent className="text-gray-700">
              Before accepting any toy, check for recalls at CPSC.gov/Recalls, inspect it thoroughly for damage or hazards, and ensure it's age-appropriate. Always clean and sanitize toys before giving them to your child.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">Additional Help</h2>
        <p className="text-gray-700 mb-4">
          Can't find the answer you're looking for? Our support team is here to help!
        </p>
        <Link href="/resources/contact-support" className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md inline-block">
          Contact Support
        </Link>
      </div>
    </div>
  );
}