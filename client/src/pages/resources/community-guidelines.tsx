import React from "react";
import { Link } from "wouter";

export default function CommunityGuidelines() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-blue-700 hover:underline flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Community Guidelines</h1>
        <p className="text-blue-700 border-b border-blue-100 pb-4">Guidelines for being a respectful member of the ToyShare community</p>
      </div>

      <div className="prose prose-blue max-w-none">
        <h2>Our Community Values</h2>
        <p>
          ToyShare is built on trust, generosity, and mutual respect. These guidelines help ensure 
          our community remains safe, welcoming, and enjoyable for all families.
        </p>

        <h2>Be Respectful and Kind</h2>
        <ul>
          <li>Treat all community members with respect, regardless of background or identity</li>
          <li>Use polite, appropriate language in all communications</li>
          <li>Be patient and understanding, especially with new members</li>
          <li>Assume good intentions from other community members</li>
        </ul>

        <h2>Honesty in All Interactions</h2>
        <ul>
          <li>Accurately describe the condition and age suitability of toys</li>
          <li>Include clear photos that represent the actual item</li>
          <li>Be upfront about any damage, missing pieces, or issues</li>
          <li>Honor your commitments for meetups and exchanges</li>
        </ul>

        <h2>Safe Exchanges</h2>
        <ul>
          <li>Arrange exchanges in public, well-lit places when possible</li>
          <li>Communicate clearly about pickup/delivery expectations</li>
          <li>If inviting someone to your home, verify their profile first</li>
          <li>Consider contactless options when appropriate</li>
        </ul>

        <h2>Quality Standards</h2>
        <ul>
          <li>All toys should be clean and sanitized before sharing</li>
          <li>Check for and disclose any safety issues</li>
          <li>Remove batteries before sharing electronic toys</li>
          <li>Ensure toys meet current safety standards</li>
        </ul>

        <h2>Prohibited Items</h2>
        <p>The following items are not permitted on ToyShare:</p>
        <ul>
          <li>Recalled toys or items with safety hazards</li>
          <li>Items with offensive imagery or messaging</li>
          <li>Age-inappropriate content</li>
          <li>Food items or consumables</li>
          <li>Heavily damaged or non-functional toys</li>
          <li>Items that don't comply with children's product safety regulations</li>
        </ul>

        <h2>Respectful Communication</h2>
        <ul>
          <li>Respond to messages in a timely manner</li>
          <li>If you need to cancel a planned exchange, notify the other party as soon as possible</li>
          <li>Be constructive and kind in your feedback</li>
          <li>Report inappropriate behavior rather than engaging in conflicts</li>
        </ul>

        <h2>Community Enforcement</h2>
        <p>
          Violations of these guidelines may result in warnings, temporary restrictions, 
          or removal from the platform in severe cases. Our moderation team reviews all 
          reports and works to ensure a safe, positive community experience.
        </p>

        <h2>Help Us Improve</h2>
        <p>
          These guidelines may evolve as our community grows. We welcome your feedback 
          and suggestions for improving our community standards. Please contact support 
          with any recommendations.
        </p>
      </div>
    </div>
  );
}