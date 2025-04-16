import React, { useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");

  // Common help categories
  const helpCategories = [
    {
      title: "Getting Started",
      icon: "🚀",
      links: [
        { title: "Creating an Account", href: "/help-center/create-account" },
        { title: "Setting Up Your Profile", href: "/help-center/setup-profile" },
        { title: "Finding Toys Near You", href: "/help-center/find-toys" },
        { title: "Toy Exchange Process", href: "/help-center/exchange-process" }
      ]
    },
    {
      title: "Sharing Toys",
      icon: "🧸",
      links: [
        { title: "Creating a Toy Listing", href: "/help-center/create-listing" },
        { title: "Taking Good Photos", href: "/help-center/toy-photos" },
        { title: "Setting Age Ranges", href: "/help-center/age-ranges" },
        { title: "Managing Your Toy Inventory", href: "/help-center/manage-inventory" }
      ]
    },
    {
      title: "Account Management",
      icon: "👤",
      links: [
        { title: "Update Your Information", href: "/help-center/update-info" },
        { title: "Password Recovery", href: "/help-center/password-recovery" },
        { title: "Notification Settings", href: "/help-center/notifications" },
        { title: "Deleting Your Account", href: "/help-center/delete-account" }
      ]
    },
    {
      title: "Safety & Security",
      icon: "🔒",
      links: [
        { title: "Safe Exchange Tips", href: "/resources/safety-tips" },
        { title: "Privacy Settings", href: "/help-center/privacy-settings" },
        { title: "Reporting Issues", href: "/safety-center/reporting" },
        { title: "Toy Safety Standards", href: "/safety-center/toy-safety" }
      ]
    },
    {
      title: "Communication",
      icon: "💬",
      links: [
        { title: "Messaging Other Users", href: "/help-center/messaging" },
        { title: "Message Notifications", href: "/help-center/message-notifications" },
        { title: "Communication Guidelines", href: "/resources/community-guidelines" },
        { title: "Blocking Users", href: "/help-center/blocking" }
      ]
    },
    {
      title: "Troubleshooting",
      icon: "🔧",
      links: [
        { title: "App Not Working", href: "/help-center/app-issues" },
        { title: "Missing Toys or Messages", href: "/help-center/missing-content" },
        { title: "Payment Problems", href: "/help-center/payment-issues" },
        { title: "Login Issues", href: "/help-center/login-help" }
      ]
    }
  ];

  // Frequently asked questions
  const faqs = [
    {
      question: "How do I share a toy?",
      answer: "To share a toy, log in to your account, click the 'Add Toy' button, fill out the form with details and photos, and submit your listing.",
      href: "/help-center/create-listing"
    },
    {
      question: "How do I arrange a toy exchange?",
      answer: "When you find a toy you want, click 'Request' and message the owner to arrange a meetup time and location that works for both of you.",
      href: "/help-center/exchange-process"
    },
    {
      question: "Is ToyShare free to use?",
      answer: "Yes, ToyShare is completely free. We don't charge any fees for listing, requesting, or exchanging toys.",
      href: "/resources/faq"
    },
    {
      question: "How do I update my location?",
      answer: "Go to your profile settings, click on 'Edit Profile', update your location information, and save your changes.",
      href: "/help-center/update-info"
    }
  ];

  // Filter categories based on search query
  const filteredCategories = searchQuery
    ? helpCategories.map(category => ({
        ...category,
        links: category.links.filter(link => 
          link.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.links.length > 0)
    : helpCategories;

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery
    ? faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-blue-700 hover:underline flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Help Center</h1>
        <p className="text-blue-700 border-b border-blue-100 pb-4">Find answers and learn how to get the most out of ToyShare</p>
      </div>

      {/* Search */}
      <div className="mb-10">
        <div className="relative max-w-2xl mx-auto">
          <Input
            type="text"
            placeholder="Search for help topics..."
            className="pl-10 py-6 text-lg border-blue-200 focus-visible:ring-blue-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery("")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {searchQuery && filteredCategories.length === 0 && filteredFaqs.length === 0 && (
        <div className="text-center py-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-blue-200 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No results found</h2>
          <p className="text-gray-500 mb-6">We couldn't find any help topics matching "{searchQuery}"</p>
          <Button
            onClick={() => setSearchQuery("")}
            className="bg-blue-700 hover:bg-blue-800"
          >
            Clear Search
          </Button>
        </div>
      )}

      {/* Help Categories */}
      {filteredCategories.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-blue-900 mb-6">Help Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category, index) => (
              <div key={index} className="border border-blue-100 rounded-lg overflow-hidden">
                <div className="bg-blue-50 p-4 flex items-center">
                  <span className="text-2xl mr-3">{category.icon}</span>
                  <h3 className="text-xl font-semibold text-blue-800">{category.title}</h3>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    {category.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href={link.href}
                          className="text-blue-700 hover:underline hover:text-blue-900 flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Frequently Asked Questions */}
      {filteredFaqs.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-blue-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="border border-blue-100 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">{faq.question}</h3>
                <p className="text-gray-700 mb-3">{faq.answer}</p>
                <Link href={faq.href} className="text-blue-700 hover:underline text-sm flex items-center">
                  Learn more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link href="/resources/faq" className="text-blue-700 hover:underline font-medium">
              View all FAQs
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1 inline"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* Help Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-blue-700 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Contact Support</h3>
          <p className="text-blue-700 mb-4">Need personal assistance? Our support team is here to help.</p>
          <Link
            href="/resources/contact-support"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm transition-colors"
          >
            Contact Us
          </Link>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-blue-700 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Community Guidelines</h3>
          <p className="text-blue-700 mb-4">Learn about our community values and expected behaviors.</p>
          <Link
            href="/resources/community-guidelines"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm transition-colors"
          >
            View Guidelines
          </Link>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-blue-700 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Safety Center</h3>
          <p className="text-blue-700 mb-4">Find resources for staying safe while using ToyShare.</p>
          <Link
            href="/safety-center"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm transition-colors"
          >
            Visit Safety Center
          </Link>
        </div>
      </div>
    </div>
  );
}