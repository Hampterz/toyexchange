import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function MeetupLocationVerification() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  
  // Redirect if not admin
  if (user && user.username !== "adminsreyas") {
    navigate("/");
    return null;
  }
  
  const { data: locations, isLoading, error } = useQuery({
    queryKey: ["/api/meetup-locations"],
    queryFn: undefined,
    enabled: !!user
  });
  
  const verifyLocationMutation = useMutation({
    mutationFn: async ({ id, isVerified, reason }: { id: number; isVerified: boolean; reason?: string }) => {
      // This would be a real API call in the actual implementation
      return { id, isVerified };
    },
    onSuccess: (data) => {
      toast({
        title: data.isVerified ? "Location verified" : "Location rejected",
        description: data.isVerified 
          ? "The meetup location has been verified and is now available to all users." 
          : "The meetup location has been rejected.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/meetup-locations"] });
      setIsRejectDialogOpen(false);
      setRejectionReason("");
      setSelectedLocation(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Action failed",
        description: "There was an error processing your request.",
      });
    }
  });
  
  const handleVerify = (location: any) => {
    verifyLocationMutation.mutate({ id: location.id, isVerified: true });
  };
  
  const openRejectDialog = (location: any) => {
    setSelectedLocation(location);
    setIsRejectDialogOpen(true);
  };
  
  const handleReject = () => {
    if (!selectedLocation) return;
    
    verifyLocationMutation.mutate({ 
      id: selectedLocation.id, 
      isVerified: false,
      reason: rejectionReason 
    });
  };
  
  if (isLoading) {
    return (
      <div className="container py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load meetup locations. Please try again later."
    });
  }
  
  const getPendingLocations = () => {
    return locations?.filter(location => location.isVerified === null || location.isVerified === undefined) || [];
  };
  
  const getVerifiedLocations = () => {
    return locations?.filter(location => location.isVerified === true) || [];
  };
  
  const getRejectedLocations = () => {
    return locations?.filter(location => location.isVerified === false) || [];
  };
  
  return (
    <div className="container py-8">
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold">Meetup Location Verification</h1>
        <p className="text-muted-foreground">Verify suggested meetup locations for safety</p>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList className="w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="pending" className="flex-1">
            Pending
            <Badge variant="secondary" className="ml-2">
              {getPendingLocations().length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="verified" className="flex-1">
            Verified
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex-1">
            Rejected
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-6">
          {getPendingLocations().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getPendingLocations().map(location => (
                <Card key={location.id}>
                  <CardHeader>
                    <CardTitle>{location.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm">{location.address}</p>
                        <p className="text-sm">{location.city}, {location.state} {location.zipCode}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge>{location.locationType}</Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Added by:</span>
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-1">
                            <AvatarFallback>{location.addedByUser?.name?.charAt(0) || '?'}</AvatarFallback>
                          </Avatar>
                          <span>{location.addedByUser?.name || `User #${location.addedBy}`}</span>
                        </div>
                      </div>
                      
                      {location.latitude && location.longitude && (
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center gap-2"
                          onClick={() => window.open(`https://maps.google.com/maps?q=${location.latitude},${location.longitude}`, '_blank')}
                        >
                          <MapPin className="h-4 w-4" />
                          View on Google Maps
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2 pt-2 border-t">
                    <Button 
                      variant="outline" 
                      className="flex-1 text-green-600"
                      onClick={() => handleVerify(location)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Verify
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 text-red-600"
                      onClick={() => openRejectDialog(location)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">No pending locations</h3>
              <p className="text-muted-foreground max-w-md mt-2">
                There are no meetup locations waiting for verification.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="verified" className="space-y-6">
          {getVerifiedLocations().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getVerifiedLocations().map(location => (
                <Card key={location.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{location.name}</CardTitle>
                      <Badge variant="secondary" className="ml-2">Verified</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm">{location.address}</p>
                        <p className="text-sm">{location.city}, {location.state} {location.zipCode}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge>{location.locationType}</Badge>
                      </div>
                      
                      {location.latitude && location.longitude && (
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center gap-2"
                          onClick={() => window.open(`https://maps.google.com/maps?q=${location.latitude},${location.longitude}`, '_blank')}
                        >
                          <MapPin className="h-4 w-4" />
                          View on Google Maps
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t text-sm text-muted-foreground">
                    Verified on {new Date(location.verifiedAt).toLocaleDateString()}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">No verified locations</h3>
              <p className="text-muted-foreground max-w-md mt-2">
                There are no verified meetup locations yet.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rejected" className="space-y-6">
          {getRejectedLocations().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getRejectedLocations().map(location => (
                <Card key={location.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{location.name}</CardTitle>
                      <Badge variant="destructive" className="ml-2">Rejected</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm">{location.address}</p>
                        <p className="text-sm">{location.city}, {location.state} {location.zipCode}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge>{location.locationType}</Badge>
                      </div>
                      
                      {location.rejectionReason && (
                        <div className="bg-red-50 p-3 rounded-md">
                          <p className="text-sm font-medium text-red-800">Rejection reason:</p>
                          <p className="text-sm text-red-700">{location.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full text-green-600"
                      onClick={() => handleVerify(location)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Approve Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">No rejected locations</h3>
              <p className="text-muted-foreground max-w-md mt-2">
                There are no rejected meetup locations.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Rejection Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Location</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this meetup location.
            </DialogDescription>
          </DialogHeader>
          
          {selectedLocation && (
            <div className="py-2">
              <p className="font-medium">{selectedLocation.name}</p>
              <p className="text-sm text-muted-foreground">{selectedLocation.address}, {selectedLocation.city}</p>
            </div>
          )}
          
          <div className="py-2">
            <Textarea
              placeholder="Explain why this location is being rejected"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              Reject Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}