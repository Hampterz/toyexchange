import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";
import { ProfileToys } from "@/components/profile/profile-toys";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AddressAutocomplete } from "@/components/address-autocomplete";

import { Loader2, Save, UploadCloud, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AddToyModal } from "@/components/toys/add-toy-modal";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    location: user?.location || "",
    email: user?.email || "",
    locationPrivacy: user?.locationPrivacy || "city_only",
    profilePicture: user?.profilePicture || "",
  });
  const [isAddToyModalOpen, setIsAddToyModalOpen] = useState(false);

  // User data is loaded via useAuth hook

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

  const handleLocationPrivacyChange = (value: string) => {
    setProfileData((prev) => ({
      ...prev,
      locationPrivacy: value,
    }));
  };
  
  // Handle profile picture upload
  const handleProfilePictureClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    // Check file size and type
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File Too Large",
        description: "Please select an image less than 5MB in size.",
        variant: "destructive",
      });
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a valid image file (JPEG, PNG, etc.).",
        variant: "destructive",
      });
      return;
    }
    
    setIsImageUploading(true);
    
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      // Upload image
      const response = await fetch(`/api/users/${user.id}/profile-picture`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to upload image');
      
      const data = await response.json();
      
      // Update profile data with new image URL
      setProfileData(prev => ({
        ...prev,
        profilePicture: data.profilePicture
      }));
      
      // Invalidate user data in cache to update avatar in header
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImageUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="page-transition">
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
                  <div className="relative group">
                    <div 
                      onClick={handleProfilePictureClick}
                      className={`cursor-pointer relative ${isEditing ? 'hover:opacity-80' : ''}`}
                    >
                      <AvatarWithFallback user={user} className="h-24 w-24 mb-4" />
                      {isEditing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          {isImageUploading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-white" />
                          ) : (
                            <Camera className="h-8 w-8 text-white" />
                          )}
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
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
                      <p className="text-xs text-blue-500 mt-1">
                        Click on your profile picture to change it
                      </p>
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
                        <p className="text-xs text-blue-500 mt-1">
                          {user.locationPrivacy === 'city_only' 
                            ? 'Only your city is visible to others' 
                            : user.locationPrivacy === 'exact_location'
                            ? 'Your exact location is visible to others'
                            : 'Your location is private'}
                        </p>
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
                        <div className="mt-1">
                          <AddressAutocomplete
                            id="location"
                            placeholder="Enter your address..."
                            defaultValue={profileData.location}
                            className="w-full border border-gray-300 rounded-md py-2 px-3"
                            onAddressSelect={(
                              address: string, 
                              coordinates?: { latitude: number; longitude: number }
                            ) => {
                              setProfileData(prev => ({
                                ...prev,
                                location: address,
                                ...(coordinates ? {
                                  latitude: coordinates.latitude,
                                  longitude: coordinates.longitude
                                } : {})
                              }));
                            }}
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label>Location Privacy</Label>
                        <RadioGroup 
                          value={profileData.locationPrivacy} 
                          onValueChange={handleLocationPrivacyChange}
                          className="mt-2 space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="city_only" id="city_only" />
                            <Label htmlFor="city_only" className="cursor-pointer">Show city only</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="exact_location" id="exact_location" />
                            <Label htmlFor="exact_location" className="cursor-pointer">Show exact location</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="private" id="private" />
                            <Label htmlFor="private" className="cursor-pointer">Keep location private</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <Button 
                        className="w-full mt-4 btn-animated" 
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



            <Button 
              className="w-full mt-4 bg-orange-500 hover:bg-orange-600 btn-animated" 
              onClick={() => setIsAddToyModalOpen(true)}
            >
              <i className="fas fa-plus mr-2"></i> Share a New Toy
            </Button>
          </div>
          
          {/* Content Tabs */}
          <div className="md:w-2/3">
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-4">Your Listings</h2>
              <ProfileToys userId={user.id} />
            </div>
          </div>
        </div>
      </div>
      
      <AddToyModal
        isOpen={isAddToyModalOpen}
        onClose={() => setIsAddToyModalOpen(false)}
      />
    </div>
  );
}
