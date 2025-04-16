import React from "react";
import { Link } from "wouter";

export default function AccountSecurity() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Link href="/safety-center" className="text-blue-700 hover:underline flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Safety Center
        </Link>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Account Security</h1>
        <p className="text-blue-700 border-b border-blue-100 pb-4">Protecting your ToyShare account</p>
      </div>

      <div className="prose prose-blue max-w-none">
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-blue-900 mt-0">Why Account Security Matters</h2>
          <p className="mb-0">
            Your ToyShare account contains personal information and is your gateway to our community. 
            Keeping it secure helps protect your privacy, prevents unauthorized access, and maintains 
            trust within our toy-sharing network.
          </p>
        </div>

        <h2>Creating a Strong Password</h2>
        <p>
          Your password is the first line of defense for your account. Follow these guidelines to create a strong password:
        </p>
        <ul>
          <li>Use at least 12 characters</li>
          <li>Include a mix of uppercase letters, lowercase letters, numbers, and symbols</li>
          <li>Avoid using easily guessable information (like birthdays or names)</li>
          <li>Don't reuse passwords from other websites</li>
          <li>Consider using a passphrase (a series of random words) for better security and memorability</li>
        </ul>

        <div className="bg-white border border-blue-100 rounded-lg p-6 mb-6">
          <h3 className="text-blue-800 mt-0">Example of a Strong Password</h3>
          <p className="text-gray-700">
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">Sharing!Toys&Family2023</span>
          </p>
          <p className="text-gray-700 mb-0">
            This password uses uppercase and lowercase letters, numbers, symbols, and is over 12 characters long.
          </p>
        </div>

        <h2>Two-Factor Authentication</h2>
        <p>
          Adding two-factor authentication (2FA) provides an additional layer of security by requiring a second 
          verification step beyond your password. While we're working to implement 2FA directly on ToyShare, 
          we recommend using these best practices for your email account, which is linked to your ToyShare account:
        </p>
        <ul>
          <li>Enable 2FA on the email account associated with your ToyShare profile</li>
          <li>Use an authenticator app rather than SMS when possible for stronger security</li>
          <li>Keep recovery codes in a safe place</li>
        </ul>

        <h2>Recognizing Phishing Attempts</h2>
        <p>
          Phishing is a common way accounts get compromised. Be vigilant about:
        </p>
        <ul>
          <li>Emails claiming to be from ToyShare that ask for your password</li>
          <li>Messages with urgent calls to action or threats</li>
          <li>Links to websites that look like ToyShare but have slightly different URLs</li>
          <li>Unexpected attachments or download requests</li>
        </ul>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-yellow-800 font-medium mb-0">
            ToyShare will never ask for your password via email, message, or phone call. 
            All official communication will come from @toyshare.example.com email addresses.
          </p>
        </div>

        <h2>Device and Session Management</h2>
        <p>
          Keep track of where your account is being accessed:
        </p>
        <ul>
          <li>Review your active sessions in Account Settings</li>
          <li>Log out of your account when using shared or public computers</li>
          <li>Sign out unused or unrecognized sessions</li>
          <li>Update your password immediately if you notice any suspicious activity</li>
        </ul>

        <h2>Account Recovery Options</h2>
        <p>
          Make sure you can regain access if needed:
        </p>
        <ul>
          <li>Keep your email address up to date</li>
          <li>Consider adding a recovery phone number to your profile</li>
          <li>Verify your recovery options periodically</li>
        </ul>

        <h2>Protecting Your Personal Information</h2>
        <p>
          In addition to securing your account, be mindful about how you share personal information:
        </p>
        <ul>
          <li>Only share your specific location when arranging confirmed toy exchanges</li>
          <li>Use the in-app messaging system rather than sharing your personal contact details</li>
          <li>Be selective about what personal information you include in your profile or messages</li>
          <li>Report any requests for excessive personal information</li>
        </ul>

        <h2>Reporting Security Concerns</h2>
        <p>
          If you believe your account security has been compromised:
        </p>
        <ol>
          <li>Change your password immediately</li>
          <li>Review your recent activity for any unauthorized actions</li>
          <li>Contact our support team at security@toyshare.example.com</li>
          <li>Report any suspicious messages or phishing attempts you've received</li>
        </ol>

        <div className="bg-white border border-blue-100 rounded-lg p-6 mt-8">
          <h3 className="text-blue-800 mt-0">Regular Security Checklist</h3>
          <p className="text-gray-700 mb-4">
            We recommend performing these security checks regularly:
          </p>
          <ul className="mb-0">
            <li>Update your password every 6 months</li>
            <li>Verify your email address and recovery options are current</li>
            <li>Review your privacy settings</li>
            <li>Check for any unfamiliar activity on your account</li>
            <li>Ensure your device's operating system and browser are up to date</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 flex justify-between items-center">
        <Link href="/safety-center" className="text-blue-700 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Safety Center
        </Link>
        <Link href="/safety-center/toy-safety" className="text-blue-700 hover:underline flex items-center">
          Next: Toy Safety
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}