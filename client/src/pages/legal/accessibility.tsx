import React from "react";
import { Link } from "wouter";

export default function Accessibility() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-blue-700 hover:underline flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Accessibility Statement</h1>
        <p className="text-blue-700 border-b border-blue-100 pb-4">Last Updated: April 15, 2024</p>
      </div>

      <div className="prose prose-blue max-w-none">
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <p className="font-medium text-blue-800 mb-0">
            ToyShare is committed to ensuring digital accessibility for people with disabilities. We are continually 
            improving the user experience for everyone and applying the relevant accessibility standards.
          </p>
        </div>

        <h2>Our Commitment</h2>
        <p>
          At ToyShare, we believe that all families should have equal access to our toy-sharing platform. We strive to 
          ensure that our website and mobile applications are accessible and usable by people of all abilities.
        </p>
        <p>
          We are working to increase the accessibility and usability of our platform and in doing so adhere to many of 
          the available standards and guidelines, including the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA.
        </p>

        <h2>Accessibility Features</h2>
        <p>
          Our platform includes the following accessibility features:
        </p>
        <ul>
          <li><strong>Screen Reader Compatibility:</strong> Our content is structured to work with screen readers, with proper heading tags, image alt text, and ARIA attributes where appropriate.</li>
          <li><strong>Keyboard Navigation:</strong> All interactive elements are accessible via keyboard navigation.</li>
          <li><strong>Text Resizing:</strong> Text can be resized up to 200% without loss of content or functionality.</li>
          <li><strong>Color Contrast:</strong> We maintain sufficient color contrast ratios for text and interface components to ensure readability.</li>
          <li><strong>Focus Indicators:</strong> Visible focus indicators help keyboard users understand which element has focus.</li>
          <li><strong>Alternative Text:</strong> All non-decorative images have descriptive alternative text.</li>
          <li><strong>Semantic Structure:</strong> We use semantic HTML elements to ensure a logical structure.</li>
          <li><strong>Consistent Navigation:</strong> Navigation mechanisms remain consistent throughout the platform.</li>
          <li><strong>Form Labels:</strong> All form fields have proper labels to assist users of assistive technologies.</li>
        </ul>

        <h2>Compatibility with Browsers and Assistive Technology</h2>
        <p>
          We aim to support the widest array of browsers and assistive technologies as possible, including:
        </p>
        <ul>
          <li>Recent versions of major browsers (Chrome, Firefox, Safari, Edge)</li>
          <li>Screen readers such as JAWS, NVDA, VoiceOver, and TalkBack</li>
          <li>Screen magnification software</li>
          <li>Speech recognition software</li>
          <li>Alternative input devices</li>
        </ul>

        <h2>Known Limitations</h2>
        <p>
          Despite our efforts to ensure the accessibility of ToyShare, there may be some limitations:
        </p>
        <ul>
          <li>Some older content may not yet meet all of our accessibility standards.</li>
          <li>Some third-party content or functionality may not be fully accessible. We are working with our vendors to address these issues.</li>
          <li>Our mobile applications are continuously being improved for accessibility, but some features may not yet be fully accessible.</li>
        </ul>
        <p>
          We are actively working to identify and resolve these issues.
        </p>

        <h2>Feedback and Assistance</h2>
        <p>
          We welcome feedback on the accessibility of ToyShare. If you encounter barriers to accessibility on our platform, please let us know:
        </p>
        <ul>
          <li>Email: <a href="mailto:accessibility@toyshare.example.com" className="text-blue-700 hover:underline">accessibility@toyshare.example.com</a></li>
          <li>Phone: (555) 123-4567</li>
          <li>Contact form: <Link href="/resources/contact-support" className="text-blue-700 hover:underline">Contact Support</Link> (select "Accessibility" as the category)</li>
        </ul>
        <p>
          We try to respond to feedback within 2 business days.
        </p>

        <h2>Accessibility Support Options</h2>
        <p>
          If you are experiencing difficulty accessing any part of our platform, we offer several support options:
        </p>
        <ul>
          <li><strong>Alternative Formats:</strong> We can provide information in alternative formats upon request.</li>
          <li><strong>Assistance:</strong> Our support team is available to assist users who have difficulty using our platform.</li>
          <li><strong>Voice Support:</strong> Users can contact our support team by phone for assistance with any part of the platform.</li>
        </ul>

        <h2>Assessment Approach</h2>
        <p>
          ToyShare assesses the accessibility of our platform through a combination of:
        </p>
        <ul>
          <li>Automated testing tools</li>
          <li>Manual testing with assistive technologies</li>
          <li>User testing with people who have disabilities</li>
          <li>Regular audits by accessibility specialists</li>
        </ul>

        <h2>Our Ongoing Efforts</h2>
        <p>
          We are committed to ongoing accessibility improvements. Our current initiatives include:
        </p>
        <ul>
          <li>Regular accessibility training for our design and development teams</li>
          <li>Incorporating accessibility into our design and development processes</li>
          <li>Periodic audits of our platform for accessibility barriers</li>
          <li>Working with users with disabilities to test and improve our platform</li>
          <li>Partnering with accessibility experts to guide our ongoing efforts</li>
        </ul>

        <h2>Formal Approval</h2>
        <p>
          This accessibility statement was last reviewed and approved by ToyShare's leadership team on April 15, 2024.
        </p>

        <div className="bg-blue-50 p-6 rounded-lg mt-8">
          <h3 className="text-blue-900 mt-0 mb-2">Contact Us</h3>
          <p className="mb-0">
            We value your feedback and are committed to making our platform accessible to all users. 
            If you have any questions or suggestions regarding the accessibility of ToyShare, 
            please contact us at <a href="mailto:accessibility@toyshare.example.com" className="text-blue-700 hover:underline">accessibility@toyshare.example.com</a>.
          </p>
        </div>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <Link href="/legal/terms-of-service" className="text-blue-700 hover:underline font-medium">
          Terms of Service
        </Link>
        <span className="hidden sm:inline text-gray-300">|</span>
        <Link href="/legal/privacy-policy" className="text-blue-700 hover:underline font-medium">
          Privacy Policy
        </Link>
        <span className="hidden sm:inline text-gray-300">|</span>
        <Link href="/legal/cookie-policy" className="text-blue-700 hover:underline font-medium">
          Cookie Policy
        </Link>
      </div>
    </div>
  );
}