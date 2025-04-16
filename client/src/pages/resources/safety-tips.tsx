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
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Safety Tips</h1>
        <p className="text-blue-700 border-b border-blue-100 pb-4">Keeping your family safe while sharing toys</p>
      </div>

      <div className="prose prose-blue max-w-none">
        <h2>Safe Toy Exchanges</h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-700 p-4 mb-6">
          <p className="text-blue-900 font-medium">
            Your safety is our top priority. These guidelines will help ensure all toy exchanges remain positive and secure.
          </p>
        </div>

        <h3>Before the Exchange</h3>
        <ul>
          <li>
            <strong>Verify profiles:</strong> Check user ratings and how long they've been a member before arranging an exchange
          </li>
          <li>
            <strong>Communicate clearly:</strong> Use the in-app messaging to discuss details and set expectations
          </li>
          <li>
            <strong>Arrange public meetups:</strong> Choose busy, well-lit public locations like coffee shops, libraries, or community centers
          </li>
          <li>
            <strong>Plan ahead:</strong> Let a friend or family member know where you're going and when you expect to return
          </li>
          <li>
            <strong>Daytime exchanges:</strong> Try to schedule exchanges during daylight hours when possible
          </li>
        </ul>

        <h3>During the Exchange</h3>
        <ul>
          <li>
            <strong>Bring a phone:</strong> Keep your charged phone readily accessible
          </li>
          <li>
            <strong>Trust your instincts:</strong> If something feels wrong, prioritize your safety and leave
          </li>
          <li>
            <strong>Inspect items:</strong> Take time to examine toys for safety and quality before accepting them
          </li>
          <li>
            <strong>Stay in public:</strong> Complete the entire exchange in the public location you agreed upon
          </li>
          <li>
            <strong>Be respectful:</strong> Keep interactions friendly, brief, and focused on the exchange
          </li>
        </ul>

        <h3>Home Exchanges (If Necessary)</h3>
        <ul>
          <li>
            <strong>Verify thoroughly:</strong> Only consider home exchanges with well-reviewed, established members
          </li>
          <li>
            <strong>Bring a friend:</strong> Don't go alone to someone's home (or have someone with you when hosting)
          </li>
          <li>
            <strong>Share location:</strong> Use a location-sharing app with a trusted person during the exchange
          </li>
          <li>
            <strong>Limited access:</strong> When hosting, limit access to a single area of your home like the porch or entryway
          </li>
          <li>
            <strong>Exchange outside:</strong> Consider doing the handoff on the porch or driveway rather than inviting someone in
          </li>
        </ul>

        <h3>Toy Safety Checks</h3>
        <ul>
          <li>
            <strong>Check for recalls:</strong> Visit <a href="https://www.cpsc.gov/Recalls" className="text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">CPSC.gov/Recalls</a> to verify the toy hasn't been recalled
          </li>
          <li>
            <strong>Age-appropriate:</strong> Ensure the toy is suitable for your child's age and development stage
          </li>
          <li>
            <strong>Inspect for damage:</strong> Look for broken parts, sharp edges, or other hazards
          </li>
          <li>
            <strong>Clean thoroughly:</strong> Sanitize all toys before giving them to your child
          </li>
          <li>
            <strong>Check for small parts:</strong> Be wary of choking hazards for young children
          </li>
        </ul>

        <h3>Special Considerations for Electronic Toys</h3>
        <ul>
          <li>
            <strong>Check battery compartments:</strong> Ensure they're secure and can't be easily opened by children
          </li>
          <li>
            <strong>Test functionality:</strong> Verify the toy works properly before giving it to your child
          </li>
          <li>
            <strong>Replace batteries:</strong> Use fresh batteries to prevent leakage and damage
          </li>
          <li>
            <strong>Check cords:</strong> Inspect for fraying or damage on any electrical cords
          </li>
        </ul>

        <h3>Reporting Concerns</h3>
        <p>
          If you encounter any safety issues, suspicious behavior, or policy violations, 
          please report them immediately through the app or by contacting our support team.
          Your reports help keep our community safe for everyone.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-700 p-4 mt-6">
          <p className="text-blue-900 font-medium">
            Remember: In case of an emergency, always contact local authorities first by dialing 911 (or your local emergency number).
          </p>
        </div>
      </div>
    </div>
  );
}