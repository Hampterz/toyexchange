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
        <p className="text-blue-700 border-b border-blue-100 pb-4">Last Updated: April 15, 2024</p>
      </div>

      <div className="prose prose-blue max-w-none">
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <p className="font-medium text-blue-800 mb-0">
            Please read these Terms of Service ("Terms") carefully before using ToyShare. By accessing or using our service, 
            you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the service.
          </p>
        </div>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By creating an account with ToyShare, or by accessing or using our website or mobile applications, 
          you acknowledge that you have read, understood, and agree to be bound by these Terms, as well as our 
          Privacy Policy and Community Guidelines.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          ToyShare is a community platform that enables families to share gently-used toys with one another. 
          Our service includes the website, mobile applications, and any related services, features, content, or applications 
          (collectively, the "Service").
        </p>
        <p>
          We do not own, sell, rent, or lease any toys. We provide a platform for users to connect, communicate,
          and arrange the sharing of toys directly with one another. ToyShare is not a party to any agreement between 
          users regarding the exchange of toys.
        </p>

        <h2>3. Account Registration</h2>
        <p>
          To use certain features of the Service, you must register for an account. When you register, you agree to:
        </p>
        <ul>
          <li>Provide accurate, current, and complete information</li>
          <li>Maintain and promptly update your account information</li>
          <li>Maintain the security of your account and password</li>
          <li>Accept responsibility for all activities that occur under your account</li>
          <li>Notify us immediately of any unauthorized use of your account</li>
        </ul>
        <p>
          We reserve the right to refuse service, terminate accounts, or remove content at our discretion.
        </p>

        <h2>4. User Conduct</h2>
        <p>
          As a user of ToyShare, you agree not to:
        </p>
        <ul>
          <li>Violate any local, state, national, or international law or regulation</li>
          <li>Post false, misleading, or deceptive content</li>
          <li>Share toys that are recalled, unsafe, inappropriate for children, or prohibited by law</li>
          <li>Harass, abuse, or harm another person, including sending unwelcome communications</li>
          <li>Impersonate any person or entity</li>
          <li>Sell or attempt to sell toys through our platform</li>
          <li>Use the Service for commercial purposes without our prior written consent</li>
          <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
          <li>Attempt to gain unauthorized access to any portion of the Service</li>
          <li>Collect or store personal data about other users without their express consent</li>
          <li>Use the Service in any way that could damage, disable, overburden, or impair the Service</li>
        </ul>

        <h2>5. Toy Listings and Content</h2>
        <p>
          You are solely responsible for the toys you list and the content you post on ToyShare, including:
        </p>
        <ul>
          <li>Photos, descriptions, and information about toys</li>
          <li>Messages sent to other users</li>
          <li>Reviews, comments, and feedback</li>
          <li>Any other content you submit to the Service</li>
        </ul>
        <p>
          By posting content on ToyShare, you grant us a non-exclusive, transferable, sub-licensable, royalty-free, 
          worldwide license to use, modify, publicly display, reproduce, and distribute such content on and through the Service.
        </p>
        <p>
          We do not claim ownership of your content, but we need these rights to operate and improve the Service.
        </p>

        <h2>6. Toy Safety and Condition</h2>
        <p>
          When listing toys, you agree to:
        </p>
        <ul>
          <li>Verify that the toy has not been recalled</li>
          <li>Ensure the toy is safe, clean, and suitable for its intended age group</li>
          <li>Provide accurate descriptions of the toy's condition, including any defects or missing parts</li>
          <li>Comply with all applicable safety standards and regulations</li>
        </ul>
        <p>
          ToyShare reserves the right to remove any toy listing that we believe, in our sole discretion, violates these 
          requirements or otherwise poses a safety risk.
        </p>

        <h2>7. Exchanges and Meetups</h2>
        <p>
          ToyShare is not responsible for arranging or facilitating physical exchanges of toys between users. Users 
          are solely responsible for arranging and conducting toy exchanges safely and appropriately.
        </p>
        <p>
          We recommend following these safety guidelines:
        </p>
        <ul>
          <li>Meet in public, well-lit places</li>
          <li>Inform a friend or family member about your meetup plans</li>
          <li>Be cautious about sharing personal information</li>
          <li>Trust your instincts and leave if you feel uncomfortable</li>
        </ul>

        <h2>8. Disclaimers and Limitation of Liability</h2>
        <p>
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
        </p>
        <p>
          TO THE FULLEST EXTENT PERMITTED BY LAW, TOYSHARE DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING 
          IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>
        <p>
          TOYSHARE DOES NOT WARRANT THAT:
        </p>
        <ul>
          <li>THE SERVICE WILL BE SECURE OR AVAILABLE AT ANY PARTICULAR TIME OR LOCATION</li>
          <li>ANY DEFECTS OR ERRORS WILL BE CORRECTED</li>
          <li>THE SERVICE IS FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS</li>
          <li>THE RESULTS OF USING THE SERVICE WILL MEET YOUR REQUIREMENTS</li>
        </ul>
        <p>
          TO THE FULLEST EXTENT PERMITTED BY LAW, TOYSHARE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
          CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, 
          OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
        </p>
        <ul>
          <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE</li>
          <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE</li>
          <li>ANY CONTENT OBTAINED FROM THE SERVICE</li>
          <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT</li>
          <li>INTERACTIONS YOU HAVE WITH OTHER USERS OF THE SERVICE OR ANY TOY EXCHANGES ARRANGED THROUGH THE SERVICE</li>
        </ul>

        <h2>9. Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless ToyShare and its officers, directors, employees, and agents 
          from and against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable 
          legal fees, arising out of or in any way connected with:
        </p>
        <ul>
          <li>Your access to or use of the Service</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any third-party right, including without limitation any intellectual property right or privacy right</li>
          <li>Any claim that your content caused damage to a third party</li>
          <li>Any toy exchanges or interactions with other users</li>
        </ul>

        <h2>10. Modifications to the Service and Terms</h2>
        <p>
          ToyShare reserves the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with 
          or without notice. We shall not be liable to you or to any third party for any modification, suspension, or discontinuance 
          of the Service.
        </p>
        <p>
          We may revise these Terms from time to time. The most current version will always be on our website. By continuing 
          to access or use the Service after those revisions become effective, you agree to be bound by the revised Terms.
        </p>

        <h2>11. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the state of California, without 
          regard to its conflict of law provisions.
        </p>
        <p>
          Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. 
          If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of 
          these Terms will remain in effect.
        </p>

        <h2>12. Entire Agreement</h2>
        <p>
          These Terms, together with our Privacy Policy and any other legal notices published by ToyShare on the Service, 
          shall constitute the entire agreement between you and ToyShare concerning the Service.
        </p>

        <h2>13. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at legal@toyshare.example.com.
        </p>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <Link href="/legal/privacy-policy" className="text-blue-700 hover:underline font-medium">
          Privacy Policy
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