import { useState, useEffect } from "react";
import { Quote, MessageSquareHeart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar?: string;
  text: string;
  rating: number;
  createdAt: Date;
}

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Query for real user testimonials
  const { data: testimonials, isLoading, error } = useQuery({
    queryKey: ["/api/testimonials"],
    queryFn: undefined,
    enabled: true,
  });
  
  useEffect(() => {
    // Only set up the interval if we have testimonials
    if (testimonials && testimonials.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((current) => (current + 1) % testimonials.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [testimonials]);
  
  // If there are no testimonials yet, show a placeholder
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 min-h-[200px] flex flex-col items-center justify-center text-center">
          <MessageSquareHeart className="h-16 w-16 text-blue-100 mb-4" />
          <h3 className="text-2xl font-bold text-blue-800 mb-3">Community Testimonials</h3>
          <p className="text-blue-600 mb-4">
            Real user testimonials will appear here as families start using and sharing their experiences with ToyShare.
          </p>
          <p className="text-sm text-blue-500">
            After successful toy exchanges, users will be invited to share their feedback.
          </p>
        </div>
      </div>
    );
  }
  
  // If we have testimonials, show them with the slider
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute top-6 left-6 text-blue-100">
        <Quote className="h-20 w-20 -rotate-180" />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-blue-800 mb-6">What Families Say</h3>
        
        <div className="min-h-[200px] flex flex-col justify-between">
          <div>
            <p className="text-blue-700 italic mb-6 relative z-10">
              "{testimonials[activeIndex].text}"
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4 border-2 border-blue-200">
                <AvatarImage src={testimonials[activeIndex].avatar} />
                <AvatarFallback className="bg-blue-100 text-blue-800">
                  {testimonials[activeIndex].name?.split(' ').map(n => n[0]).join('') || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-blue-800">{testimonials[activeIndex].name}</p>
                <p className="text-sm text-blue-600">{testimonials[activeIndex].role || 'ToyShare Member'}</p>
              </div>
            </div>
            
            {testimonials.length > 1 && (
              <div className="flex space-x-1">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      index === activeIndex 
                        ? "bg-blue-700 w-6" 
                        : "bg-blue-200 hover:bg-blue-300"
                    )}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}