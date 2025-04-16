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
        <p className="text-blue-700 border-b border-blue-100 pb-4">Last Updated: April 15, 2023</p>
      </div>

      <div className="prose prose-blue max-w-none">
        <p className="font-semibold">
          This Cookie Policy explains how ToyShare ("we", "us", or "our") uses cookies and similar technologies on our website and application.
        </p>

        <h2>What Are Cookies?</h2>
        <p>
          Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners. Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device when you go offline, while session cookies are deleted as soon as you close your web browser.
        </p>

        <h2>How We Use Cookies</h2>
        <p>
          We use different types of cookies for various purposes:
        </p>

        <h3>Essential Cookies</h3>
        <p>
          These cookies are necessary for the website to function properly and cannot be disabled in our systems. They are usually set in response to actions you take such as setting your privacy preferences, logging in, or filling in forms. These include:
        </p>
        <ul>
          <li>Session management cookies</li>
          <li>Authentication cookies</li>
          <li>Security cookies</li>
        </ul>

        <h3>Performance and Analytics Cookies</h3>
        <p>
          These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us understand which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated. These include:
        </p>
        <ul>
          <li>Google Analytics cookies</li>
          <li>Page load time monitoring cookies</li>
          <li>User behavior tracking cookies</li>
        </ul>

        <h3>Functionality Cookies</h3>
        <p>
          These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings. They may be set by us or by third-party providers whose services we have added to our pages. These include:
        </p>
        <ul>
          <li>Language preference cookies</li>
          <li>Location cookies</li>
          <li>User interface customization cookies</li>
        </ul>

        <h3>Targeting and Advertising Cookies</h3>
        <p>
          These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites. They do not directly store personal information, but are based on uniquely identifying your browser and internet device. These include:
        </p>
        <ul>
          <li>Social media cookies</li>
          <li>Advertising cookies</li>
          <li>Retargeting cookies</li>
        </ul>

        <h2>Similar Technologies</h2>
        <p>
          In addition to cookies, we may use other similar technologies, such as:
        </p>
        <ul>
          <li><strong>Web Beacons:</strong> Small graphic images (also known as "pixel tags" or "clear GIFs") that may be included on our sites, apps, and emails, that help us understand how you interact with those websites, apps, and emails.</li>
          <li><strong>Local Storage:</strong> Browser web storage that allows websites to store data in a browser on a device. Local storage is typically used to display content based on browsing history and store user preferences.</li>
          <li><strong>Session Replay:</strong> Technologies that help us understand how you interact with our website by recreating your actions, such as mouse movements, clicks, and scrolling.</li>
        </ul>

        <h2>Your Cookie Choices</h2>
        <p>
          Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies or delete certain cookies. Generally, you should also be able to:
        </p>
        <ul>
          <li>Set your browser to block all cookies</li>
          <li>Allow only "trusted" websites to set them</li>
          <li>Set your browser to clear cookies each time you close it</li>
          <li>Accept cookies from websites only for the duration of your visit</li>
          <li>Block third-party cookies</li>
        </ul>
        <p>
          Please note that if you choose to block or delete cookies, you may not be able to take full advantage of the website and some features may not work properly.
        </p>

        <h3>Managing Cookies in Popular Browsers</h3>
        <ul>
          <li><strong>Google Chrome:</strong> Settings &gt; Privacy and security &gt; Cookies and other site data</li>
          <li><strong>Mozilla Firefox:</strong> Menu &gt; Options &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
          <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Cookies and website data</li>
          <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions &gt; Cookies and site data</li>
        </ul>

        <h2>Our Cookie Consent Tool</h2>
        <p>
          When you first visit our website, you will be shown a cookie banner that allows you to accept or decline non-essential cookies. You can change your preferences at any time by clicking on the "Cookie Settings" link in the footer of our website.
        </p>

        <h2>Updates to This Cookie Policy</h2>
        <p>
          We may update this Cookie Policy from time to time to reflect changes in technology, law, our business operations, or any other reason we determine is necessary or appropriate. When we make changes, we will update the "Last Updated" date at the top of this policy and post the updated policy on our website.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about our use of cookies or this Cookie Policy, please contact us at privacy@toyshare.example.com.
        </p>

        <div className="bg-blue-50 p-4 rounded-lg mt-8">
          <p className="text-sm text-gray-700">
            By continuing to use our website, you consent to our use of cookies as described in this Cookie Policy.
          </p>
        </div>
      </div>
    </div>
  );
}