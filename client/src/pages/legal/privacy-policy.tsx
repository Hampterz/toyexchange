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
        <p className="text-blue-700 border-b border-blue-100 pb-4">Last Updated: April 15, 2024</p>
      </div>

      <div className="prose prose-blue max-w-none">
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <p className="font-medium text-blue-800 mb-0">
            At ToyShare, we value your privacy and are committed to protecting your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
            you use our service. Please read this policy carefully to understand our practices regarding your 
            personal data.
          </p>
        </div>

        <h2>1. Information We Collect</h2>
        <p>
          We collect several types of information from and about users of our platform:
        </p>

        <h3>1.1 Information You Provide to Us</h3>
        <ul>
          <li><strong>Account Information:</strong> When you register for an account, we collect your name, email address, password, and location.</li>
          <li><strong>Profile Information:</strong> Information you provide in your user profile, such as a profile picture, family information, preferences, and interests.</li>
          <li><strong>Toy Information:</strong> Details about toys you list for sharing, including descriptions, photos, age recommendations, and condition.</li>
          <li><strong>Communications:</strong> Content of messages you exchange with other users through the platform.</li>
          <li><strong>Feedback and Reviews:</strong> Comments, ratings, and reviews you submit about other users or toys.</li>
          <li><strong>Support Information:</strong> Information you provide when contacting our customer support team.</li>
        </ul>

        <h3>1.2 Information We Collect Automatically</h3>
        <ul>
          <li><strong>Usage Data:</strong> Information about your interactions with the platform, such as pages visited, features used, and time spent on the platform.</li>
          <li><strong>Device Information:</strong> Information about the device you use to access our service, including device type, operating system, browser type, IP address, and mobile device identifiers.</li>
          <li><strong>Location Data:</strong> General location information based on your IP address. If you grant permission, we may also collect precise location data to help you find toys near you.</li>
          <li><strong>Cookies and Similar Technologies:</strong> Information collected through cookies and similar technologies to improve your experience and analyze usage patterns. For more information, please see our Cookie Policy.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect for various purposes, including:
        </p>
        <ul>
          <li><strong>Providing the Service:</strong> To create and maintain your account, process your requests, facilitate toy exchanges, and provide customer support.</li>
          <li><strong>Connecting Users:</strong> To help you find and connect with other users who have toys you might be interested in or who might be interested in your toys.</li>
          <li><strong>Improving the Service:</strong> To understand how users interact with our platform, identify areas for improvement, and develop new features.</li>
          <li><strong>Personalization:</strong> To personalize your experience, including suggesting toys or users that may interest you based on your preferences and activity.</li>
          <li><strong>Communications:</strong> To send you service-related notifications, updates, and promotional messages (if you've opted in).</li>
          <li><strong>Safety and Security:</strong> To verify accounts, maintain the security of our platform, prevent fraud and abuse, and enforce our Terms of Service.</li>
          <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes.</li>
        </ul>

        <h2>3. How We Share Your Information</h2>
        <p>
          We may share your personal information in the following circumstances:
        </p>
        <ul>
          <li><strong>With Other Users:</strong> Your profile information, toy listings, and communications are shared with other users as necessary for the functioning of the platform.</li>
          <li><strong>With Service Providers:</strong> We may share information with third-party vendors, consultants, and other service providers who perform services on our behalf.</li>
          <li><strong>For Legal Reasons:</strong> We may disclose information if required to do so by law or in response to valid requests by public authorities.</li>
          <li><strong>For Safety and Security:</strong> We may share information when we believe disclosure is necessary to protect the rights, property, or safety of ToyShare, our users, or others.</li>
          <li><strong>With Your Consent:</strong> We may share information with third parties when you have given us consent to do so.</li>
          <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred as a business asset.</li>
        </ul>
        <p>
          We do not sell your personal information to third parties.
        </p>

        <h2>4. Your Privacy Choices and Rights</h2>
        <p>
          Depending on your location, you may have certain rights regarding your personal information. These may include:
        </p>
        <ul>
          <li><strong>Access:</strong> You can request a copy of the personal information we hold about you.</li>
          <li><strong>Correction:</strong> You can request that we correct inaccurate or incomplete information about you.</li>
          <li><strong>Deletion:</strong> You can request that we delete your personal information in certain circumstances.</li>
          <li><strong>Restriction:</strong> You can request that we restrict the processing of your information in certain circumstances.</li>
          <li><strong>Objection:</strong> You can object to our processing of your information in certain circumstances.</li>
          <li><strong>Data Portability:</strong> You can request a copy of the information you provided to us in a structured, commonly used, and machine-readable format.</li>
          <li><strong>Withdraw Consent:</strong> If we process your information based on your consent, you can withdraw that consent at any time.</li>
        </ul>
        <p>
          To exercise these rights, please contact us at privacy@toyshare.example.com.
        </p>

        <h2>5. Account Settings and Profile Information</h2>
        <p>
          You can access and update certain information about your account directly within your account settings. This includes:
        </p>
        <ul>
          <li>Profile information and photo</li>
          <li>Location information</li>
          <li>Email address and password</li>
          <li>Notification preferences</li>
          <li>Privacy settings</li>
        </ul>
        <p>
          You may also deactivate or delete your account through the account settings. When you delete your account, we will 
          remove your profile information and toy listings from public view immediately, but we may retain certain information 
          for a period of time as required by law or for legitimate business purposes.
        </p>

        <h2>6. Children's Privacy</h2>
        <p>
          Our service is intended for use by adults. We do not knowingly collect personal information from children under the age of 13. 
          If you are a parent or guardian and believe that your child has provided us with personal information, please contact us at 
          privacy@toyshare.example.com, and we will take steps to delete such information.
        </p>

        <h2>7. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect the security of your personal information. 
          However, please understand that no method of transmission over the Internet or method of electronic storage is 100% secure. 
          While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
        </p>

        <h2>8. Data Retention</h2>
        <p>
          We retain your personal information for as long as necessary to fulfill the purposes for which we collected it, including for the 
          purposes of satisfying any legal, accounting, or reporting requirements. To determine the appropriate retention period, we consider 
          the amount, nature, and sensitivity of the personal information, the potential risk of harm from unauthorized use or disclosure, 
          and the purposes for which we process the information.
        </p>

        <h2>9. International Data Transfers</h2>
        <p>
          Your information may be transferred to — and maintained on — computers located outside of your state, province, country, or other 
          governmental jurisdiction where the data protection laws may differ from those in your jurisdiction. If you are located outside the 
          United States and choose to provide information to us, please note that we transfer the information to the United States and process 
          it there. Your submission of such information represents your agreement to that transfer.
        </p>

        <h2>10. Third-Party Links and Services</h2>
        <p>
          Our service may contain links to third-party websites, services, or applications that are not owned or controlled by ToyShare. 
          We are not responsible for the privacy practices or the content of such third-party services. We encourage you to review the privacy 
          policies of any third-party services you access.
        </p>

        <h2>11. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
          and updating the "Last Updated" date at the top. For significant changes, we may provide additional notice, such as through email or 
          in-app notifications. We encourage you to review this Privacy Policy periodically to stay informed about how we protect your personal information.
        </p>

        <h2>12. Contact Us</h2>
        <p>
          If you have any questions, concerns, or feedback about this Privacy Policy or our privacy practices, please contact us at:
        </p>
        <p>
          Email: privacy@toyshare.example.com<br />
          Postal Address: ToyShare Privacy Team, 123 Main Street, San Francisco, CA 94105
        </p>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <Link href="/legal/terms-of-service" className="text-blue-700 hover:underline font-medium">
          Terms of Service
        </Link>
        <span className="hidden sm:inline text-gray-300">|</span>
        <Link href="/legal/cookie-policy" className="text-blue-700 hover:underline font-medium">
          Cookie Policy
        </Link>
        <span className="hidden sm:inline text-gray-300">|</span>
        <Link href="/legal/accessibility" className="text-blue-700 hover:underline font-medium">
          Accessibility
        </Link>
      </div>
    </div>
  );
}