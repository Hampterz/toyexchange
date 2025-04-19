import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, MapPin, Search, Filter, X, ExternalLink, Check, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function MeetupLocationsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationTypeFilter, setLocationTypeFilter] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    locationType: "park",
    notes: ""
  });
  
  const { data: locations, isLoading } = useQuery({
    queryKey: ["/api/meetup-locations", { search: searchQuery, type: locationTypeFilter }],
    queryFn: undefined,
    enabled: true
  });
  
  const addLocationMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // This would be a real API call in a real implementation
      return { 
        id: Date.now(),
        ...data,
        isVerified: null,
        createdAt: new Date(),
        addedBy: user?.id,
        latitude: "40.7128",  // Example coordinates
        longitude: "-74.0060"
      };
    },
    onSuccess: () => {
      toast({
        title: "Location submitted",
        description: "Your suggested meetup location has been submitted for verification.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/meetup-locations"] });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to submit location",
        description: "There was an error submitting your meetup location. Please try again.",
      });
    }
  });
  
  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      locationType: "park",
      notes: ""
    });
  };
  
  const handleAddLocation = () => {
    if (!formData.name || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    addLocationMutation.mutate(formData);
  };
  
  const getLocationTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      "park": "Park",
      "library": "Library",
      "community-center": "Community Center",
      "mall": "Shopping Mall",
      "cafe": "Café",
      "recreation-center": "Recreation Center",
      "other": "Other"
    };
    return types[type] || type;
  };
  
  const getVerificationBadge = (isVerified: boolean | null) => {
    if (isVerified === true) {
      return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
    } else if (isVerified === false) {
      return <Badge variant="destructive">Rejected</Badge>;
    } else {
      return <Badge variant="outline">Pending</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="container py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Safe Meetup Locations</h1>
          <p className="text-muted-foreground">
            Find recommended and verified places to safely exchange toys
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Suggest Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Suggest a Meetup Location</DialogTitle>
              <DialogDescription>
                Recommend a safe public place for toy exchanges. All locations will be reviewed before being added to the list.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Location Name <span className="text-red-500">*</span></Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Central Park Playground" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Street Address <span className="text-red-500">*</span></Label>
                <Input 
                  id="address" 
                  placeholder="123 Main St" 
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                  <Input 
                    id="city" 
                    placeholder="City name" 
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                  <Input 
                    id="state" 
                    placeholder="State" 
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code <span className="text-red-500">*</span></Label>
                <Input 
                  id="zipCode" 
                  placeholder="12345" 
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="locationType">Location Type <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.locationType} 
                  onValueChange={(value) => setFormData({ ...formData, locationType: value })}
                >
                  <SelectTrigger id="locationType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="park">Park</SelectItem>
                    <SelectItem value="library">Library</SelectItem>
                    <SelectItem value="community-center">Community Center</SelectItem>
                    <SelectItem value="mall">Shopping Mall</SelectItem>
                    <SelectItem value="cafe">Café</SelectItem>
                    <SelectItem value="recreation-center">Recreation Center</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Additional details about this location (e.g., 'Meet near the children's play area')" 
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddLocation} disabled={addLocationMutation.isPending}>
                {addLocationMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit Location
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations by name, city, or address"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Select 
          value={locationTypeFilter || ""} 
          onValueChange={(value) => setLocationTypeFilter(value || null)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="park">Parks</SelectItem>
            <SelectItem value="library">Libraries</SelectItem>
            <SelectItem value="community-center">Community Centers</SelectItem>
            <SelectItem value="mall">Shopping Malls</SelectItem>
            <SelectItem value="cafe">Cafés</SelectItem>
            <SelectItem value="recreation-center">Recreation Centers</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {locations && locations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
            <Card key={location.id} className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{location.name}</CardTitle>
                  {getVerificationBadge(location.isVerified)}
                </div>
                <CardDescription>
                  <Badge variant="outline" className="mt-1">
                    {getLocationTypeLabel(location.locationType)}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <p className="text-sm">{location.address}</p>
                  <p className="text-sm">{location.city}, {location.state} {location.zipCode}</p>
                  
                  {location.notes && (
                    <p className="text-sm mt-2 italic">{location.notes}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t">
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
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">No locations found</h3>
          <p className="text-muted-foreground max-w-md mt-2 mb-6">
            {searchQuery || locationTypeFilter
              ? "No locations match your current filters. Try different search terms or filters."
              : "There are no verified meetup locations yet. Be the first to suggest one!"
            }
          </p>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Suggest a Location
          </Button>
        </div>
      )}
      
      <div className="mt-12 pt-6 border-t">
        <h2 className="text-xl font-bold mb-3">Safe Meetup Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Meet in public places</h3>
                <p className="text-sm text-muted-foreground">Always choose busy, well-lit public locations for exchanging toys.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Bring a friend</h3>
                <p className="text-sm text-muted-foreground">Consider bringing another adult with you for additional safety.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Trust your instincts</h3>
                <p className="text-sm text-muted-foreground">If something doesn't feel right, don't hesitate to cancel or reschedule.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Share your plans</h3>
                <p className="text-sm text-muted-foreground">Let a family member or friend know when and where you're meeting someone.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Meet during daylight hours</h3>
                <p className="text-sm text-muted-foreground">Try to schedule meetups during daylight hours whenever possible.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Verify toys before exchange</h3>
                <p className="text-sm text-muted-foreground">Check toys for damage, missing parts, or safety concerns before completing the exchange.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}