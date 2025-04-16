import React from "react";
import { Link } from "wouter";

export default function CommunityStandards() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-blue-700 hover:underline flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Community Standards</h1>
        <p className="text-blue-700 border-b border-blue-100 pb-4">The values and expectations that guide our community</p>
      </div>

      <div className="prose prose-blue max-w-none">
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-blue-900 mt-0">Our Community Vision</h2>
          <p className="mb-0">
            ToyShare is built on the vision of a sustainable, supportive community where families connect 
            through the sharing of toys. These standards guide our interactions, decisions, and platform 
            development to ensure a positive experience for everyone.
          </p>
        </div>

        <h2>Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose mb-8">
          <div className="bg-white border border-blue-100 rounded-lg p-5">
            <div className="text-blue-700 text-4xl mb-2">🤝</div>
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Trust & Safety</h3>
            <p className="text-gray-700">
              We prioritize creating a safe, trusted environment where families can connect with confidence.
            </p>
          </div>
          <div className="bg-white border border-blue-100 rounded-lg p-5">
            <div className="text-blue-700 text-4xl mb-2">🌿</div>
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Sustainability</h3>
            <p className="text-gray-700">
              We're committed to reducing waste and promoting the reuse of toys to benefit our environment.
            </p>
          </div>
          <div className="bg-white border border-blue-100 rounded-lg p-5">
            <div className="text-blue-700 text-4xl mb-2">💙</div>
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Community</h3>
            <p className="text-gray-700">
              We foster meaningful connections between families through generosity and shared experiences.
            </p>
          </div>
        </div>

        <h2>Expected Conduct</h2>
        <p>
          All members of the ToyShare community are expected to:
        </p>

        <h3>Be Honest and Transparent</h3>
        <ul>
          <li>Provide accurate information about toys (condition, age recommendations, etc.)</li>
          <li>Use clear, well-lit photos that accurately represent the toys</li>
          <li>Disclose any flaws, missing pieces, or issues with toys</li>
          <li>Be straightforward in all communications about exchange arrangements</li>
        </ul>

        <h3>Be Respectful and Kind</h3>
        <ul>
          <li>Communicate politely with other community members</li>
          <li>Respect privacy and personal boundaries</li>
          <li>Be patient with new users who are learning the platform</li>
          <li>Consider diverse perspectives and family situations</li>
          <li>Honor commitments and appointments for toy exchanges</li>
        </ul>

        <h3>Prioritize Safety</h3>
        <ul>
          <li>Only share toys that are safe and appropriate for children</li>
          <li>Ensure all toys are clean and sanitized before sharing</li>
          <li>Follow recommended safety practices for exchanges</li>
          <li>Report any safety concerns promptly</li>
        </ul>

        <h3>Build Community</h3>
        <ul>
          <li>Support other families through generous sharing</li>
          <li>Provide helpful feedback and reviews</li>
          <li>Share knowledge about toys and child development when relevant</li>
          <li>Welcome new members to the community</li>
        </ul>

        <h2>Prohibited Content & Behavior</h2>
        <p>
          To maintain a safe, family-friendly environment, the following are not permitted on ToyShare:
        </p>

        <h3>Prohibited Content</h3>
        <ul>
          <li><strong>Unsafe Toys:</strong> Recalled toys, toys with safety hazards, broken toys that pose risks</li>
          <li><strong>Inappropriate Items:</strong> Adult content, weapons or weapon replicas, items promoting harmful behaviors</li>
          <li><strong>Non-Toy Items:</strong> Services, general household goods, clothing (unless specifically costume/dress-up related)</li>
          <li><strong>Commercial Content:</strong> Advertisements, promotional content, affiliate links</li>
        </ul>

        <h3>Prohibited Behavior</h3>
        <ul>
          <li><strong>Harassment:</strong> Bullying, intimidation, threats, or unwelcome repeated contact</li>
          <li><strong>Discrimination:</strong> Content or behavior targeting people based on race, ethnicity, religion, gender, disability, or other protected characteristics</li>
          <li><strong>Selling:</strong> Attempting to sell toys rather than share them</li>
          <li><strong>Spam:</strong> Excessive messaging, duplicate listings, or irrelevant content</li>
          <li><strong>Misrepresentation:</strong> Creating false profiles, impersonating others, or providing misleading information</li>
          <li><strong>Platform Circumvention:</strong> Attempts to move communication off-platform to avoid community protections</li>
        </ul>

        <h2>Enforcement of Standards</h2>
        <p>
          Our community standards are enforced through:
        </p>
        <ul>
          <li><strong>Community Reporting:</strong> Members can report content or behavior that violates our standards</li>
          <li><strong>Moderation Team:</strong> Our dedicated team reviews reports and monitors the platform</li>
          <li><strong>Content Filtering:</strong> Automated systems help identify potentially problematic content</li>
          <li><strong>Graduated Response:</strong> Actions range from warnings to account suspension based on severity and frequency of violations</li>
        </ul>

        <h3>Potential Consequences</h3>
        <p>
          Violations of our community standards may result in:
        </p>
        <ul>
          <li>Content removal</li>
          <li>Warning notifications</li>
          <li>Temporary feature restrictions</li>
          <li>Temporary account suspension</li>
          <li>Permanent account termination (for serious or repeated violations)</li>
        </ul>

        <h2>Appeals Process</h2>
        <p>
          If you believe a moderation decision was made in error, you can appeal through the following process:
        </p>
        <ol>
          <li>Navigate to your account settings</li>
          <li>Select "Help & Support"</li>
          <li>Choose "Appeal a Decision"</li>
          <li>Provide details about the moderation action and why you believe it should be reconsidered</li>
          <li>Submit your appeal for review</li>
        </ol>
        <p>
          Appeals are typically reviewed within 5 business days.
        </p>

        <h2>Continuous Improvement</h2>
        <p>
          Our community standards evolve as our platform grows and changes. We regularly review and update 
          these standards based on:
        </p>
        <ul>
          <li>Feedback from community members</li>
          <li>Emerging safety concerns or best practices</li>
          <li>Changes in relevant laws and regulations</li>
          <li>Platform developments and new features</li>
        </ul>
        <p>
          We welcome your input on how we can improve these standards. Please share your thoughts by 
          contacting us at community@toyshare.example.com.
        </p>

        <div className="bg-blue-50 p-6 rounded-lg mt-8">
          <h3 className="text-blue-900 mt-0 mb-3">Our Commitment to You</h3>
          <p className="mb-0">
            We're committed to fostering a community where families can share toys safely, build meaningful 
            connections, and contribute to a more sustainable future for our children. By upholding these 
            standards together, we create a positive environment that benefits everyone.
          </p>
        </div>
      </div>

      <div className="mt-12 flex justify-between items-center">
        <Link href="/resources/community-guidelines" className="text-blue-700 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          View Detailed Guidelines
        </Link>
        <Link href="/safety-center" className="text-blue-700 hover:underline flex items-center">
          Visit Safety Center
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}