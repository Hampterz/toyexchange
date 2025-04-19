import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { ToyRequest, Toy, User } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ReviewCardProps {
  review: ToyRequest;
}

export function ReviewCard({ review }: ReviewCardProps) {
  // Fetch the toy details
  const { data: toy } = useQuery<Toy, Error>({
    queryKey: [`/api/toys/${review.toyId}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!review.toyId
  });
  
  // Fetch the requester's details (the person who wrote the review)
  const { data: requester } = useQuery<Omit<User, "password">, Error>({
    queryKey: [`/api/users/${review.requesterId}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!review.requesterId
  });
  
  // Check if this is a positive or negative review based on the request message
  // In a real app, you would have a dedicated review schema with rating
  const isPositive = !review.message.toLowerCase().includes("issue") && 
                     !review.message.toLowerCase().includes("problem") &&
                     !review.message.toLowerCase().includes("disappoint");

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={requester?.profilePicture || undefined} alt={requester?.name} />
              <AvatarFallback>
                {requester?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <Link href={`/users/${requester?.id}`} className="font-semibold hover:underline">
                  {requester?.name || "Anonymous"}
                </Link>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {review.status === "approved" ? "Traded" : review.status}
                  </Badge>
                  
                  {isPositive ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <ThumbsUp className="h-3 w-3 mr-1" /> Positive
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                      <ThumbsDown className="h-3 w-3 mr-1" /> Negative
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="text-xs text-neutral-500">
                {review.createdAt 
                  ? new Date(review.createdAt).toLocaleDateString() 
                  : 'Unknown date'}
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-neutral-700">{review.message}</p>
            </div>
            
            {toy && (
              <div className="mt-3 bg-neutral-50 p-2 rounded-md flex items-center gap-2">
                <span className="text-xs text-neutral-500">Regarding:</span>
                <Link href={`/toys/${toy.id}`} className="text-sm text-blue-600 hover:underline">
                  {toy.title}
                </Link>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}