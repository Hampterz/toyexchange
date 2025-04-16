import React from "react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-blue-700 hover:underline flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Privacy Policy</h1>
        <p className="text-blue-700 border-b border-blue-100 pb-4">Last Updated: April 15, 2023</p>
      </div>

      <div className="prose prose-blue max-w-none">
        <p className="font-semibold">
          This Privacy Policy explains how ToyShare collects, uses, shares, and protects your personal information when you use our platform.
        </p>

        <h2>1. Information We Collect</h2>
        
        <h3>1.1 Information You Provide</h3>
        <p>
          We collect information you provide directly to us when using ToyShare, including:
        </p>
        <ul>
          <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, password, and location.</li>
          <li><strong>Profile Information:</strong> Additional information you choose to add to your profile, such as a profile picture or biography.</li>
          <li><strong>Toy Listings:</strong> Information about toys you share, including descriptions, photos, condition, and age recommendations.</li>
          <li><strong>Messages:</strong> Content of messages you exchange with other users regarding toy exchanges.</li>
          <li><strong>Feedback:</strong> Ratings and reviews you provide about other users.</li>
          <li><strong>Support Communications:</strong> Information you provide when contacting our support team.</li>
        </ul>

        <h3>1.2 Information We Collect Automatically</h3>
        <p>
          When you use ToyShare, we automatically collect certain information, including:
        </p>
        <ul>
          <li><strong>Device Information:</strong> Information about your device, including IP address, device type, operating system, and browser type.</li>
          <li><strong>Usage Information:</strong> How you use our platform, including pages visited, time spent, and actions taken.</li>
          <li><strong>Location Information:</strong> General location information based on your IP address. With your consent, we may collect more precise location information to show you relevant toy listings in your area.</li>
          <li><strong>Cookies and Similar Technologies:</strong> Information collected through cookies and similar technologies to enhance your experience. See our Cookie Policy for more details.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul>
          <li>Provide, maintain, and improve ToyShare</li>
          <li>Create and manage your account</li>
          <li>Connect you with other users for toy exchanges</li>
          <li>Personalize your experience and show relevant content</li>
          <li>Process and facilitate toy exchange arrangements</li>
          <li>Communicate with you about updates, features, and support</li>
          <li>Monitor and analyze usage trends and preferences</li>
          <li>Detect, investigate, and prevent fraudulent transactions, security incidents, and other harmful activities</li>
          <li>Comply with legal obligations</li>
          <li>Enforce our Terms of Service and other policies</li>
        </ul>

        <h2>3. How We Share Your Information</h2>
        <p>
          We may share your personal information in the following circumstances:
        </p>
        <ul>
          <li><strong>With Other Users:</strong> When you list a toy or request one, certain information (such as your profile name, photo, general location, and ratings) is visible to other users. When you agree to exchange a toy with another user, your specific location and contact details may be shared with that user.</li>
          <li><strong>Service Providers:</strong> We may share information with third-party vendors and service providers who perform services on our behalf, such as hosting, analytics, customer service, and email delivery.</li>
          <li><strong>Legal Requirements:</strong> We may disclose information if required to do so by law or in response to valid legal requests, such as subpoenas, court orders, or government regulations.</li>
          <li><strong>Safety and Protection:</strong> We may share information to protect the safety and security of ToyShare, our users, or the public.</li>
          <li><strong>Business Transfers:</strong> If ToyShare is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
          <li><strong>With Your Consent:</strong> We may share information with third parties when you give us explicit consent to do so.</li>
        </ul>
        <p>
          We do not sell your personal information to third parties for marketing or advertising purposes.
        </p>

        <h2>4. Data Security</h2>
        <p>
          We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure. Therefore, while we strive to protect your information, we cannot guarantee its absolute security.
        </p>

        <h2>5. Your Rights and Choices</h2>
        <p>
          Depending on your location, you may have certain rights regarding your personal information, including:
        </p>
        <ul>
          <li><strong>Account Information:</strong> You can update, correct, or delete your account information at any time by accessing your account settings.</li>
          <li><strong>Location Information:</strong> You can control whether we collect precise location information through your device settings.</li>
          <li><strong>Cookies:</strong> You can manage cookie preferences through your browser settings. For more information, see our Cookie Policy.</li>
          <li><strong>Marketing Communications:</strong> You can opt out of marketing emails by following the unsubscribe instructions in the emails or by updating your communication preferences in your account settings.</li>
          <li><strong>Access and Portability:</strong> You may request access to the personal information we hold about you and, in some cases, request that we provide it in a portable format.</li>
          <li><strong>Deletion:</strong> You may request that we delete your personal information, subject to certain exceptions provided by law.</li>
          <li><strong>Objection and Restriction:</strong> You may object to or request restriction of processing of your personal information under certain circumstances.</li>
        </ul>
        <p>
          To exercise these rights, please contact us at privacy@toyshare.example.com.
        </p>

        <h2>6. Children's Privacy</h2>
        <p>
          ToyShare is intended for use by individuals who are at least 18 years old. We do not knowingly collect personal information from children under 18. If you believe we have collected information from a child under 18, please contact us, and we will promptly delete the information.
        </p>

        <h2>7. International Data Transfers</h2>
        <p>
          ToyShare is based in the United States. If you are accessing our platform from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States or other countries where our servers are located. By using ToyShare, you consent to the transfer of your information to countries outside your country of residence, including the United States, which may have different data protection rules than those in your country.
        </p>

        <h2>8. Changes to this Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated Privacy Policy on our platform or by sending you an email notification. We encourage you to review this Privacy Policy periodically.
        </p>

        <h2>9. Contact Us</h2>
        <p>
          If you have any questions, concerns, or suggestions regarding this Privacy Policy or our privacy practices, please contact us at privacy@toyshare.example.com.
        </p>

        <div className="bg-blue-50 p-4 rounded-lg mt-8">
          <p className="text-sm text-gray-700">
            By using ToyShare, you acknowledge that you have read and understood this Privacy Policy and agree to our collection, use, and disclosure practices as described herein.
          </p>
        </div>
      </div>
    </div>
  );
}