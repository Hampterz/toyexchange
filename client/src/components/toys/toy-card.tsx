import { useState, useRef } from "react";
import { Heart, MapPin, ChevronLeft, ChevronRight, Calendar, MapPinIcon, Star, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toy, ToyWithDistance } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SocialShareButtons } from "@/components/social/social-share-buttons";
import ConfettiEffect from "@/components/ui/confetti-effect";
import { UserBadge } from "@/components/ui/user-badge";

interface ToyCardProps {
  toy: ToyWithDistance;
  onRequestClick: (toy: ToyWithDistance) => void;
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
  const [showConfetti, setShowConfetti] = useState(false);

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
  
  // Mutation to mark a toy as sold
  const markAsSoldMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", `/api/toys/${toy.id}`, {
        status: "sold",
        isAvailable: false,
        soldDate: new Date().toISOString()
      });
      return await res.json();
    },
    onSuccess: () => {
      // Show success toast
      toast({
        title: "Success!",
        description: "Toy has been marked as sold",
        variant: "default",
      });
      
      // Show confetti celebration effect
      setShowConfetti(true);
      
      // Invalidate the toy queries to refresh data
      queryClient.invalidateQueries({ queryKey: [`/api/toys/${toy.id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/toys"] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/toys`] });
      
      // Hide the expanded toy view after a short delay to show confetti
      setTimeout(() => {
        setIsExpanded(false);
      }, 500);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark toy as sold",
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

  const hasVideos = toy.videos && Array.isArray(toy.videos) && toy.videos.length > 0;
  
  const nextVideo = () => {
    if (!hasVideos) return;
    const videos = toy.videos as string[];
    const videosLength = videos.length;
    setCurrentVideoIndex((prev) => (prev === videosLength - 1 ? 0 : prev + 1));
  };

  const prevVideo = () => {
    if (!hasVideos) return;
    const videos = toy.videos as string[];
    const videosLength = videos.length;
    setCurrentVideoIndex((prev) => (prev === 0 ? videosLength - 1 : prev - 1));
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
  
  // Get shareable URL for this toy
  const getShareableUrl = () => {
    return `${window.location.origin}/toys/${toy.id}`;
  };

  return (
    <>
      {/* Confetti effect when marking a toy as sold */}
      {showConfetti && <ConfettiEffect duration={3000} numberOfPieces={300} />}
      <div 
        className="bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden group transition-all duration-300 transform hover:-translate-y-1 cursor-pointer touch-manipulation h-full"
        onClick={() => setIsExpanded(true)}
        role="button"
        aria-label={`View details for ${toy.title}`}
      >
        <div className="relative pb-[70%] xs:pb-[75%] bg-neutral-100">
          {mainImage ? (
            <img 
              src={mainImage} 
              alt={toy.title} 
              className="absolute h-full w-full object-cover transition group-hover:scale-105" 
              loading="lazy"
              width="300"
              height="225"
            />
          ) : (
            <div className="absolute h-full w-full flex items-center justify-center text-neutral-400">
              <i className="fas fa-image text-3xl xs:text-4xl"></i>
            </div>
          )}
          
          <div className="absolute top-1 right-1 xs:top-2 sm:top-3 xs:right-2 sm:right-3 flex space-x-1">
            {/* Share button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Open dialog to ensure sharing works
                setIsExpanded(true);
              }}
              className="h-6 w-6 xs:h-7 xs:w-7 sm:h-9 sm:w-9 bg-white bg-opacity-90 rounded-full flex items-center justify-center transition click-scale shadow-sm"
              aria-label="Share this toy"
            >
              <Share2 className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-neutral-500 hover:text-primary" />
            </button>
            
            {/* Favorite button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleFavoriteClick();
              }}
              className="h-6 w-6 xs:h-7 xs:w-7 sm:h-9 sm:w-9 bg-white bg-opacity-90 rounded-full flex items-center justify-center transition click-scale shadow-sm"
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
              disabled={toggleFavoriteMutation.isPending}
            >
              <Heart className={`h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 ${isFavorited ? "fill-primary text-primary" : "text-neutral-500 hover:text-primary"}`} />
            </button>
          </div>
          
          <div className="absolute bottom-1 left-1 xs:bottom-2 xs:left-2 sm:bottom-3 sm:left-3 bg-primary text-white text-[9px] xs:text-xs font-bold px-1.5 py-0.5 xs:px-2 sm:py-1 rounded-full">
            {toy.condition}
          </div>
        </div>
        
        <div className="p-2 xs:p-3 sm:p-4 flex flex-col h-[calc(100%-70%)]">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <h3 className="font-bold font-heading text-xs xs:text-sm sm:text-base truncate max-w-[70%]">
              {toy.title}
            </h3>
            <span className="text-[8px] xs:text-[10px] sm:text-xs bg-neutral-100 px-1 py-0.5 xs:px-1.5 sm:px-2 sm:py-1 rounded-full text-neutral-700 whitespace-nowrap">
              Ages {toy.ageRange}
            </span>
          </div>
          
          <p className="text-neutral-600 text-[10px] xs:text-xs sm:text-sm mb-1 xs:mb-2 sm:mb-3 line-clamp-2">
            {toy.description}
          </p>
          
          <div className="flex flex-col gap-1 sm:gap-2 mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="text-neutral-500 mr-0.5 xs:mr-1 h-2.5 w-2.5 xs:h-3 xs:w-3 flex-shrink-0" />
                <span className="text-neutral-500 text-[9px] xs:text-xs truncate max-w-[120px] xs:max-w-[150px]">
                  {toyOwner?.locationPrivacy === 'exact_location' ? toy.location :
                   toyOwner?.locationPrivacy === 'private' ? 'Location hidden' :
                   toyOwner?.cityName || toy.location.split(',')[0]}
                  {toy.distance && (
                    <span className="ml-0.5 xs:ml-1 text-blue-600 font-medium">
                      ({Math.round(toy.distance * 10) / 10} mi)
                    </span>
                  )}
                </span>
              </div>
              
              {!isOwner && (
                <Button 
                  variant="link" 
                  className="text-primary font-medium text-[10px] xs:text-xs sm:text-sm p-0 h-auto hover:underline click-scale"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRequestClick(toy);
                  }}
                >
                  Message
                </Button>
              )}
              
              {isOwner && (
                <div className="flex items-center gap-1 xs:gap-2">
                  <span className="text-[9px] xs:text-xs text-neutral-500 italic">Your listing</span>
                  {toy.status !== 'sold' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-5 xs:h-6 px-1 xs:px-2 py-0 text-[9px] xs:text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsSoldMutation.mutate();
                      }}
                    >
                      <span className="hidden xs:inline">Mark as Sold</span>
                      <span className="xs:hidden">Sold</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {/* User Information */}
            {toyOwner && !isOwner && (
              <div className="flex items-center justify-between">
                <HoverCard>
                  <HoverCardTrigger>
                    <div className="flex items-center gap-1 sm:gap-1.5 text-xs text-neutral-600 cursor-pointer">
                      <span className="text-[10px] sm:text-xs">Shared by:</span>
                      <span className="font-medium text-[10px] sm:text-xs truncate max-w-[100px] sm:max-w-[150px]">{toyOwner.name}</span>
                      {toyOwner.currentBadge && (
                        <UserBadge 
                          badgeName={toyOwner.currentBadge} 
                          className="ml-1 text-sm" 
                          showTooltip={true}
                        />
                      )}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-72 sm:w-80 p-3 sm:p-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-bold text-sm sm:text-base">{toyOwner.name}</h4>
                        <div className="flex items-center text-xs sm:text-sm text-neutral-500 mt-1">
                          <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span>Joined {formatDate(toyOwner.createdAt)}</span>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-neutral-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {toyOwner.locationPrivacy === 'exact_location' ? toyOwner.location :
                             toyOwner.locationPrivacy === 'private' ? 'Location hidden' :
                             toyOwner.cityName || toyOwner.location.split(',')[0]}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-base sm:text-lg font-bold text-blue-600">{toyOwner.successfulExchanges || 0}</span>
                        <span className="text-[10px] sm:text-xs text-neutral-500">Exchanges</span>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Toy Detail Dialog */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto sm:overflow-y-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image/Video Gallery */}
            <div className="relative bg-black h-[250px] sm:h-[300px] md:h-full min-h-[250px] sm:min-h-[300px]">
              {!viewingVideos && toy.images && toy.images.length > 0 ? (
                <div className="w-full h-full relative">
                  <img 
                    src={toy.images[currentImageIndex]} 
                    alt={`${toy.title} - image ${currentImageIndex + 1}`} 
                    className="w-full h-full object-contain"
                    loading="lazy"
                    width="600"
                    height="450"
                  />
                  
                  {toy.images.length > 1 && (
                    <>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-white bg-opacity-70 rounded-full flex items-center justify-center"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-white bg-opacity-70 rounded-full flex items-center justify-center"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                        {toy.images.map((_, i) => (
                          <button 
                            key={i}
                            onClick={() => setCurrentImageIndex(i)}
                            className={`h-2 w-2 rounded-full ${currentImageIndex === i ? 'bg-white' : 'bg-white/50'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : viewingVideos && hasVideos ? (
                <div className="w-full h-full relative">
                  <video 
                    src={(toy.videos as string[])[currentVideoIndex]} 
                    controls
                    className="w-full h-full object-contain"
                  />
                  
                  {hasVideos && (toy.videos as string[]).length > 1 && (
                    <>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          prevVideo();
                        }}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-white bg-opacity-70 rounded-full flex items-center justify-center"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          nextVideo();
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-white bg-opacity-70 rounded-full flex items-center justify-center"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                        {(toy.videos as string[]).map((_, i) => (
                          <button 
                            key={i}
                            onClick={() => setCurrentVideoIndex(i)}
                            className={`h-2 w-2 rounded-full ${currentVideoIndex === i ? 'bg-white' : 'bg-white/50'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  No media available
                </div>
              )}
              
              {/* Toggle between images and videos */}
              {hasVideos && toy.images && toy.images.length > 0 && (
                <div className="absolute top-2 right-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={toggleMediaType}
                    className="text-xs"
                  >
                    {viewingVideos ? 'View Photos' : 'View Video'}
                  </Button>
                </div>
              )}
            </div>
            
            {/* Toy Details */}
            <div className="p-6 flex flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{toy.title}</h2>
                  <div className="flex items-center my-1">
                    <Badge className="mr-2 bg-primary">{toy.condition}</Badge>
                    <Badge variant="outline">Ages {toy.ageRange}</Badge>
                  </div>
                </div>
                <button 
                  onClick={handleFavoriteClick}
                  className="h-9 w-9 bg-white border border-neutral-200 rounded-full flex items-center justify-center transition hover:bg-neutral-50"
                >
                  <Heart className={`h-5 w-5 ${isFavorited ? "fill-primary text-primary" : "text-neutral-400"}`} />
                </button>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-1">Description</h3>
                <p className="text-neutral-700 text-sm leading-relaxed">
                  {toy.description}
                </p>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-1">Pickup Location</h3>
                <div className="flex items-center text-neutral-700 text-sm">
                  <MapPin className="h-4 w-4 mr-1 text-neutral-500" />
                  <span>
                    {toy.location}
                    {toy.distance && (
                      <span className="ml-1 text-blue-600 font-medium">
                        ({Math.round(toy.distance * 10) / 10} miles away)
                      </span>
                    )}
                  </span>
                </div>
              </div>
              
              {toy.tags && toy.tags.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {toy.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-neutral-100 text-neutral-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-1">Category</h3>
                <Badge variant="outline">{toy.category}</Badge>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2">Share this toy</h3>
                <div className="flex items-center space-x-2">
                  <SocialShareButtons
                    url={getShareableUrl()}
                    title={`Check out this toy on ToyShare: ${toy.title}`}
                    description={`${toy.description} - Available for exchange in ${toy.location}`}
                  />
                </div>
              </div>

              <div className="mt-6 border-t pt-4">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold">Shared by</h3>
                    {toyOwner && (
                      <HoverCard>
                        <HoverCardTrigger className="inline-block mt-1">
                          <div className="flex items-center gap-2 text-sm hover:text-primary cursor-pointer">
                            <span className="font-medium">{toyOwner.name}</span>
                            {toyOwner.currentBadge && (
                              <UserBadge 
                                badgeName={toyOwner.currentBadge} 
                                className="text-lg" 
                                showTooltip={true}
                              />
                            )}
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 p-4">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-bold">{toyOwner.name}</h4>
                              <div className="flex items-center text-sm text-neutral-500 mt-1">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>Joined {formatDate(toyOwner.createdAt)}</span>
                              </div>
                              <div className="flex items-center text-sm text-neutral-500 mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{toyOwner.location}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-lg font-bold text-blue-600">{toyOwner.successfulExchanges || 0}</span>
                              <span className="text-xs text-neutral-500">Exchanges</span>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    )}
                  </div>
                  
                  {!isOwner && (
                    <Button 
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => {
                        setIsExpanded(false);
                        onRequestClick(toy);
                      }}
                    >
                      Message Owner
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
