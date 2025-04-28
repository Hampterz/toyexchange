import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Wish, WishOffer, User } from "@shared/schema";
import { ArrowLeft, Heart, MapPin, Clock, CalendarDays, MessageSquare, Loader2, User as UserIcon, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { PageHeader } from "@/components/page-header";
import { formatDistanceToNow } from "date-fns";

export default function WishDetailPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [offerMessage, setOfferMessage] = useState("");
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch wish details
  const { data: wish, isLoading, error } = useQuery<Wish>({
    queryKey: [`/api/wishes/${id}`],
    queryFn: async () => {
      const res = await fetch(`/api/wishes/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch wish details");
      }
      return res.json();
    },
  });
  
  // Fetch wish creator data
  const { data: wishCreator } = useQuery<User>({
    queryKey: [`/api/users/${wish?.userId}`],
    enabled: !!wish?.userId,
    queryFn: async () => {
      const res = await fetch(`/api/users/${wish?.userId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user details");
      }
      return res.json();
    },
  });
  
  // Fetch wish offers (only if user is the wish creator)
  const { data: offers, isLoading: offersLoading } = useQuery<WishOffer[]>({
    queryKey: [`/api/wishes/${id}/offers`],
    enabled: !!user && !!wish && user.id === wish.userId,
    queryFn: async () => {
      const res = await fetch(`/api/wishes/${id}/offers`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch wish offers");
      }
      return res.json();
    },
  });
  
  // Create wish offer mutation
  const createOfferMutation = useMutation({
    mutationFn: async (data: { message: string }) => {
      return apiRequest("POST", `/api/wishes/${id}/offer`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/wishes/${id}/offers`] });
      toast({
        title: "Offer sent!",
        description: "Your offer has been sent to the wish creator.",
      });
      setOfferMessage("");
      setIsOfferDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send offer",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update offer status mutation
  const updateOfferStatusMutation = useMutation({
    mutationFn: async ({ offerId, status }: { offerId: number; status: string }) => {
      return apiRequest("PATCH", `/api/wish-offers/${offerId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/wishes/${id}/offers`] });
      queryClient.invalidateQueries({ queryKey: [`/api/wishes/${id}`] });
      toast({
        title: "Offer updated",
        description: "The offer status has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update offer",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleCreateOffer = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to make an offer.",
        variant: "destructive",
      });
      return;
    }
    
    if (!offerMessage.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message to the wish creator.",
        variant: "destructive",
      });
      return;
    }
    
    createOfferMutation.mutate({ message: offerMessage });
  };
  
  const handleUpdateOfferStatus = (offerId: number, status: string) => {
    updateOfferStatusMutation.mutate({ offerId, status });
  };
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading wish details...</span>
      </div>
    );
  }
  
  // Handle error state
  if (error || !wish) {
    return (
      <div className="container py-8 flex flex-col justify-center items-center min-h-[50vh]">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Wish Not Found</h2>
        <p className="text-muted-foreground mb-6">The wish you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => setLocation("/wishes")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Wishes
        </Button>
      </div>
    );
  }
  
  const isCreator = user && user.id === wish.userId;
  const isPending = wish.status === "pending";
  const isFulfilled = wish.status === "fulfilled";
  
  return (
    <div className="container py-6 space-y-6 mb-12">
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="mr-2"
              onClick={() => setLocation("/wishes")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <span>{wish.title}</span>
            {isFulfilled && (
              <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">
                Fulfilled
              </Badge>
            )}
          </div>
        }
        rightContent={
          !isCreator && isPending ? (
            <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md">
                  <MessageSquare className="h-4 w-4 mr-2" /> Make an Offer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Make an Offer</DialogTitle>
                  <DialogDescription>
                    Let the wish creator know what you can offer and how you can help.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Textarea
                    placeholder="Describe your offer..."
                    className="min-h-32"
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleCreateOffer}
                    disabled={createOfferMutation.isPending}
                  >
                    {createOfferMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Offer"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : null
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Main content */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{wish.category}</Badge>
                  <Badge variant="outline">{wish.ageRange}</Badge>
                  {wish.tags && wish.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="text-sm flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {wish.location}
                </div>

                <div className="py-2">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="whitespace-pre-line">{wish.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Offers section - only visible to the wish creator */}
          {isCreator && (
            <Card>
              <CardHeader>
                <CardTitle>Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending">
                  <TabsList className="mb-4">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="accepted">Accepted</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="pending" className="space-y-4">
                    {offersLoading ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : offers && offers.filter(o => o.status === "pending").length > 0 ? (
                      offers
                        .filter(o => o.status === "pending")
                        .map((offer) => (
                          <OfferCard
                            key={offer.id}
                            offer={offer}
                            onAccept={() => handleUpdateOfferStatus(offer.id, "accepted")}
                            onReject={() => handleUpdateOfferStatus(offer.id, "rejected")}
                          />
                        ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No pending offers yet.</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="accepted" className="space-y-4">
                    {offersLoading ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : offers && offers.filter(o => o.status === "accepted").length > 0 ? (
                      offers
                        .filter(o => o.status === "accepted")
                        .map((offer) => (
                          <OfferCard
                            key={offer.id}
                            offer={offer}
                            showActions={false}
                          />
                        ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No accepted offers.</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="rejected" className="space-y-4">
                    {offersLoading ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : offers && offers.filter(o => o.status === "rejected").length > 0 ? (
                      offers
                        .filter(o => o.status === "rejected")
                        .map((offer) => (
                          <OfferCard
                            key={offer.id}
                            offer={offer}
                            showActions={false}
                          />
                        ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No rejected offers.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Wish creator info card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Wish Creator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={wishCreator?.profilePicture || ""} alt={wishCreator?.name} />
                  <AvatarFallback>
                    <UserIcon className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{wishCreator?.name}</p>
                  <p className="text-sm text-muted-foreground">{wishCreator?.location}</p>
                </div>
              </div>
              {wishCreator?.currentBadge && (
                <div className="mb-4">
                  <Badge variant="outline" className="border-blue-200 bg-blue-50">
                    {wishCreator.currentBadge}
                  </Badge>
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-1 mb-1">
                  <Heart className="h-4 w-4" />
                  <span>Toys Shared: {wishCreator?.toysShared || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Joined {wishCreator?.createdAt ? formatDistanceToNow(new Date(wishCreator.createdAt), { addSuffix: true }) : 'recently'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wish details card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Wish Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>
                  Posted {formatDistanceToNow(new Date(wish.createdAt), { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {wish.status.charAt(0).toUpperCase() + wish.status.slice(1)}
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* Guidelines card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Safety Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Meet in Public Places</h3>
                <p className="text-xs text-muted-foreground">
                  Always meet in public, well-lit locations for toy exchanges.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Inspect Items First</h3>
                <p className="text-xs text-muted-foreground">
                  Examine toys for damage, missing parts, or safety issues.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Trust Your Instincts</h3>
                <p className="text-xs text-muted-foreground">
                  If something doesn't feel right, it's okay to decline.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Offer card component to display individual offers
function OfferCard({ 
  offer, 
  onAccept, 
  onReject, 
  showActions = true 
}: { 
  offer: WishOffer; 
  onAccept?: () => void; 
  onReject?: () => void;
  showActions?: boolean;
}) {
  // Fetch offerer data
  const { data: offerer } = useQuery<User>({
    queryKey: [`/api/users/${offer.offererId}`],
    queryFn: async () => {
      const res = await fetch(`/api/users/${offer.offererId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user details");
      }
      return res.json();
    },
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={offerer?.profilePicture || ""} alt={offerer?.name} />
            <AvatarFallback>
              <UserIcon className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{offerer?.name}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(offer.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm">{offer.message}</p>
      </CardContent>
      {showActions && (
        <CardFooter className="pt-2 border-t flex justify-end space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onReject}
          >
            Decline
          </Button>
          <Button 
            size="sm" 
            onClick={onAccept}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
          >
            Accept
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}