import { useState } from "react";
import { Star, ThumbsUp, Calendar, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToyRequest, User as UserType, Toy as ToyType } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

interface ReviewCardProps {
  review: ToyRequest;
}

export function ReviewCard({ review }: ReviewCardProps) {
  // Fetch user info for the requester
  const { data: requester } = useQuery<Omit<UserType, "password">, Error>({
    queryKey: [`/api/users/${review.requesterId}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!review.requesterId,
  });
  
  // Fetch toy info for context
  const { data: toy } = useQuery<ToyType, Error>({
    queryKey: [`/api/toys/${review.toyId}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!review.toyId,
  });
  
  const reviewDate = review.createdAt 
    ? new Date(review.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) 
    : 'Unknown date';
  
  // Generate stars based on review.rating (safely access with optional chaining)
  const renderStars = () => {
    const rating = review?.rating || 0;
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
              index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-neutral-500" />
                <span className="font-medium">
                  {requester && 'name' in requester ? requester.name : "Anonymous"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                <span className="text-sm text-neutral-500">{reviewDate}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              {renderStars()}
              <Badge variant="outline" className="ml-2">
                {review.status}
              </Badge>
            </div>
            
            {toy && typeof toy === 'object' && 'title' in toy && (
              <div className="text-sm text-neutral-600 mb-2">
                <strong>Toy:</strong> {toy.title}
              </div>
            )}
            
            <p className="text-neutral-700">
              {review.feedback || "No feedback provided."}
            </p>
            
            {review.rating && review.rating >= 4 && (
              <div className="flex items-center gap-1 mt-3 text-green-600 text-sm">
                <ThumbsUp className="h-4 w-4" />
                <span>Recommended this user</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}