import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { ToyCard } from "@/components/toys/toy-card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedLoading } from "@/components/ui/animated-loading";
import { ToyRequestButton } from "@/components/toys/toy-request-button";
import { ConfettiCelebration } from "@/components/ui/confetti-celebration";
import { useAuth } from "@/hooks/use-auth";

export default function ToyPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showConfetti, setShowConfetti] = useState(false);
  
  const { data: toy, isLoading, error } = useQuery({
    queryKey: [`/api/toys/${id}`],
    queryFn: async () => {
      const res = await fetch(`/api/toys/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Toy not found");
        }
        throw new Error("Failed to fetch toy");
      }
      return await res.json();
    },
  });
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  // Simulate confetti celebration when toy details are loaded
  useEffect(() => {
    if (toy && !isLoading) {
      // Show confetti after a delay
      const timer = setTimeout(() => {
        setShowConfetti(true);
      }, 700);
      
      return () => clearTimeout(timer);
    }
  }, [toy, isLoading]);
  
  const handleRequestClick = () => {
    toast({
      title: "Action pending",
      description: "We've captured your interest in this toy. Please use the request button in the detail view.",
      variant: "default",
    });
  };
  
  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8 page-transition">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Loading Toy Details</h1>
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
            className="hover-lift"
          >
            Back to Toys
          </Button>
        </div>
        
        <div className="flex flex-col items-center justify-center p-12">
          <AnimatedLoading type="toys" size="lg" text="Loading toy details..." />
        </div>
      </div>
    );
  }
  
  if (!toy) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-20 page-transition">
        <div className="text-center">
          <div className="bg-blue-50 p-8 rounded-xl mb-6 max-w-md mx-auto">
            <div className="text-blue-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4 text-blue-700">Toy Not Found</h1>
            <p className="text-blue-600 mb-6">The toy you're looking for doesn't exist or has been passed on to a happy child!</p>
            <Button
              onClick={() => setLocation("/")}
              className="bg-blue-600 hover:bg-blue-700 btn-animated"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Toy Listings
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 page-transition">
      <ConfettiCelebration trigger={showConfetti} count={50} duration={3000} />
      
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Toy Details</h1>
        <Button
          variant="outline"
          onClick={() => setLocation("/")}
          className="hover-lift"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Toys
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Toy Card with Image */}
        <div className="w-full">
          <Card className="border-blue-100 overflow-hidden card-animated">
            <div className="relative pb-[75%] overflow-hidden bg-blue-50">
              <img 
                src={toy.imageUrl || "https://via.placeholder.com/400x300?text=No+Image"} 
                alt={toy.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {toy.age && (
                <Badge className="absolute top-3 left-3 bg-blue-500 hover:bg-blue-600 badge-animated">
                  Ages {toy.age}
                </Badge>
              )}
              {toy.condition && (
                <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600 badge-animated">
                  {toy.condition}
                </Badge>
              )}
            </div>
            
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2 text-blue-800">{toy.name}</h2>
              
              <div className="flex items-center text-sm text-blue-600 mb-4">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{toy.location || "Unknown location"}</span>
              </div>
              
              {toy.tags && toy.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {toy.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 badge-animated">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="mb-4">
                <p className="text-gray-700">{toy.description}</p>
              </div>
              
              <div className="pt-4 border-t border-blue-100">
                <ToyRequestButton 
                  toyId={toy.id} 
                  toyName={toy.name}
                  toyOwner={toy.owner?.name || "Unknown"}
                  ownerId={toy.owner?.id || 0}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Owner Info and Additional Details */}
        <div className="space-y-6">
          {/* Owner Card */}
          <Card className="border-blue-100 card-animated">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-800">About the Owner</h3>
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800">{toy.owner?.name || "Anonymous"}</h4>
                  <p className="text-sm text-blue-600">Member since {toy.owner?.joinDate || "2023"}</p>
                </div>
              </div>
              
              <div className="border-t border-blue-100 pt-4">
                <h4 className="font-semibold mb-2 text-blue-800">Sustainability Badge</h4>
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">{toy.owner?.name || "This user"}</span> has shared {toy.owner?.toysShared || "5+"} toys, helping reduce waste and bringing joy to other families.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Safety Tips Card */}
          <Card className="border-blue-100 card-animated">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-800">Safety Tips</h3>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded-full mr-2 mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className="text-sm text-blue-700">Meet in a public place for toy exchanges</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded-full mr-2 mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-sm text-blue-700">Check toys for any damage or safety hazards</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded-full mr-2 mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <span className="text-sm text-blue-700">Communicate clearly about pickup arrangements</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}