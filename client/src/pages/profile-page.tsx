import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";
import { ProfileToys } from "@/components/profile/profile-toys";
import { ProfileRequests } from "@/components/profile/profile-requests";
import { SustainabilityBadge } from "@/components/profile/sustainability-badge";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AddToyModal } from "@/components/toys/add-toy-modal";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    location: user?.location || "",
    email: user?.email || "",
  });
  const [isAddToyModalOpen, setIsAddToyModalOpen] = useState(false);

  // Get toy requests that user needs to respond to (as an owner)
  const { data: receivedRequests, isLoading: isLoadingReceived } = useQuery({
    queryKey: ["/api/requests/received"],
    enabled: !!user,
  });

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await apiRequest("PATCH", `/api/users/${user.id}`, profileData);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          {/* Profile Section */}
          <div className="md:w-1/3">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Your Profile</CardTitle>
                  {!isEditing && (
                    <Button variant="ghost" onClick={handleEditProfile} className="click-scale">
                      Edit
                    </Button>
                  )}
                </div>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-6">
                  <AvatarWithFallback user={user} className="h-24 w-24 mb-4" />
                  {!isEditing ? (
                    <h2 className="text-xl font-bold">{user.name}</h2>
                  ) : (
                    <div className="w-full mb-4">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {!isEditing ? (
                    <>
                      <div>
                        <Label className="text-sm text-muted-foreground">Email</Label>
                        <p>{user.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Location</Label>
                        <p>{user.location}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={profileData.location}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <Button 
                        className="w-full mt-2" 
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <SustainabilityBadge user={user} showDetails={true} />
            </div>

            <Button 
              className="w-full mt-4 bg-orange-500 hover:bg-orange-600 btn-animated" 
              onClick={() => setIsAddToyModalOpen(true)}
            >
              <i className="fas fa-plus mr-2"></i> Share a New Toy
            </Button>
          </div>
          
          {/* Content Tabs */}
          <div className="md:w-2/3">
            <Tabs defaultValue="toys" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="toys">Your Listings</TabsTrigger>
                <TabsTrigger value="requests">
                  Requests
                  {receivedRequests?.length > 0 && (
                    <span className="ml-2 bg-orange-500 text-white text-xs py-0.5 px-2 rounded-full">
                      {receivedRequests.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="toys" className="mt-4">
                <ProfileToys userId={user.id} />
              </TabsContent>
              
              <TabsContent value="requests" className="mt-4">
                <ProfileRequests />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <AddToyModal
        isOpen={isAddToyModalOpen}
        onClose={() => setIsAddToyModalOpen(false)}
      />
    </>
  );
}
