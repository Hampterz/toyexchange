import { Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function Testimonials() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute top-6 left-6 text-blue-100">
        <Quote className="h-20 w-20 -rotate-180" />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-blue-800 mb-6">What Families Say</h3>
        
        <div className="min-h-[180px] flex flex-col items-center justify-center text-center">
          <p className="text-blue-700 mb-6">
            Real testimonials from our community members will appear here after successful toy exchanges. 
          </p>
          
          <p className="text-blue-600 mb-6">
            Join our community, share toys, and help us build a sustainable future together!
          </p>
          
          <div className="mt-2">
            <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/auth">
                Join Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}