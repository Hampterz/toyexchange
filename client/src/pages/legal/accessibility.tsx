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
        <p className="text-blue-700 border-b border-blue-100 pb-4">Last Updated: April 15, 2023</p>
      </div>

      <div className="prose prose-blue max-w-none">
        <h2>Our Commitment to Accessibility</h2>
        <p>
          ToyShare is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to make our platform accessible to the widest possible audience, regardless of ability or technology.
        </p>

        <h2>Standards We Follow</h2>
        <p>
          ToyShare strives to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible to people with a wide array of disabilities, including:
        </p>
        <ul>
          <li>Visual impairments</li>
          <li>Hearing impairments</li>
          <li>Mobility impairments</li>
          <li>Cognitive disabilities</li>
          <li>Learning disabilities</li>
          <li>Speech disabilities</li>
        </ul>

        <h2>Accessibility Features</h2>
        <p>
          Our platform includes the following accessibility features:
        </p>
        <ul>
          <li><strong>Keyboard Navigation:</strong> All functionality is accessible through a keyboard without requiring specific timing for individual keystrokes.</li>
          <li><strong>Text Alternatives:</strong> Non-text content such as images, buttons, and form controls have text alternatives.</li>
          <li><strong>Color Contrast:</strong> Text and background color combinations meet minimum contrast ratios to ensure readability.</li>
          <li><strong>Responsive Design:</strong> Our interface adjusts to different screen sizes and orientations.</li>
          <li><strong>Semantic HTML:</strong> We use proper HTML markup to ensure compatibility with assistive technologies.</li>
          <li><strong>Consistent Navigation:</strong> Navigation mechanisms that appear on multiple pages appear in the same relative order each time.</li>
          <li><strong>Form Labels:</strong> All form controls are properly labeled to assist users of screen readers.</li>
          <li><strong>Error Identification:</strong> Input errors are clearly identified and described to users.</li>
          <li><strong>Focus Indicators:</strong> Keyboard focus is visible and clear.</li>
        </ul>

        <h2>Compatibility with Assistive Technologies</h2>
        <p>
          ToyShare is designed to be compatible with the following assistive technologies:
        </p>
        <ul>
          <li>Screen readers (e.g., JAWS, NVDA, VoiceOver, TalkBack)</li>
          <li>Speech recognition software</li>
          <li>Screen magnification software</li>
          <li>Alternative keyboard and pointing devices</li>
        </ul>

        <h2>Known Limitations</h2>
        <p>
          Despite our best efforts to ensure accessibility, there may be some limitations:
        </p>
        <ul>
          <li>Some older documents in PDF format may not be fully accessible.</li>
          <li>Some third-party content or applications that we link to may not follow the same accessibility standards.</li>
          <li>Videos added before January 2023 may not have captions or audio descriptions.</li>
        </ul>
        <p>
          We are actively working to address these limitations and improve the accessibility of our platform.
        </p>

        <h2>Feedback and Assistance</h2>
        <p>
          We welcome feedback on the accessibility of ToyShare. If you experience any barriers to accessing content on our platform, please let us know:
        </p>
        <ul>
          <li><strong>Email:</strong> accessibility@toyshare.example.com</li>
          <li><strong>Phone:</strong> (555) 123-4567</li>
          <li><strong>Feedback Form:</strong> <Link href="/resources/contact-support" className="text-blue-700 hover:underline">Contact Form</Link></li>
        </ul>
        <p>
          We aim to respond to accessibility feedback within 3 business days, and to propose a solution within 10 business days.
        </p>

        <h2>Additional Resources</h2>
        <p>
          For more information about web accessibility, visit these resources:
        </p>
        <ul>
          <li><a href="https://www.w3.org/WAI/standards-guidelines/wcag/" className="text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">Web Content Accessibility Guidelines (WCAG)</a></li>
          <li><a href="https://www.w3.org/WAI/" className="text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">W3C Web Accessibility Initiative (WAI)</a></li>
          <li><a href="https://www.ada.gov/" className="text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">Americans with Disabilities Act (ADA)</a></li>
        </ul>

        <h2>Continuous Improvement</h2>
        <p>
          ToyShare is committed to ongoing improvements to our platform's accessibility. We regularly review our platform, conduct user testing, and provide training for our development team on accessibility best practices. We are dedicated to maintaining an inclusive environment for all our users.
        </p>

        <div className="bg-blue-50 p-4 rounded-lg mt-8">
          <p className="text-sm text-gray-700">
            This accessibility statement was created on April 15, 2023 and is regularly reviewed and updated.
          </p>
        </div>
      </div>
    </div>
  );
}