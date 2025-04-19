import { useState } from "react";
import { Link } from "wouter";
import { MapPin, ExternalLink } from "lucide-react";
import { Toy } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfileToyCardProps {
  toy: Toy;
}

export function ProfileToyCard({ toy }: ProfileToyCardProps) {
  // Determine if toy is available
  const isAvailable = toy.isAvailable && toy.status === "active";
  
  return (
    <Card className="overflow-hidden h-full transition-all hover:shadow-md">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="relative">
          {!isAvailable && (
            <div className="absolute inset-0 bg-neutral-800/40 flex items-center justify-center z-10">
              <Badge className="bg-neutral-800 text-white">
                {toy.status === "traded" ? "Traded" : "Not Available"}
              </Badge>
            </div>
          )}
          
          <div className="h-48 bg-neutral-100">
            {toy.images && toy.images.length > 0 ? (
              <img 
                src={toy.images[0]} 
                alt={toy.title} 
                className={`w-full h-full object-cover ${!isAvailable ? 'opacity-80' : ''}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                <i className="fas fa-image text-4xl"></i>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 flex flex-col flex-1">
          <div className="mb-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg line-clamp-1">{toy.title}</h3>
            </div>
            
            <div className="flex items-center text-sm text-neutral-600 mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate">{toy.location}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 my-2">
            <Badge variant="outline" className="text-xs">{toy.category}</Badge>
            <Badge variant="outline" className="text-xs">Ages {toy.ageRange}</Badge>
            <Badge variant="outline" className="text-xs">{toy.condition}</Badge>
          </div>
          
          <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
            {toy.description}
          </p>
          
          <div className="mt-auto pt-2">
            <Link href={`/toys/${toy.id}`}>
              <Button className="w-full" variant="outline" size="sm">
                View Details
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}