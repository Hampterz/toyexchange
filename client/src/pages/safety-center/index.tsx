import React from "react";
import { Link } from "wouter";

export default function SafetyCenter() {
  const safetyTopics = [
    {
      title: "Safe Exchanges",
      description: "Learn best practices for arranging safe toy exchanges",
      icon: "🤝",
      link: "/resources/safety-tips"
    },
    {
      title: "Account Security",
      description: "Tips for keeping your ToyShare account secure",
      icon: "🔒",
      link: "/safety-center/account-security"
    },
    {
      title: "Toy Safety Standards",
      description: "Information about toy safety requirements and regulations",
      icon: "🧸",
      link: "/safety-center/toy-safety"
    },
    {
      title: "Reporting Issues",
      description: "How to report safety concerns or violations",
      icon: "🚨",
      link: "/safety-center/reporting"
    },
    {
      title: "Privacy Protection",
      description: "Understanding how we protect your personal information",
      icon: "🛡️",
      link: "/legal/privacy-policy"
    },
    {
      title: "Community Standards",
      description: "Our guidelines for a respectful community",
      icon: "👥",
      link: "/resources/community-guidelines"
    }
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-blue-700 hover:underline flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Safety Center</h1>
        <p className="text-blue-700 border-b border-blue-100 pb-4">Resources to ensure a safe and positive experience on ToyShare</p>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <div className="bg-blue-700 rounded-full p-3 text-white mb-4 md:mb-0 md:mr-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-blue-900 mb-2">Your Safety is Our Priority</h2>
            <p className="text-blue-800">
              At ToyShare, we're committed to creating a safe platform for families to share toys. Our Safety Center provides resources 
              and guidance to help you navigate our platform with confidence and peace of mind.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {safetyTopics.map((topic, index) => (
          <Link key={index} href={topic.link}>
            <div className="border border-blue-100 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
              <div className="text-4xl mb-4">{topic.icon}</div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">{topic.title}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{topic.description}</p>
              <div className="text-blue-700 font-medium flex items-center mt-auto">
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-blue-100 rounded-lg p-6 mb-12">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Emergency Resources</h2>
        <p className="text-gray-700 mb-6">
          In case of an emergency that requires immediate attention:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-semibold text-gray-800">Emergency Services</h3>
            <p className="text-gray-600">Call 911 (US) or your local emergency number</p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold text-gray-800">Report Urgent Platform Issues</h3>
            <p className="text-gray-600">Email: urgent@toyshare.example.com</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-800">Child Safety Concerns</h3>
            <p className="text-gray-600">National Child Abuse Hotline: 1-800-4-A-CHILD</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold text-gray-800">Product Safety Recalls</h3>
            <p className="text-gray-600">CPSC: <a href="https://www.cpsc.gov/Recalls" className="text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">www.cpsc.gov/Recalls</a></p>
          </div>
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-2xl font-semibold text-blue-900 mb-6">Still Have Questions?</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/resources/faq" className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Visit our FAQ
          </Link>
          <Link href="/resources/contact-support" className="inline-flex items-center px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}