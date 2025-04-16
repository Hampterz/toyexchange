import React from "react";
import { Link } from "wouter";

export default function ToySafety() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Link href="/safety-center" className="text-blue-700 hover:underline flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Safety Center
        </Link>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Toy Safety Standards</h1>
        <p className="text-blue-700 border-b border-blue-100 pb-4">Guidelines for ensuring toys are safe for children</p>
      </div>

      <div className="prose prose-blue max-w-none">
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-blue-900 mt-0">Toy Safety is Everyone's Responsibility</h2>
          <p className="mb-0">
            As a community of parents and caregivers, we all share the responsibility of ensuring 
            the toys we exchange are safe for children. This guide outlines important safety considerations 
            before sharing or receiving toys on ToyShare.
          </p>
        </div>

        <h2>Before Sharing a Toy</h2>
        <p>
          Before listing a toy on ToyShare, please take these important steps:
        </p>

        <h3>1. Check for Recalls</h3>
        <p>
          Verify that the toy hasn't been recalled by checking the Consumer Product Safety Commission 
          (CPSC) website. Recalled toys should not be shared under any circumstances.
        </p>
        <div className="not-prose">
          <a 
            href="https://www.cpsc.gov/Recalls" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-4 rounded inline-flex items-center text-sm transition-colors mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Search CPSC Recalls Database
          </a>
        </div>

        <h3>2. Clean and Sanitize</h3>
        <p>
          All toys should be thoroughly cleaned and sanitized before sharing. This helps prevent 
          the spread of germs and ensures the toy is in the best possible condition for the next child.
        </p>
        <ul>
          <li>Wash hard plastic toys with warm soapy water and disinfect if possible</li>
          <li>Clean fabric toys according to their care instructions</li>
          <li>Sanitize electronic toys by wiping with appropriate cleaning solutions (avoid liquid damage)</li>
          <li>Allow toys to completely dry before packaging</li>
        </ul>

        <h3>3. Inspect for Damage and Hazards</h3>
        <p>
          Carefully examine the toy for any potential hazards:
        </p>
        <ul>
          <li>Check for broken parts, sharp edges, or points</li>
          <li>Look for loose or small parts that could be choking hazards</li>
          <li>Test any mechanisms to ensure they work properly</li>
          <li>Verify that battery compartments are secure</li>
          <li>Check for frayed wires or electrical hazards</li>
          <li>Ensure that fabric items aren't ripped with stuffing exposed</li>
        </ul>

        <h3>4. Verify Age-Appropriateness</h3>
        <p>
          Include accurate age recommendations in your listing:
        </p>
        <ul>
          <li>Check the manufacturer's age recommendation</li>
          <li>Be mindful of toys with small parts when intended for younger children</li>
          <li>Consider developmental appropriateness beyond just safety concerns</li>
          <li>If the original packaging is gone, research the toy online to find age guidelines</li>
        </ul>

        <h3>5. Include Safety Information in Your Listing</h3>
        <p>
          Be transparent about the toy's condition and any safety considerations:
        </p>
        <ul>
          <li>Note if any small parts are included</li>
          <li>Mention if batteries are required and whether they're included</li>
          <li>Disclose any minor damage, even if it doesn't affect safety</li>
          <li>List any missing pieces or components</li>
        </ul>

        <h2>Common Toy Safety Concerns by Age</h2>

        <h3>For Infants and Toddlers (0-3 years)</h3>
        <ul>
          <li><strong>Choking Hazards:</strong> No parts smaller than 1.75 inches in diameter</li>
          <li><strong>Strangulation Hazards:</strong> No long cords or strings</li>
          <li><strong>Suffocation Risks:</strong> No plastic bags or materials that could cover a child's face</li>
          <li><strong>Toxic Materials:</strong> Ensure toys are free from lead, phthalates, and other harmful chemicals</li>
        </ul>

        <h3>For Preschoolers (3-5 years)</h3>
        <ul>
          <li><strong>Small Magnets:</strong> Can cause serious internal damage if swallowed</li>
          <li><strong>Button Batteries:</strong> Extremely dangerous if ingested</li>
          <li><strong>Projectiles:</strong> Should have soft tips and limited force</li>
          <li><strong>Ride-on Toys:</strong> Should be stable and appropriate for the child's weight</li>
        </ul>

        <h3>For School-Age Children (6-12 years)</h3>
        <ul>
          <li><strong>Electric Toys:</strong> Should be in good working order with no exposed wires</li>
          <li><strong>Chemistry Sets/Craft Kits:</strong> Should not contain harmful chemicals</li>
          <li><strong>Sports Equipment:</strong> Should include appropriate protective gear</li>
          <li><strong>Building Sets:</strong> Should have pieces intact for structural integrity</li>
        </ul>

        <h2>Safety Standards and Certifications</h2>
        <p>
          Look for these safety indicators on toys you share:
        </p>
        <ul>
          <li><strong>ASTM F963:</strong> The standard consumer safety specification for toys in the US</li>
          <li><strong>CPSC Compliance:</strong> Meets Consumer Product Safety Commission requirements</li>
          <li><strong>CE Marking:</strong> Indicates conformity with health, safety, and environmental standards for products sold in Europe</li>
          <li><strong>Non-Toxic Certification:</strong> Especially important for art materials and toys that might be mouthed</li>
        </ul>

        <h2>When Receiving a Toy</h2>
        <p>
          When you receive a toy from another ToyShare member:
        </p>
        <ul>
          <li>Inspect it thoroughly before giving it to your child</li>
          <li>Clean and sanitize it again, even if the previous owner did so</li>
          <li>Verify its age-appropriateness for your specific child</li>
          <li>Consider any allergies or sensitivities your child may have</li>
          <li>Test all mechanisms and check for any hazards that may have been missed</li>
        </ul>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
          <p className="text-yellow-800 font-medium">
            When in doubt, err on the side of caution. If you have any concerns about a toy's safety, 
            don't share it or allow your child to play with it.
          </p>
        </div>

        <h2>Reporting Safety Concerns</h2>
        <p>
          If you receive a toy that you believe is unsafe or see a listing for a potentially hazardous toy:
        </p>
        <ol>
          <li>Report the concern through the "Report" feature on the listing</li>
          <li>Contact us directly at safety@toyshare.example.com with details</li>
          <li>If you believe the toy poses a serious risk, report it to the CPSC at www.saferproducts.gov</li>
        </ol>

        <div className="bg-white border border-blue-100 rounded-lg p-6 mt-8">
          <h3 className="text-blue-800 mt-0">Quick Toy Safety Checklist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-blue-700">Before Sharing</h4>
              <ul className="mb-0">
                <li>Checked for recalls</li>
                <li>Cleaned and sanitized</li>
                <li>Inspected for damage</li>
                <li>Verified age-appropriateness</li>
                <li>Included safety information in listing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-700">Before Using</h4>
              <ul className="mb-0">
                <li>Inspected thoroughly</li>
                <li>Re-cleaned the toy</li>
                <li>Verified suitability for your child</li>
                <li>Checked for allergens</li>
                <li>Tested all mechanisms</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-between items-center">
        <Link href="/safety-center/account-security" className="text-blue-700 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous: Account Security
        </Link>
        <Link href="/safety-center/reporting" className="text-blue-700 hover:underline flex items-center">
          Next: Reporting Issues
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}