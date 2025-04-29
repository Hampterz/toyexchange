import { useState } from "react";
import { X, Upload, AlertCircle, Tag, MapPin, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AGE_RANGES, CATEGORIES, CONDITIONS } from "@/lib/utils/constants";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { insertToySchema, COMMON_ATTRIBUTES, TOY_CATEGORIES, Toy } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TagSelector } from "@/components/ui/tag-selector";
import { AddressAutocomplete } from "@/components/address-autocomplete";
import { ToySuccessPage } from "./toy-success-page";

interface AddToyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/mov", "video/quicktime"];

// Base schema from shared schema.ts, but with adjusted validation for form use
const formSchema = insertToySchema
  .omit({ userId: true, images: true, videos: true, isAvailable: true })
  .extend({
    // Custom image upload field for the form - required
    imageFiles: z
      .instanceof(FileList, { message: "Please insert an image" })
      .refine((files) => files.length > 0, "At least one image is required")
      .refine((files) => files.length <= 4, "Maximum of 4 images allowed")
      .refine(
        (files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
        "Each image must be less than 5MB"
      )
      .refine(
        (files) => Array.from(files).every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
        "Only .jpg, .jpeg, .png and .webp formats are supported"
      ),
    // Custom video upload field for the form
    videoFiles: z
      .instanceof(FileList, { message: "Please insert a valid video file" })
      .optional()
      .refine(
        (files) => !files || files.length <= 1,
        "Maximum of 1 video allowed"
      )
      .refine(
        (files) => !files || Array.from(files).every((file) => file.size <= MAX_VIDEO_SIZE),
        "Video must be less than 50MB"
      )
      .refine(
        (files) => !files || Array.from(files).every((file) => ACCEPTED_VIDEO_TYPES.includes(file.type)),
        "Only .mp4, .webm, and .mov formats are supported"
      ),
    // Make fields required that weren't before
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    ageRanges: z.array(z.string()).min(1, "Select at least one age range"),
    condition: z.string().min(1, "Condition is required"),
    location: z.string().min(1, "Location is required"),
  });

type FormValues = z.infer<typeof formSchema>;

export function AddToyModal({ isOpen, onClose }: AddToyModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [addedToy, setAddedToy] = useState<Toy | null>(null);
  const [showSuccessPage, setShowSuccessPage] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      ageRange: "",
      ageRanges: [],
      condition: "",
      location: user?.location || "",
      tags: [],
    },
  });
  
  // Toggle a tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const addToyMutation = useMutation({
    mutationFn: async (toyData: any) => {
      try {
        const res = await fetch("/api/toys", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(toyData),
          credentials: "include"
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to create toy");
        }
        
        return await res.json();
      } catch (error: any) {
        console.error("Error posting toy:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Toy added successfully:", data);
      // Instead of closing the modal, show the success page
      setAddedToy(data);
      setShowSuccessPage(true);
      
      // Invalidate all relevant toy queries to ensure the UI is refreshed
      queryClient.invalidateQueries({ queryKey: ["/api/toys"] });
      queryClient.invalidateQueries({ queryKey: ["/api/toys/by-user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/community-metrics"] });
      
      // Only reset the form, don't close the modal
      reset();
    },
    onError: (error: any) => {
      console.error("Error in mutation:", error);
      toast({
        title: "Failed to Add Toy",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    setIsUploading(true);

    try {
      // Convert the uploaded image files to base64 strings
      const imagePromises = Array.from(data.imageFiles).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      const images = await Promise.all(imagePromises);
      setImageUrls(images);

      // Convert the uploaded video file to base64 string if exists
      let videos: string[] = [];
      if (data.videoFiles && data.videoFiles.length > 0) {
        const videoPromises = Array.from(data.videoFiles).map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
          });
        });
        
        videos = await Promise.all(videoPromises);
        setVideoUrls(videos);
      }

      // Prepare the toy data for submission
      const toyData = {
        userId: user.id,
        title: data.title,
        description: data.description,
        ageRange: data.ageRanges.join(", "), // Use the multi-select age ranges and join them
        condition: data.condition,
        category: "Other", // Default to Other as category is hidden
        location: data.location,
        images: images,
        videos: videos,
        isAvailable: true,
        tags: selectedTags,
      };

      addToyMutation.mutate(toyData);
    } catch (error) {
      toast({
        title: "Media Processing Failed",
        description: "Failed to process images or video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    form.reset();
    setImageUrls([]);
    setVideoUrls([]);
    setSelectedTags([]);
  };

  const renderMediaUploads = () => {
    const imageFiles = form.watch("imageFiles");
    const videoFiles = form.watch("videoFiles");
    
    return (
      <div className="space-y-4">
        {/* Image/Video Upload Area */}
        {(!imageFiles || imageFiles.length === 0) && (!videoFiles || videoFiles.length === 0) ? (
          <div className="border-2 border-dashed border-neutral-300 rounded-md p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-neutral-400" />
            <div className="mt-2">
              <p className="text-sm text-neutral-600">
                Upload media by clicking here or drag and drop files
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Images: PNG, JPG, WEBP (up to 4, max 5MB each)
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Video: MP4, WEBM, MOV (optional, max 50MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Images Preview */}
            {imageFiles && imageFiles.length > 0 && (
              <div>
                <p className="text-xs text-blue-700 mb-2">Photos ({imageFiles.length}/4)</p>
                <div className="grid grid-cols-2 gap-2">
                  {Array.from(imageFiles).map((file, index) => (
                    <div key={`img-${index}`} className="relative border rounded-md overflow-hidden h-24">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Video Preview */}
            {videoFiles && videoFiles.length > 0 && (
              <div>
                <p className="text-xs text-blue-700 mb-2">Video</p>
                <div className="border rounded-md overflow-hidden">
                  {Array.from(videoFiles).map((file, index) => (
                    <div key={`vid-${index}`} className="relative h-32 bg-gray-100 flex items-center justify-center">
                      <video
                        src={URL.createObjectURL(file)}
                        controls
                        className="max-h-full max-w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Handle closing the success page and resetting the state
  const handleCloseSuccess = () => {
    setShowSuccessPage(false);
    setAddedToy(null);
    onClose();
  };
  
  // Show success page if a toy was just added
  if (showSuccessPage && addedToy) {
    return (
      <ToySuccessPage 
        isOpen={showSuccessPage} 
        onClose={handleCloseSuccess} 
        toy={addedToy} 
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      {/* We don't use onOpenChange={onClose} here to prevent closing when clicking outside */}
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-white z-20 pb-4 border-b mb-4">
          <DialogTitle className="text-xl font-bold">Share a Toy</DialogTitle>
        </DialogHeader>

        {!user ? (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-700 mt-0.5 mr-2" />
                <div>
                  <h3 className="font-medium text-blue-800 mb-1">Sign in required</h3>
                  <p className="text-blue-700 mb-4">
                    You need to be signed in to share toys. Please sign in or create an account to continue.
                  </p>
                  <Button 
                    className="bg-blue-700 hover:bg-blue-800"
                    onClick={() => {
                      onClose();
                      window.location.href = '/auth';
                    }}
                  >
                    Sign In or Register
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Toy Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Building Blocks Set" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the toy, its features, and any details a parent might want to know..." 
                        rows={3} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ageRanges"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age Ranges (Select all that apply)</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
                        {AGE_RANGES.map((age) => (
                          <div key={age} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`age-${age}`}
                              checked={field.value?.includes(age)}
                              onChange={(e) => {
                                const updated = e.target.checked
                                  ? [...(field.value || []), age]
                                  : (field.value || []).filter((a) => a !== age);
                                field.onChange(updated);
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                            />
                            <label htmlFor={`age-${age}`} className="text-sm">{age}</label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CONDITIONS.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Location</FormLabel>
                    <FormControl>
                      <div className="flex items-center bg-white rounded-md border border-gray-300 px-3 py-2">
                        <MapPin className="mr-2 h-4 w-4 shrink-0 text-blue-600" />
                        <AddressAutocomplete
                          placeholder="Search for a pickup location"
                          className="w-full border-none focus-visible:ring-0 p-0 shadow-none"
                          defaultValue={field.value}
                          onAddressSelect={(address, coordinates) => {
                            field.onChange(address);
                            
                            // Update coordinates in the database when available
                            if (coordinates) {
                              // Store latitude and longitude with the toy in the future
                              console.log("Selected coordinates:", coordinates);
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                  <ImageIcon className="h-4 w-4 mr-1" /> Media Upload
                </h3>
                
                <div>
                  {/* Unified Media Upload Area */}
                  <div 
                    className="relative"
                    onClick={() => {
                      const currentImageFiles = form.watch("imageFiles");
                      const currentVideoFiles = form.watch("videoFiles");
                      // If already has images or videos, continue with that type; otherwise let them choose
                      if (currentImageFiles && currentImageFiles.length > 0) {
                        document.getElementById('image-upload')?.click();
                      } else if (currentVideoFiles && currentVideoFiles.length > 0) {
                        document.getElementById('video-upload')?.click();
                      } else {
                        document.getElementById('media-select')?.click();
                      }
                    }}
                  >
                    {renderMediaUploads()}
                  </div>
                  
                  {/* Hidden file inputs for actual uploads */}
                  <div>
                    {/* Used just for initial media type selection */}
                    <select
                      id="media-select"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.value === "image") {
                          document.getElementById('image-upload')?.click();
                        } else if (e.target.value === "video") {
                          document.getElementById('video-upload')?.click();
                        }
                      }}
                    >
                      <option value="">Select media type</option>
                      <option value="image">Upload Images</option>
                      <option value="video">Upload Video</option>
                    </select>
                    
                    <FormField
                      control={form.control}
                      name="imageFiles"
                      render={({ field: { ref, name, onBlur, onChange } }) => (
                        <FormItem className="m-0 p-0">
                          <FormControl>
                            <Input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              ref={ref}
                              name={name}
                              onBlur={onBlur}
                              onChange={(e) => {
                                onChange(e.target.files);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="videoFiles"
                      render={({ field: { ref, name, onBlur, onChange } }) => (
                        <FormItem className="m-0 p-0">
                          <FormControl>
                            <Input
                              id="video-upload"
                              type="file"
                              accept="video/mp4,video/webm,video/mov,video/quicktime"
                              className="hidden"
                              ref={ref}
                              name={name}
                              onBlur={onBlur}
                              onChange={(e) => {
                                onChange(e.target.files);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-blue-700" />
                      <span>Tags</span>
                    </FormLabel>
                    <FormControl>
                      <div className="p-1">
                        <TagSelector 
                          availableTags={COMMON_ATTRIBUTES}
                          selectedTags={selectedTags}
                          onTagsChange={setSelectedTags}
                          placeholder="Select tags to describe your toy"
                          allowCustomTags={false}
                        />
                        <FormDescription className="mt-2 text-xs text-blue-600">
                          Tags help other parents find your toy more easily
                        </FormDescription>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose} 
                  className="flex-1 border-blue-200 text-blue-800"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-700 hover:bg-blue-800" 
                  disabled={isUploading || addToyMutation.isPending}
                >
                  {isUploading || addToyMutation.isPending ? "Uploading..." : "Share Toy"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}