import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Loader2, MapPin, Calendar } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { User, Toy, ToyRequest } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SustainabilityBadge } from "@/components/profile/sustainability-badge";
import { ProfileToyCard } from "@/components/profile/profile-toy-card";
import { ReviewCard } from "@/components/profile/review-card";

export default function UserProfilePage() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("toys");
  
  // Fetch user details
  const { data: user, isLoading: isLoadingUser } = useQuery<Omit<User, "password">, Error>({
    queryKey: [`/api/users/${userId}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Fetch user's toys
  const { data: toys, isLoading: isLoadingToys } = useQuery<Toy[], Error>({
    queryKey: [`/api/users/${userId}/toys`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!userId
  });
  
  // Fetch reviews for this user
  const { data: reviews, isLoading: isLoadingReviews } = useQuery<ToyRequest[], Error>({
    queryKey: [`/api/users/${userId}/reviews`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!userId
  });
  
  if (isLoadingUser || isLoadingToys || isLoadingReviews) {
    return (
      <div className="container max-w-5xl mx-auto py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container max-w-5xl mx-auto py-16">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
            <p className="text-neutral-600 mb-6">
              The user profile you're looking for doesn't exist or you don't have permission to view it.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Filter active and traded toys
  const activeToys = Array.isArray(toys) 
    ? toys.filter(toy => toy.status === 'active' && toy.isAvailable) 
    : [];
    
  const tradedToys = Array.isArray(toys) 
    ? toys.filter(toy => toy.status === 'traded' || !toy.isAvailable) 
    : [];
  
  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* User Header Card */}
      <Card className="mb-8 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white">
                <AvatarImage src={user.profilePicture || undefined} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="absolute -bottom-2 -right-2">
                <SustainabilityBadge user={user} />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              
              <div className="flex flex-col sm:flex-row sm:gap-6 mt-2 text-neutral-600">
                <div className="flex items-center justify-center md:justify-start gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location || "Location not specified"}</span>
                </div>
                
                <div className="flex items-center justify-center md:justify-start gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Joined {user.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        }) 
                      : 'Unknown date'}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  <span className="font-semibold">{user.toysShared || 0}</span> toys shared
                </div>
                
                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
                  <span className="font-semibold">{user.successfulExchanges || 0}</span> exchanges
                </div>
                
                <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                  <span className="font-semibold">{reviews?.length || 0}</span> reviews
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs for Toys and Reviews */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="toys">
            Toys ({(activeToys?.length || 0) + (tradedToys?.length || 0)})
          </TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({reviews?.length || 0})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="toys" className="mt-6">
          {activeToys.length === 0 && tradedToys.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-neutral-600">
                  This user doesn't have any toy listings yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {activeToys.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Available Toys</h2>
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {activeToys.map(toy => (
                      <ToyCard key={toy.id} toy={toy} />
                    ))}
                  </div>
                </div>
              )}
              
              {tradedToys.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Previously Shared Toys</h2>
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {tradedToys.map(toy => (
                      <ToyCard key={toy.id} toy={toy} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6">
          {!reviews || reviews.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-neutral-600">
                  This user doesn't have any reviews yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}