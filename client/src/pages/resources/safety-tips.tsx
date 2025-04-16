import React from "react";
import { Link } from "wouter";

export default function SafetyTips() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-blue-700 hover:underline flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Safety Tips for Toy Exchanges</h1>
        <p className="text-blue-700 border-b border-blue-100 pb-4">Guidelines for safe and secure toy sharing</p>
      </div>

      <div className="prose prose-blue max-w-none">
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-blue-900 mt-0">Your Safety is Our Priority</h2>
          <p className="mb-0">
            At ToyShare, we're committed to creating a safe environment for families to exchange toys. 
            While we take measures to promote safety on our platform, it's important to follow these 
            guidelines when arranging and conducting toy exchanges.
          </p>
        </div>

        <h2>Before the Exchange</h2>
        
        <h3 className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Verify Profiles and Reviews
        </h3>
        <ul>
          <li>Check the other user's profile to see how long they've been a member</li>
          <li>Read reviews and ratings from other users</li>
          <li>Look for verified badges or completed exchanges</li>
          <li>Be cautious of new accounts with no history</li>
        </ul>

        <h3 className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Communicate Clearly
        </h3>
        <ul>
          <li>Use our in-app messaging system for all communications</li>
          <li>Avoid sharing personal contact information until you feel comfortable</li>
          <li>Ask questions about the toy's condition, cleanliness, and safety</li>
          <li>Clearly agree on the exchange location, time, and day</li>
          <li>Confirm the exchange details shortly before meeting</li>
        </ul>

        <h3 className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Plan Your Exchange
        </h3>
        <ul>
          <li>Choose a public, well-lit meeting place in a busy area</li>
          <li>Meet during daylight hours when possible</li>
          <li>Consider public locations like libraries, coffee shops, or community centers</li>
          <li>Some police stations offer "safe exchange zones" specifically for online exchanges</li>
          <li>Avoid meeting at your home or the other person's home for initial exchanges</li>
        </ul>

        <div className="bg-blue-50 border-l-4 border-blue-700 p-4 my-6">
          <h4 className="text-blue-900 mt-0 mb-2">Safe Exchange Locations</h4>
          <p className="mb-0">
            Ideal exchange locations include:
            <ul className="mb-0">
              <li>Coffee shops</li>
              <li>Public libraries</li>
              <li>Shopping mall food courts</li>
              <li>Community centers</li>
              <li>Police station lobbies</li>
              <li>Grocery store parking lots (in view of entrance)</li>
              <li>Public parks with plenty of people</li>
            </ul>
          </p>
        </div>

        <h2>During the Exchange</h2>

        <h3 className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Bring a Friend
        </h3>
        <ul>
          <li>Consider bringing a friend or family member to the exchange</li>
          <li>If going alone, let someone you trust know where you're going, who you're meeting, and when you expect to return</li>
          <li>Consider sharing your location with a friend or family member during the exchange</li>
        </ul>

        <h3 className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Stay Alert
        </h3>
        <ul>
          <li>Trust your instincts — if something feels wrong, leave immediately</li>
          <li>Keep your phone charged and readily accessible</li>
          <li>Be aware of your surroundings at all times</li>
          <li>If the other person doesn't match their profile or behavior seems suspicious, don't proceed with the exchange</li>
        </ul>

        <h3 className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Inspect the Toy
        </h3>
        <ul>
          <li>Thoroughly examine the toy before accepting it</li>
          <li>Check for any damage, missing pieces, or safety hazards</li>
          <li>Verify that the toy matches the description and photos from the listing</li>
          <li>If the toy doesn't meet your expectations, it's okay to politely decline</li>
        </ul>

        <h2>After the Exchange</h2>

        <h3 className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Clean and Sanitize
        </h3>
        <ul>
          <li>Clean and sanitize the toy before giving it to your child</li>
          <li>Follow the toy manufacturer's cleaning instructions</li>
          <li>For plastic toys, wash with warm soapy water and disinfect if possible</li>
          <li>For fabric toys, check if they can be machine washed</li>
          <li>Allow toys to dry completely before use</li>
        </ul>

        <h3 className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          Leave a Review
        </h3>
        <ul>
          <li>Share your experience by leaving a review for the other user</li>
          <li>Be honest, fair, and constructive in your feedback</li>
          <li>Rate the accuracy of the listing, cleanliness, safety, and overall experience</li>
          <li>Your reviews help build trust in the community and guide other users</li>
        </ul>

        <h3 className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Report Issues
        </h3>
        <ul>
          <li>If you experience any safety concerns or policy violations, report them promptly</li>
          <li>Use the "Report" feature on the user's profile or listing</li>
          <li>For serious safety concerns, contact our support team immediately</li>
          <li>Your reports help us maintain a safe community for everyone</li>
        </ul>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
          <h4 className="text-yellow-800 mt-0 mb-2">When to Report</h4>
          <p className="mb-0">
            Report any of the following situations immediately:
            <ul className="mb-0">
              <li>Someone asks you to move communication off the platform</li>
              <li>A user requests payment for toys (our platform is for free sharing only)</li>
              <li>Someone shares unsafe or recalled toys</li>
              <li>A user exhibits harassing, threatening, or inappropriate behavior</li>
              <li>You receive unwelcome personal questions or requests</li>
              <li>Any situation that makes you feel uncomfortable or unsafe</li>
            </ul>
          </p>
        </div>

        <h2>Additional Tips for Families</h2>

        <h3>For Parents with Young Children</h3>
        <ul>
          <li>When bringing children to exchanges, maintain supervision at all times</li>
          <li>Consider having another adult attend so one person can watch the children while the other handles the exchange</li>
          <li>If possible, arrange exchanges during your child's nap time or when they can stay with another caregiver</li>
          <li>For older children, use exchange opportunities to teach about community, sharing, and safety</li>
        </ul>

        <h3>Building Trust Over Time</h3>
        <ul>
          <li>Start with small exchanges to build trust with community members</li>
          <li>After positive experiences with the same user, you might feel comfortable with more convenient arrangements</li>
          <li>Consider joining local toy-sharing groups to build relationships with families in your area</li>
          <li>Remember that safety should always remain a priority, even with users you've exchanged with before</li>
        </ul>

        <div className="bg-blue-700 text-white p-6 rounded-lg my-8">
          <h3 className="text-white mt-0 mb-3">Remember</h3>
          <p className="mb-0 text-white">
            Your safety is more important than any toy exchange. If at any point you feel uncomfortable or unsafe, 
            it's okay to cancel the exchange. Trust your instincts and prioritize your family's well-being.
          </p>
        </div>
      </div>

      <div className="mt-12 flex justify-between items-center">
        <Link href="/safety-center" className="text-blue-700 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Visit Safety Center
        </Link>
        <Link href="/help-center" className="text-blue-700 hover:underline flex items-center">
          Get More Help
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}