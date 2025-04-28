import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { AddressAutocomplete } from "@/components/address-autocomplete";
import { Upload, User, MapPin, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import Confetti from "react-confetti";

export default function ProfileCustomizationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [bio, setBio] = useState<string>("");
  const [userLocation, setUserLocation] = useState<string>(user?.location || "");
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.profilePicture || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // If user is not logged in, redirect to auth page
    if (!user) {
      window.location.href = "/auth";
      return;
    }

    // Handle window resize for confetti
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      const res = await apiRequest("PATCH", `/api/users/${user?.id}`, updatedData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      
      toast({
        title: "Profile Updated Successfully",
        description: "Your profile has been customized!",
      });
      
      // Navigate to home page after successful update
      setTimeout(() => window.location.href = "/", 2500);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Profile picture must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Only JPEG, PNG, and WebP images are allowed",
          variant: "destructive",
        });
        return;
      }
      
      setImageFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setUploading(true);
    try {
      // Prepare the profile data
      const updatedData: any = {
        bio,
        location: userLocation,
      };
      
      // If a new profile picture was selected, convert it to base64
      if (imageFile) {
        const reader = new FileReader();
        const imageDataPromise = new Promise<string>((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(imageFile);
        });
        
        updatedData.profilePicture = await imageDataPromise;
      }
      
      updateProfileMutation.mutate(updatedData);
    } catch (error) {
      toast({
        title: "Error Processing Image",
        description: "Failed to process the profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = () => {
    window.location.href = "/";
  };

  return (
    <div className="container max-w-3xl py-8 px-4 md:py-12">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}
      
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Customize Your Profile</CardTitle>
          <CardDescription>
            Add some details to personalize your ToyShare experience. This helps build 
            trust with other parents in the community.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div 
              className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer relative"
              onClick={() => document.getElementById('profile-picture-input')?.click()}
            >
              {profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <User className="h-12 w-12 mb-1" />
                  <span className="text-xs">Add Photo</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Upload className="text-white h-6 w-6" />
              </div>
            </div>
            <input
              id="profile-picture-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleProfilePictureChange}
            />
            <span className="text-sm text-muted-foreground">
              Upload a profile picture (optional)
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">About Me</Label>
            <Textarea
              id="bio"
              placeholder="Tell other families a bit about yourself and your family..."
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This will be visible on your public profile
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Your Location</Label>
            <div className="flex items-center bg-white rounded-md border border-gray-300 px-3 py-2">
              <MapPin className="mr-2 h-4 w-4 shrink-0 text-blue-600" />
              <AddressAutocomplete
                placeholder="Enter your general location"
                className="w-full border-none focus-visible:ring-0 p-0 shadow-none"
                defaultValue={userLocation}
                onAddressSelect={(address) => setUserLocation(address)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Your general location helps other families find toys nearby
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleSkip}
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleSaveProfile}
            disabled={uploading || updateProfileMutation.isPending}
            className="bg-blue-700 hover:bg-blue-800"
          >
            {uploading || updateProfileMutation.isPending ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                Save Profile
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}