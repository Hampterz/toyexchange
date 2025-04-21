import { useState, useRef } from "react";
import { Heart, MapPin, ChevronLeft, ChevronRight, Calendar, MapPinIcon, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toy } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SustainabilityBadge } from "@/components/profile/sustainability-badge";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ToyCardProps {
  toy: Toy;
  onRequestClick: (toy: Toy) => void;
}

export function ToyCard({ toy, onRequestClick }: ToyCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const isOwner = user && toy.userId === user.id;
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  // Track if we're viewing videos or images
  const [viewingVideos, setViewingVideos] = useState(false);

  // Query to check if the toy is favorited by the current user
  const { data: favoriteData } = useQuery({
    queryKey: [`/api/toys/${toy.id}/favorite`],
    queryFn: async () => {
      if (!user) return { favorited: false };
      try {
        const res = await fetch(`/api/toys/${toy.id}/favorite`, {
          credentials: "include",
        });
        return await res.json();
      } catch (error) {
        return { favorited: false };
      }
    },
    enabled: !!user,
  });
  
  // Query to get the owner user details (including sustainability badge)
  const { data: toyOwner } = useQuery({
    queryKey: [`/api/users/${toy.userId}`],
    queryFn: async () => {
      const res = await fetch(`/api/users/${toy.userId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch toy owner');
      }
      return await res.json();
    },
    enabled: true,
  });
  
  const isFavorited = favoriteData?.favorited || false;

  // Mutation to toggle favorite status
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/toys/${toy.id}/favorite`);
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate the favorite status query
      queryClient.invalidateQueries({ queryKey: [`/api/toys/${toy.id}/favorite`] });
      // Also invalidate the favorites list if user is on that page
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    },
  });

  const handleFavoriteClick = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save toys to your favorites",
        variant: "default",
      });
      return;
    }
    
    toggleFavoriteMutation.mutate();
  };

  // Get the first image from the array for display
  const mainImage = toy.images && toy.images.length > 0 ? toy.images[0] : '';
  
  // Media navigation handlers
  const nextImage = () => {
    if (!toy.images || toy.images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === toy.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (!toy.images || toy.images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === 0 ? toy.images.length - 1 : prev - 1));
  };

  const nextVideo = () => {
    if (!toy.videos || toy.videos.length === 0) return;
    setCurrentVideoIndex((prev) => (prev === toy.videos.length - 1 ? 0 : prev + 1));
  };

  const prevVideo = () => {
    if (!toy.videos || toy.videos.length === 0) return;
    setCurrentVideoIndex((prev) => (prev === 0 ? toy.videos.length - 1 : prev - 1));
  };

  const toggleMediaType = () => {
    setViewingVideos(!viewingVideos);
  };
  
  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition card-animated">
      <div className="relative pb-[75%] bg-neutral-100">
        {mainImage ? (
          <img 
            src={mainImage} 
            alt={toy.title} 
            className="absolute h-full w-full object-cover transition group-hover:scale-105" 
          />
        ) : (
          <div className="absolute h-full w-full flex items-center justify-center text-neutral-400">
            <i className="fas fa-image text-4xl"></i>
          </div>
        )}
        
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 h-9 w-9 bg-white bg-opacity-90 rounded-full flex items-center justify-center transition click-scale"
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          disabled={toggleFavoriteMutation.isPending}
        >
          <Heart className={`text-lg ${isFavorited ? "fill-primary text-primary" : "text-neutral-500 hover:text-primary"}`} />
        </button>
        
        <div className="absolute bottom-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
          {toy.condition}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold font-heading text-base truncate">
            {toy.title}
          </h3>
          <span className="text-xs bg-neutral-100 px-2 py-1 rounded-full text-neutral-700">
            Ages {toy.ageRange}
          </span>
        </div>
        
        <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
          {toy.description}
        </p>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="text-neutral-500 mr-1 h-3 w-3" />
              <span className="text-neutral-500 text-xs">{toy.location}</span>
            </div>
            
            {!isOwner && (
              <Button 
                variant="link" 
                className="text-primary font-medium text-sm p-0 h-auto hover:underline click-scale"
                onClick={() => onRequestClick(toy)}
              >
                Request
              </Button>
            )}
            
            {isOwner && (
              <span className="text-xs text-neutral-500 italic">Your listing</span>
            )}
          </div>
          
          {/* Sustainability Badge */}
          {toyOwner && !isOwner && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                <span>Shared by:</span>
                <span className="font-medium">{toyOwner.name}</span>
              </div>
              {toyOwner.currentBadge && (
                <SustainabilityBadge 
                  user={toyOwner} 
                  className="text-xs py-0.5 scale-90 origin-right"
                />
              )}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
