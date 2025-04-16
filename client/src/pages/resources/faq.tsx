import React, { useState } from "react";
import { Link } from "wouter";

export default function FAQ() {
  // State to track which FAQ categories are expanded
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Toggle the expanded state of a category
  const toggleCategory = (category: string) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter(c => c !== category));
    } else {
      setExpandedCategories([...expandedCategories, category]);
    }
  };

  // Check if a category is expanded
  const isExpanded = (category: string) => expandedCategories.includes(category);

  // FAQ data organized by categories
  const faqData = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create an account on ToyShare?",
          answer: 
            <p>
              Creating an account is easy! Click on the "Sign Up" button in the top right corner of the website or app. 
              You'll need to provide your name, email address, create a password, and indicate your general location. 
              After verifying your email address, you can set up your profile and start exploring toys in your area.
            </p>
        },
        {
          question: "Is ToyShare completely free to use?",
          answer: 
            <p>
              Yes, ToyShare is completely free to use. There are no subscription fees, listing fees, or transaction charges. 
              We believe in fostering a community of sharing without financial barriers. The only "cost" is your participation 
              in the community by sharing toys your children have outgrown.
            </p>
        },
        {
          question: "What types of toys can be shared on the platform?",
          answer: 
            <p>
              Most gently-used children's toys can be shared on ToyShare, including board games, building blocks, dolls, 
              action figures, puzzles, educational toys, outdoor toys, and more. However, we do not allow:
              <ul className="list-disc pl-5 mt-2">
                <li>Recalled toys or toys with safety hazards</li>
                <li>Heavily damaged or incomplete toys</li>
                <li>Inappropriate or adult-oriented items</li>
                <li>Items that are not toys (clothing, furniture, etc.)</li>
                <li>Electronic devices that aren't specifically children's toys</li>
              </ul>
              Please see our <Link href="/resources/community-guidelines" className="text-blue-700 hover:underline">Community Guidelines</Link> for more details.
            </p>
        },
        {
          question: "How do I find toys near me?",
          answer: 
            <p>
              Once you're logged in, the home page will automatically show toys available in your area. You can:
              <ul className="list-disc pl-5 mt-2">
                <li>Use the search bar to look for specific toys</li>
                <li>Apply filters to narrow results by age range, category, condition, etc.</li>
                <li>Adjust your location settings to expand or narrow your search radius</li>
                <li>Browse featured toys or recent listings</li>
              </ul>
              The map view also allows you to see the general location of available toys.
            </p>
        }
      ]
    },
    {
      category: "Sharing Toys",
      questions: [
        {
          question: "How do I list a toy for sharing?",
          answer: 
            <p>
              To list a toy for sharing:
              <ol className="list-decimal pl-5 mt-2">
                <li>Click the "Add Toy" button on the homepage or in your profile</li>
                <li>Upload clear photos of the toy from multiple angles</li>
                <li>Provide a descriptive title and detailed description</li>
                <li>Select the appropriate age range, category, and condition</li>
                <li>Indicate any missing pieces or minor defects</li>
                <li>Review and publish your listing</li>
              </ol>
              The more detailed your listing, the more likely you'll find a match!
            </p>
        },
        {
          question: "What should I include in my toy listing?",
          answer: 
            <p>
              A good toy listing should include:
              <ul className="list-disc pl-5 mt-2">
                <li>Clear, well-lit photos showing the toy from multiple angles</li>
                <li>The toy's name, brand, and model (if applicable)</li>
                <li>Age recommendation</li>
                <li>Complete details about the toy's condition</li>
                <li>Any missing pieces or minor damage</li>
                <li>Whether the original packaging or instructions are included</li>
                <li>Battery requirements (if applicable)</li>
                <li>Dimensions or size information for larger toys</li>
                <li>Any safety certifications or notable features</li>
              </ul>
            </p>
        },
        {
          question: "How should I prepare toys before sharing them?",
          answer: 
            <p>
              Before sharing a toy, please:
              <ul className="list-disc pl-5 mt-2">
                <li>Clean and sanitize all parts thoroughly</li>
                <li>Check for any safety hazards (sharp edges, loose parts, etc.)</li>
                <li>Verify that the toy hasn't been recalled</li>
                <li>Ensure all parts and pieces are accounted for</li>
                <li>Remove batteries if they won't be used for a while</li>
                <li>Include any instructions or assembly guides if you have them</li>
              </ul>
              For detailed cleaning guidance, see our <Link href="/safety-center/toy-safety" className="text-blue-700 hover:underline">Toy Safety</Link> page.
            </p>
        },
        {
          question: "Can I delete my toy listing?",
          answer: 
            <p>
              Yes, you can remove your toy listing at any time by:
              <ol className="list-decimal pl-5 mt-2">
                <li>Going to your profile page</li>
                <li>Selecting the "My Toys" tab</li>
                <li>Finding the toy you want to remove</li>
                <li>Clicking on the three dots (•••) menu and selecting "Delete Listing"</li>
              </ol>
              If your toy has pending requests, you'll be asked to confirm the deletion and given the option to message requesters explaining the cancellation.
            </p>
        }
      ]
    },
    {
      category: "Requesting Toys",
      questions: [
        {
          question: "How do I request a toy from another user?",
          answer: 
            <p>
              To request a toy:
              <ol className="list-decimal pl-5 mt-2">
                <li>Find a toy you're interested in</li>
                <li>Click the "Request Toy" button on the listing</li>
                <li>Write a brief message introducing yourself and explaining your interest</li>
                <li>Submit your request</li>
              </ol>
              The toy owner will receive a notification and can then respond to your request.
            </p>
        },
        {
          question: "What happens after I send a toy request?",
          answer: 
            <p>
              After sending a request:
              <ul className="list-disc pl-5 mt-2">
                <li>The owner receives a notification about your request</li>
                <li>They can view your profile and message you</li>
                <li>If interested, they'll accept your request and you can arrange meetup details via the messaging system</li>
                <li>If they decline, you'll be notified and can look for similar toys</li>
                <li>Once arranged, you'll meet in person to exchange the toy following our safety guidelines</li>
              </ul>
              You can check the status of your requests in the "My Requests" section of your profile.
            </p>
        },
        {
          question: "Can I request multiple toys at once?",
          answer: 
            <p>
              Yes, you can request as many toys as you're genuinely interested in. However, we encourage responsible requesting:
              <ul className="list-disc pl-5 mt-2">
                <li>Only request toys you truly want and can pick up</li>
                <li>Be responsive to messages from toy owners</li>
                <li>If your plans change, cancel requests you can no longer fulfill</li>
                <li>Consider the time and effort of other community members</li>
              </ul>
              Repeatedly requesting toys and not following through may affect your community standing.
            </p>
        },
        {
          question: "What if the toy isn't as described when I receive it?",
          answer: 
            <p>
              If a toy doesn't match its description:
              <ol className="list-decimal pl-5 mt-2">
                <li>Politely discuss the discrepancy with the owner at the time of exchange</li>
                <li>You can decline to accept the toy if it has undisclosed damage or issues</li>
                <li>If you've already accepted it, contact the owner through the messaging system</li>
                <li>If necessary, report significant misrepresentations through the "Report" button on the listing</li>
              </ol>
              Our community is built on trust and honesty, so we take misrepresentations seriously.
            </p>
        }
      ]
    },
    {
      category: "Safe Exchange Practices",
      questions: [
        {
          question: "Where should I meet to exchange toys?",
          answer: 
            <p>
              We recommend meeting in safe, public locations such as:
              <ul className="list-disc pl-5 mt-2">
                <li>Coffee shops or cafes</li>
                <li>Public libraries</li>
                <li>Community centers</li>
                <li>Shopping mall common areas</li>
                <li>Public parks with plenty of people around</li>
                <li>Police station lobbies or parking lots (many offer "safe exchange zones")</li>
              </ul>
              Always meet during daylight hours when possible and in busy areas. See our <Link href="/resources/safety-tips" className="text-blue-700 hover:underline">Safety Tips</Link> for more detailed guidance.
            </p>
        },
        {
          question: "Should I bring someone with me to an exchange?",
          answer: 
            <p>
              Yes, whenever possible, it's a good idea to:
              <ul className="list-disc pl-5 mt-2">
                <li>Bring a friend or family member with you to exchanges</li>
                <li>If going alone, let someone know where you're going, who you're meeting, and when you expect to return</li>
                <li>Consider sharing your live location with a trusted person during the exchange</li>
                <li>Trust your instincts—if something doesn't feel right, postpone or cancel the exchange</li>
              </ul>
              Safety should always be your top priority.
            </p>
        },
        {
          question: "How do I report a safety concern or inappropriate behavior?",
          answer: 
            <p>
              To report a concern:
              <ol className="list-decimal pl-5 mt-2">
                <li>On a user's profile or toy listing, click the three dots (•••) menu and select "Report"</li>
                <li>In a message thread, tap and hold on the message and select "Report"</li>
                <li>Choose the appropriate reason for your report</li>
                <li>Provide details about the issue</li>
                <li>Submit your report for review by our safety team</li>
              </ol>
              For urgent safety concerns, contact your local authorities first, then report to ToyShare at safety@toyshare.example.com.
            </p>
        },
        {
          question: "Will other users see my exact location?",
          answer: 
            <p>
              No, your exact location is never shared automatically. Here's how location works on ToyShare:
              <ul className="list-disc pl-5 mt-2">
                <li>Your general neighborhood or city is shown on your profile</li>
                <li>Toy listings show an approximate area, not exact addresses</li>
                <li>The map view shows general locations, not precise addresses</li>
                <li>Your exact address remains private unless you choose to share it directly with another user through messaging</li>
              </ul>
              You control what location information you share with others.
            </p>
        }
      ]
    },
    {
      category: "Account Management",
      questions: [
        {
          question: "How do I update my profile information?",
          answer: 
            <p>
              To update your profile:
              <ol className="list-decimal pl-5 mt-2">
                <li>Click on your profile picture in the top right corner</li>
                <li>Select "Profile Settings" from the dropdown menu</li>
                <li>Click "Edit Profile"</li>
                <li>Update your information (name, photo, bio, location, etc.)</li>
                <li>Click "Save Changes"</li>
              </ol>
              You can update most profile information at any time, except for your username which can only be changed once every 30 days.
            </p>
        },
        {
          question: "Can I change my email address or password?",
          answer: 
            <p>
              Yes, to change your email or password:
              <ol className="list-decimal pl-5 mt-2">
                <li>Click on your profile picture in the top right corner</li>
                <li>Select "Account Settings" from the dropdown menu</li>
                <li>For email: Click "Change Email," enter your new email, and follow the verification steps</li>
                <li>For password: Click "Change Password," enter your current password and your new password</li>
                <li>Click "Save Changes"</li>
              </ol>
              For security reasons, you'll receive notifications at both your old and new email addresses when making these changes.
            </p>
        },
        {
          question: "How do I delete my account?",
          answer: 
            <p>
              To delete your account:
              <ol className="list-decimal pl-5 mt-2">
                <li>Click on your profile picture in the top right corner</li>
                <li>Select "Account Settings" from the dropdown menu</li>
                <li>Scroll to the bottom and click "Delete Account"</li>
                <li>Read the information about account deletion</li>
                <li>Enter your password to confirm</li>
                <li>Click "Permanently Delete My Account"</li>
              </ol>
              Please note: Account deletion is permanent and cannot be undone. Your active toy listings will be removed, and your profile information will be deleted, though messages sent to other users will remain in their inboxes.
            </p>
        },
        {
          question: "What happens to my data when I delete my account?",
          answer: 
            <p>
              When you delete your account:
              <ul className="list-disc pl-5 mt-2">
                <li>Your profile information (name, photo, bio) is permanently removed</li>
                <li>Your toy listings are taken down</li>
                <li>Your email address and personal details are deleted from our system</li>
                <li>Your messages are anonymized but remain visible to recipients</li>
                <li>Your reviews are anonymized but remain on toys/profiles you reviewed</li>
                <li>Some anonymized data may be retained for analytical purposes</li>
              </ul>
              For more details, please refer to our <Link href="/legal/privacy-policy" className="text-blue-700 hover:underline">Privacy Policy</Link>.
            </p>
        }
      ]
    },
    {
      category: "Technical Issues",
      questions: [
        {
          question: "The app isn't working properly. What should I do?",
          answer: 
            <p>
              If you're experiencing technical issues:
              <ol className="list-decimal pl-5 mt-2">
                <li>Make sure your app is updated to the latest version</li>
                <li>Close the app completely and restart it</li>
                <li>Check your internet connection</li>
                <li>Clear your browser cache or app cache</li>
                <li>Try using a different browser or device</li>
                <li>If problems persist, report the issue through the "Help & Support" section in your account settings</li>
              </ol>
              Please include details about the issue, your device, operating system, and steps to reproduce the problem.
            </p>
        },
        {
          question: "I can't upload photos of my toys. What's wrong?",
          answer: 
            <p>
              If you're having trouble uploading photos:
              <ul className="list-disc pl-5 mt-2">
                <li>Check that the file size isn't too large (maximum 10MB per photo)</li>
                <li>Ensure the format is supported (JPG, PNG, or HEIC)</li>
                <li>Verify your internet connection is stable</li>
                <li>Try reducing the photo resolution</li>
                <li>Check that you're allowing the app to access your photos</li>
                <li>Try uploading one photo at a time</li>
              </ul>
              If problems persist, try taking new photos directly within the app instead of uploading from your gallery.
            </p>
        },
        {
          question: "I'm not receiving notifications. How can I fix this?",
          answer: 
            <p>
              To troubleshoot notification issues:
              <ol className="list-decimal pl-5 mt-2">
                <li>Check your notification settings within the app (Profile {String.fromCharCode(62)} Settings {String.fromCharCode(62)} Notifications)</li>
                <li>Verify that you haven't muted ToyShare notifications on your device</li>
                <li>Ensure the app has permission to send notifications in your device settings</li>
                <li>Check that your email address is correct in your account settings</li>
                <li>Check your email spam/junk folder for email notifications</li>
                <li>Try logging out and back in to refresh your session</li>
              </ol>
            </p>
        },
        {
          question: "How do I report a bug or suggest a new feature?",
          answer: 
            <p>
              We welcome your feedback! To report bugs or suggest features:
              <ol className="list-decimal pl-5 mt-2">
                <li>Go to your profile and select "Help & Support"</li>
                <li>Choose "Report a Problem" for bugs or "Suggest a Feature" for ideas</li>
                <li>Provide as much detail as possible about the issue or suggestion</li>
                <li>Include screenshots if relevant</li>
                <li>Submit your report</li>
              </ol>
              Alternatively, you can email support@toyshare.example.com with your feedback. We review all submissions and use them to improve ToyShare.
            </p>
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-blue-700 hover:underline flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Frequently Asked Questions</h1>
        <p className="text-blue-700 border-b border-blue-100 pb-4">Find answers to common questions about using ToyShare</p>
      </div>

      <div className="mb-8">
        <p className="text-gray-700">
          Browse through our FAQ categories below or visit the <Link href="/help-center" className="text-blue-700 hover:underline">Help Center</Link> for more support. Can't find what you're looking for? <Link href="/resources/contact-support" className="text-blue-700 hover:underline">Contact our support team</Link> for assistance.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">Contents</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {faqData.map((category, index) => (
            <li key={index}>
              <a 
                href={`#${category.category.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-blue-700 hover:underline flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {category.category}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* FAQ Categories and Questions */}
      <div className="space-y-8">
        {faqData.map((category, categoryIndex) => (
          <div 
            key={categoryIndex} 
            id={category.category.toLowerCase().replace(/\s+/g, '-')}
            className="border border-blue-100 rounded-lg overflow-hidden"
          >
            <button
              className="w-full text-left bg-blue-50 p-4 flex justify-between items-center"
              onClick={() => toggleCategory(category.category)}
            >
              <h2 className="text-xl font-semibold text-blue-900">{category.category}</h2>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 text-blue-700 transition-transform ${isExpanded(category.category) ? 'transform rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isExpanded(category.category) && (
              <div className="p-4">
                <div className="space-y-6">
                  {category.questions.map((faq, faqIndex) => (
                    <div key={faqIndex} className="border-b border-blue-50 last:border-b-0 pb-6 last:pb-0">
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">{faq.question}</h3>
                      <div className="text-gray-700">{faq.answer}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-blue-900 mb-3">Still Have Questions?</h2>
        <p className="text-blue-700 mb-6">
          Our support team is here to help with any questions or concerns you may have.
        </p>
        <Link
          href="/resources/contact-support"
          className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}