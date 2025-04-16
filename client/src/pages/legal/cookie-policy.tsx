import React from "react";
import { Link } from "wouter";

export default function CookiePolicy() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-blue-700 hover:underline flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Cookie Policy</h1>
        <p className="text-blue-700 border-b border-blue-100 pb-4">Last Updated: April 15, 2024</p>
      </div>

      <div className="prose prose-blue max-w-none">
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <p className="font-medium text-blue-800 mb-0">
            This Cookie Policy explains how ToyShare ("we", "us", or "our") uses cookies and similar technologies 
            on our website and mobile applications. It explains what these technologies are and why we use them, 
            as well as your rights to control our use of them.
          </p>
        </div>

        <h2>What Are Cookies?</h2>
        <p>
          Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
          They are widely used to make websites work more efficiently and to provide information to the owners of the site.
        </p>
        <p>
          Cookies allow a website to recognize your device and remember if you've been to the website before. Cookies can 
          store your preferences and other information to enhance your browsing experience and gather analytics about how 
          you use the website.
        </p>

        <h2>Types of Cookies We Use</h2>
        <p>
          ToyShare uses the following types of cookies:
        </p>

        <h3>Essential Cookies</h3>
        <p>
          These cookies are necessary for the website to function properly. They enable basic functions like page navigation, 
          secure areas access, and toy listing availability. The website cannot function properly without these cookies.
        </p>
        <table className="min-w-full border border-blue-100 mb-6">
          <thead className="bg-blue-50">
            <tr>
              <th className="py-2 px-4 border-b border-blue-100 text-left">Cookie Name</th>
              <th className="py-2 px-4 border-b border-blue-100 text-left">Purpose</th>
              <th className="py-2 px-4 border-b border-blue-100 text-left">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b border-blue-100">session</td>
              <td className="py-2 px-4 border-b border-blue-100">Maintains your session state across page visits</td>
              <td className="py-2 px-4 border-b border-blue-100">Session</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-blue-100">auth</td>
              <td className="py-2 px-4 border-b border-blue-100">Keeps you logged in</td>
              <td className="py-2 px-4 border-b border-blue-100">30 days</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-blue-100">csrf_token</td>
              <td className="py-2 px-4 border-b border-blue-100">Prevents cross-site request forgery attacks</td>
              <td className="py-2 px-4 border-b border-blue-100">Session</td>
            </tr>
          </tbody>
        </table>

        <h3>Preference Cookies</h3>
        <p>
          These cookies allow the website to remember choices you make and provide enhanced, personalized features. 
          They may be set by us or by third-party providers whose services we have added to our pages.
        </p>
        <table className="min-w-full border border-blue-100 mb-6">
          <thead className="bg-blue-50">
            <tr>
              <th className="py-2 px-4 border-b border-blue-100 text-left">Cookie Name</th>
              <th className="py-2 px-4 border-b border-blue-100 text-left">Purpose</th>
              <th className="py-2 px-4 border-b border-blue-100 text-left">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b border-blue-100">language</td>
              <td className="py-2 px-4 border-b border-blue-100">Remembers your preferred language</td>
              <td className="py-2 px-4 border-b border-blue-100">1 year</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-blue-100">location</td>
              <td className="py-2 px-4 border-b border-blue-100">Stores your preferred location for toy searches</td>
              <td className="py-2 px-4 border-b border-blue-100">30 days</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-blue-100">recent_searches</td>
              <td className="py-2 px-4 border-b border-blue-100">Remembers your recent toy searches</td>
              <td className="py-2 px-4 border-b border-blue-100">30 days</td>
            </tr>
          </tbody>
        </table>

        <h3>Analytics Cookies</h3>
        <p>
          These cookies collect information about how you use our website, which pages you visit, and if you experience any errors. 
          This helps us improve how our website works and understand user interests. All data is collected anonymously.
        </p>
        <table className="min-w-full border border-blue-100 mb-6">
          <thead className="bg-blue-50">
            <tr>
              <th className="py-2 px-4 border-b border-blue-100 text-left">Cookie Name</th>
              <th className="py-2 px-4 border-b border-blue-100 text-left">Purpose</th>
              <th className="py-2 px-4 border-b border-blue-100 text-left">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b border-blue-100">_ga</td>
              <td className="py-2 px-4 border-b border-blue-100">Google Analytics - Distinguishes users</td>
              <td className="py-2 px-4 border-b border-blue-100">2 years</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-blue-100">_gid</td>
              <td className="py-2 px-4 border-b border-blue-100">Google Analytics - Distinguishes users</td>
              <td className="py-2 px-4 border-b border-blue-100">24 hours</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-blue-100">_gat</td>
              <td className="py-2 px-4 border-b border-blue-100">Google Analytics - Throttles request rate</td>
              <td className="py-2 px-4 border-b border-blue-100">1 minute</td>
            </tr>
          </tbody>
        </table>

        <h3>Marketing Cookies</h3>
        <p>
          These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad. 
          These cookies can share that information with other organizations or advertisers.
        </p>
        <table className="min-w-full border border-blue-100 mb-6">
          <thead className="bg-blue-50">
            <tr>
              <th className="py-2 px-4 border-b border-blue-100 text-left">Cookie Name</th>
              <th className="py-2 px-4 border-b border-blue-100 text-left">Purpose</th>
              <th className="py-2 px-4 border-b border-blue-100 text-left">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b border-blue-100">_fbp</td>
              <td className="py-2 px-4 border-b border-blue-100">Facebook - Used to deliver, measure, and improve advertisements</td>
              <td className="py-2 px-4 border-b border-blue-100">3 months</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-blue-100">ads_prefs</td>
              <td className="py-2 px-4 border-b border-blue-100">Stores advertisement preferences</td>
              <td className="py-2 px-4 border-b border-blue-100">1 year</td>
            </tr>
          </tbody>
        </table>

        <h2>Third-Party Cookies</h2>
        <p>
          In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service, 
          deliver advertisements, and so on. These cookies may be placed on your device when you visit our website or when you 
          use certain features of our service.
        </p>

        <h2>How to Control Cookies</h2>
        <p>
          You can control and manage cookies in various ways. Please keep in mind that removing or blocking cookies can impact your user experience and 
          some features of the website may no longer be fully accessible.
        </p>

        <h3>Browser Controls</h3>
        <p>
          Most browsers allow you to view, delete, and block cookies by adjusting the settings in your browser. To find out more about cookies, including 
          how to see what cookies have been set and how to manage and delete them, visit:
        </p>
        <ul>
          <li><a href="https://support.google.com/chrome/answer/95647" className="text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" className="text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">Safari</a></li>
          <li><a href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" className="text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
        </ul>

        <h3>Cookie Preference Center</h3>
        <p>
          You can manage your cookie preferences through our Cookie Preference Center, which you can access by clicking on "Cookie Settings" 
          in the footer of our website.
        </p>

        <h3>Do Not Track</h3>
        <p>
          Some browsers have a "Do Not Track" feature that lets you tell websites that you do not want to have your online activities tracked. 
          At this time, we do not respond to browser "Do Not Track" signals.
        </p>

        <h2>Updates to This Cookie Policy</h2>
        <p>
          We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons. 
          Please revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
        </p>
        <p>
          The date at the top of this Cookie Policy indicates when it was last updated.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
        </p>
        <p>
          Email: <a href="mailto:privacy@toyshare.example.com" className="text-blue-700 hover:underline">privacy@toyshare.example.com</a><br />
          Postal Address: ToyShare Privacy Team, 123 Main Street, San Francisco, CA 94105
        </p>

        <div className="bg-blue-50 p-6 rounded-lg mt-8">
          <h3 className="text-blue-900 mt-0 mb-2">Your Consent</h3>
          <p className="mb-0">
            By using our website, you consent to our use of cookies in accordance with this Cookie Policy. 
            If you do not accept the use of cookies, please disable them following the instructions in this Cookie Policy 
            so that cookies from this website cannot be placed on your device.
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
        <Link href="/legal/accessibility" className="text-blue-700 hover:underline font-medium">
          Accessibility
        </Link>
      </div>
    </div>
  );
}