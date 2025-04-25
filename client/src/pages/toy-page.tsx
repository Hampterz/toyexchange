import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { ToyCard } from "@/components/toys/toy-card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function ToyPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
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
  
  const handleRequestClick = () => {
    toast({
      title: "Action pending",
      description: "We've captured your interest in this toy. Please use the request button in the detail view.",
      variant: "default",
    });
  };
  
  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-10 w-1/6" />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }
  
  if (!toy) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Toy Not Found</h1>
          <p className="text-neutral-600 mb-6">The toy you're looking for doesn't exist or has been removed.</p>
          <Button
            onClick={() => setLocation("/")}
            className="bg-primary hover:bg-primary/90"
          >
            Back to Toy Listings
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Toy Details</h1>
        <Button
          variant="outline"
          onClick={() => setLocation("/")}
        >
          Back to Toys
        </Button>
      </div>
      <div className="max-w-md mx-auto">
        <ToyCard toy={toy} onRequestClick={handleRequestClick} />
      </div>
    </div>
  );
}