import { useState, useEffect } from "react";
import { Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Testimonial {
  name: string;
  role: string;
  avatar?: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Emily Johnson",
    role: "Parent of 2",
    text: "ToyShare has been incredible for our family! We've saved money and storage space while giving our kids new toys to enjoy. The community is so supportive and we've even made new friends through exchanges."
  },
  {
    name: "Michael Chen",
    role: "Parent of 3",
    text: "As a father of three, I know how quickly kids grow out of toys. Instead of letting them gather dust, we share them with other families. It's teaching my children the value of sharing and sustainability."
  },
  {
    name: "Guest",
    role: "Joining soon",
    text: "I'm so excited to start sharing toys! I've been following this platform for a while and love the concept. Can't wait to participate in building a more sustainable future for our kids."
  },
  {
    name: "Sofia Rodriguez",
    role: "Parent of 1",
    text: "My daughter gets to experience new toys without the clutter or waste. The platform is incredibly easy to use, and I love knowing that we're helping other families while reducing waste."
  }
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

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
                  {testimonials[activeIndex].name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-blue-800">{testimonials[activeIndex].name}</p>
                <p className="text-sm text-blue-600">{testimonials[activeIndex].role}</p>
              </div>
            </div>
            
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
          </div>
        </div>
      </div>
    </div>
  );
}