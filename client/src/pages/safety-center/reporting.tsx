import React from "react";
import { Link } from "wouter";

export default function Reporting() {
  // Define the different types of reports with their explanations
  const reportTypes = [
    {
      type: "Unsafe Toys",
      examples: [
        "Toys with sharp edges or points",
        "Items with small parts that could be choking hazards",
        "Recalled or banned products",
        "Toys with harmful chemicals or materials"
      ]
    },
    {
      type: "Inappropriate Content",
      examples: [
        "Toy listings with offensive language or images",
        "Inappropriate or misleading descriptions",
        "Content that violates community guidelines",
        "Non-toy items prohibited by our Terms of Service"
      ]
    },
    {
      type: "User Conduct Issues",
      examples: [
        "Harassment or bullying behavior",
        "Threatening or abusive messages",
        "Spam or solicitation",
        "Attempts to move communication off-platform"
      ]
    },
    {
      type: "Safety Concerns",
      examples: [
        "Requests for personal information",
        "Suspicious meeting arrangements",
        "Attempted scams or fraud",
        "Concerns about a user's identity or intentions"
      ]
    },
    {
      type: "Technical Issues",
      examples: [
        "Platform bugs or glitches",
        "Payment processing problems",
        "Account access issues",
        "App crashes or performance problems"
      ]
    }
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Link href="/safety-center" className="text-blue-700 hover:underline flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Safety Center
        </Link>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Reporting Issues</h1>
        <p className="text-blue-700 border-b border-blue-100 pb-4">How to report safety concerns and policy violations</p>
      </div>

      <div className="prose prose-blue max-w-none">
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-blue-900 mt-0">Why Reporting Matters</h2>
          <p className="mb-0">
            Your reports help keep ToyShare safe for everyone. By reporting issues, you're directly contributing 
            to maintaining a trusted community where families can share toys with confidence and peace of mind.
          </p>
        </div>

        <h2>What to Report</h2>
        <p>
          We rely on community members to report content or behavior that may:
        </p>
        <ul>
          <li>Pose a safety risk to children or community members</li>
          <li>Violate our <Link href="/resources/community-guidelines" className="text-blue-700 hover:underline">Community Guidelines</Link></li>
          <li>Breach our <Link href="/legal/terms-of-service" className="text-blue-700 hover:underline">Terms of Service</Link></li>
          <li>Represent a technical issue or bug in our platform</li>
        </ul>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose mb-8">
          {reportTypes.map((item, index) => (
            <div key={index} className="bg-white border border-blue-100 rounded-lg p-5">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">{item.type}</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {item.examples.map((example, i) => (
                  <li key={i} className="mb-1">{example}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2>How to Report Issues</h2>
        
        <h3>1. Report a Toy Listing</h3>
        <ol>
          <li>Navigate to the toy listing page</li>
          <li>Click the "..." (more options) button in the top right corner</li>
          <li>Select "Report Listing" from the dropdown menu</li>
          <li>Choose the reason for your report from the options provided</li>
          <li>Add any additional details that might help our team understand the issue</li>
          <li>Submit your report</li>
        </ol>

        <h3>2. Report a User</h3>
        <ol>
          <li>Go to the user's profile page</li>
          <li>Click the "..." (more options) button near their profile information</li>
          <li>Select "Report User" from the dropdown menu</li>
          <li>Choose the reason for your report</li>
          <li>Provide specific examples of concerning behavior</li>
          <li>Submit your report</li>
        </ol>

        <h3>3. Report a Message</h3>
        <ol>
          <li>Open the conversation containing the message</li>
          <li>Locate the specific message you want to report</li>
          <li>Click and hold the message (mobile) or click the "..." next to it (desktop)</li>
          <li>Select "Report Message" from the options</li>
          <li>Choose the appropriate reason</li>
          <li>Submit your report</li>
        </ol>

        <h3>4. Report Technical Issues</h3>
        <ol>
          <li>Go to the "Help" section in your account settings</li>
          <li>Select "Report a Problem"</li>
          <li>Choose the type of technical issue you're experiencing</li>
          <li>Provide details about the problem, including when it occurred and any error messages</li>
          <li>Include screenshots if possible</li>
          <li>Submit your report</li>
        </ol>

        <div className="bg-blue-50 p-6 rounded-lg my-8">
          <h3 className="text-blue-900 mt-0 mb-3">For Urgent Safety Concerns</h3>
          <p className="mb-0">
            If you believe someone is in immediate danger, contact your local emergency services first, 
            then report the issue to us at <a href="mailto:urgent@toyshare.example.com" className="text-blue-700 font-medium">urgent@toyshare.example.com</a>.
          </p>
        </div>

        <h2>What Happens After You Report</h2>
        <p>
          When you submit a report:
        </p>
        <ol>
          <li><strong>Confirmation:</strong> You'll receive a notification confirming your report was submitted</li>
          <li><strong>Review:</strong> Our safety team will review the report, typically within 24-48 hours</li>
          <li><strong>Investigation:</strong> We'll investigate the issue and gather additional information if needed</li>
          <li><strong>Action:</strong> Appropriate action will be taken based on our findings and policy guidelines</li>
          <li><strong>Follow-up:</strong> You may receive a follow-up notification about the outcome, though specific actions taken against other users are generally kept confidential</li>
        </ol>

        <h2>Possible Actions We May Take</h2>
        <p>
          Depending on the severity and nature of the issue, actions may include:
        </p>
        <ul>
          <li>Removing content that violates our policies</li>
          <li>Issuing warnings to users</li>
          <li>Temporarily suspending accounts</li>
          <li>Permanently banning users from the platform</li>
          <li>Restricting specific features or functions for certain users</li>
          <li>Fixing technical bugs or issues</li>
          <li>In serious cases, reporting to appropriate authorities</li>
        </ul>

        <h2>False Reports</h2>
        <p>
          We take all reports seriously and investigate them thoroughly. Please only submit reports for genuine concerns. 
          Repeatedly submitting false reports may result in limitations being placed on your account.
        </p>

        <h2>Report Confidentiality</h2>
        <p>
          All reports are confidential. The person or content you report will not be notified about who submitted the report. 
          We respect your privacy while working to address legitimate concerns.
        </p>

        <div className="bg-white border border-blue-100 rounded-lg p-6 mt-8">
          <h3 className="text-blue-800 mt-0 mb-3">We Value Your Reports</h3>
          <p className="text-gray-700 mb-0">
            Every report helps make ToyShare safer for all families. Thank you for being an active and 
            responsible member of our community. Together, we can create a positive environment for sharing toys 
            and building connections.
          </p>
        </div>
      </div>

      <div className="mt-12 flex justify-between items-center">
        <Link href="/safety-center/toy-safety" className="text-blue-700 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous: Toy Safety
        </Link>
        <Link href="/safety-center" className="text-blue-700 hover:underline flex items-center">
          Back to Safety Center
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}