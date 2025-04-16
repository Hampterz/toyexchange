import React from "react";
import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-blue-700 hover:underline flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Terms of Service</h1>
        <p className="text-blue-700 border-b border-blue-100 pb-4">Last Updated: April 15, 2023</p>
      </div>

      <div className="prose prose-blue max-w-none">
        <p className="font-semibold">
          Please read these Terms of Service ("Terms") carefully before using the ToyShare platform.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using ToyShare, whether through our website, mobile application, or any other means, you agree to be bound by these Terms. If you do not agree to these Terms, you may not use ToyShare.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          ToyShare is a platform that enables parents and caregivers to share toys with other families in their community. The service allows users to list toys they no longer need, browse available toys, and arrange exchanges with other community members.
        </p>

        <h2>3. Eligibility</h2>
        <p>
          You must be at least 18 years old to create an account and use ToyShare. By using ToyShare, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms.
        </p>

        <h2>4. User Accounts</h2>
        <p>
          To use certain features of ToyShare, you must create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
        </p>
        <p>
          You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify ToyShare immediately of any unauthorized use of your account.
        </p>
        <p>
          ToyShare reserves the right to disable any user account at any time, including if you have violated these Terms or if your account shows signs of malicious activity.
        </p>

        <h2>5. User Content</h2>
        <p>
          When you submit content to ToyShare (including toy listings, messages, reviews, and profile information), you grant ToyShare a non-exclusive, worldwide, royalty-free license to use, copy, modify, and display that content in connection with the services.
        </p>
        <p>
          You represent and warrant that you own or have the necessary rights to the content you post and that your content does not violate the rights of any third party or any applicable law.
        </p>

        <h2>6. Prohibited Activities</h2>
        <p>
          You agree not to:
        </p>
        <ul>
          <li>Use ToyShare for any illegal purpose or in violation of any local, state, national, or international law</li>
          <li>List or exchange recalled, dangerous, or prohibited items</li>
          <li>Harass, abuse, or harm another person, including sending unwelcome communications</li>
          <li>Impersonate or misrepresent your affiliation with any person or entity</li>
          <li>Upload or transmit viruses, malware, or other malicious code</li>
          <li>Attempt to circumvent any security or access restrictions of the service</li>
          <li>Use ToyShare for commercial purposes without prior written consent</li>
          <li>Exchange toys for money or other consideration</li>
          <li>Post misleading or inaccurate content</li>
        </ul>

        <h2>7. Toy Exchanges</h2>
        <p>
          ToyShare is a platform that facilitates connections between users wishing to share toys. ToyShare does not guarantee the quality, safety, or legality of toys exchanged, nor the accuracy of toy listings.
        </p>
        <p>
          All exchanges are arranged and conducted at the users' own risk. ToyShare is not a party to any agreement between users and has no control over the conduct of users or the toys they share.
        </p>
        <p>
          Users are solely responsible for checking toys for recalls, damage, and safety before exchanging or using them.
        </p>

        <h2>8. Safety</h2>
        <p>
          While ToyShare strives to create a safe community, we cannot guarantee the behavior of users. We strongly recommend:
        </p>
        <ul>
          <li>Meeting in public places for toy exchanges</li>
          <li>Inspecting toys carefully before accepting them</li>
          <li>Reviewing user profiles and ratings before arranging an exchange</li>
          <li>Following all safety guidelines provided on the platform</li>
        </ul>

        <h2>9. Privacy</h2>
        <p>
          Your use of ToyShare is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.
        </p>

        <h2>10. Disclaimer of Warranties</h2>
        <p>
          ToyShare is provided "as is" and "as available" without any warranties of any kind, either express or implied. To the fullest extent permitted by law, ToyShare disclaims all warranties, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
        </p>
        <p>
          ToyShare does not warrant that the service will be uninterrupted, secure, or error-free, that defects will be corrected, or that the service or the servers that make it available are free of viruses or other harmful components.
        </p>

        <h2>11. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, ToyShare and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or goodwill, arising out of or in connection with these Terms or your use of the service.
        </p>
        <p>
          In no event shall ToyShare's total liability to you for all claims arising out of or relating to these Terms or your use of the service exceed one hundred dollars ($100).
        </p>

        <h2>12. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless ToyShare and its officers, directors, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from:
        </p>
        <ul>
          <li>Your use of the service</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any rights of another person or entity</li>
          <li>Your conduct in connection with the service</li>
        </ul>

        <h2>13. Modifications to the Terms</h2>
        <p>
          ToyShare reserves the right to modify these Terms at any time. We will provide notice of significant changes through the service or by other means. Your continued use of ToyShare after such changes constitutes acceptance of the modified Terms.
        </p>

        <h2>14. Termination</h2>
        <p>
          ToyShare may terminate or suspend your account and access to the service at any time, with or without cause and with or without notice. Upon termination, your right to use the service will immediately cease.
        </p>

        <h2>15. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the State of Washington, without regard to its conflict of law provisions.
        </p>

        <h2>16. Dispute Resolution</h2>
        <p>
          Any dispute arising from or relating to these Terms or your use of ToyShare shall be resolved through binding arbitration in accordance with the American Arbitration Association's rules.
        </p>
        <p>
          Any arbitration shall be conducted in English and take place in Seattle, Washington. The decision of the arbitrator shall be final and binding.
        </p>

        <h2>17. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at legal@toyshare.example.com.
        </p>

        <p className="mt-8 text-sm text-gray-600">
          By using ToyShare, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
        </p>
      </div>
    </div>
  );
}