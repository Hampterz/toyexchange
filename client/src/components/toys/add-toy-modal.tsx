import { useState } from "react";
import { X, Upload, AlertCircle, Tag, MapPin, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
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
// Greatly simplified schema with minimal validation for the form
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  ageRanges: z.array(z.string()).default([]),
  condition: z.string().default("Like New"),
  location: z.string().min(1, "Location is required"),
  imageFiles: z.any(),
  videoFiles: z.any().optional(),
  tags: z.array(z.string()).default([])
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
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [addedToy, setAddedToy] = useState<Toy | null>(null);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [locationCoordinates, setLocationCoordinates] = useState<{latitude: number, longitude: number} | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      ageRange: "",
      ageRanges: [],
      condition: "Like New", // Set default condition
      location: user?.location || "",
      tags: [],
      // These will be set when files are uploaded
      imageFiles: undefined,
      videoFiles: undefined
    },
    mode: "onSubmit" // Only validate on submit
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
    
    // Check if we have image files
    if (!data.imageFiles || data.imageFiles.length === 0) {
      toast({
        title: "Image Required",
        description: "Please upload at least one image of your toy.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    console.log("Submitting form data:", data);
    console.log("Form errors:", form.formState.errors);
    console.log("Selected tags:", selectedTags);

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
        condition: data.condition || "Like New", // Use default if not set
        category: "Other", // Default to Other as category is hidden
        location: data.location,
        // Include coordinates when available
        latitude: locationCoordinates?.latitude || null,
        longitude: locationCoordinates?.longitude || null,
        images: images,
        videos: videos,
        isAvailable: true,
        tags: selectedTags,
      };

      console.log("Submitting toy data:", toyData);
      addToyMutation.mutate(toyData);
    } catch (error) {
      console.error("Error processing form submission:", error);
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
          <div className="border-2 border-dashed border-blue-200 rounded-md p-6 text-center bg-blue-50 hover:bg-blue-100 transition-colors">
            <Upload className="mx-auto h-12 w-12 text-blue-600" />
            <div className="mt-2">
              <p className="text-sm font-medium text-blue-800">
                Click here to add images
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Upload up to 4 photos (PNG, JPG, WEBP)
              </p>
              <p className="text-xs text-blue-700 mt-1 font-bold">
                Required: At least one image
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Images Preview */}
            {imageFiles && imageFiles.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-blue-700">Photos ({imageFiles.length}/4)</p>
                  {imageFiles.length < 4 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="text-blue-700 border-blue-200 py-0 h-6 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById('image-upload')?.click();
                      }}
                    >
                      Add More Images
                    </Button>
                  )}
                </div>
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
                
                {/* Form validation feedback */}
                {Object.keys(form.formState.errors).includes('imageFiles') && (
                  <p className="text-sm font-medium text-red-600 mt-2">
                    {form.formState.errors.imageFiles?.message as string}
                  </p>
                )}
              </div>
            )}
            
            {/* Video Preview */}
            {videoFiles && videoFiles.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-blue-700">Video</p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    className="text-red-700 border-red-200 py-0 h-6 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      form.setValue("videoFiles", undefined);
                    }}
                  >
                    Remove Video
                  </Button>
                </div>
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
                
                {/* Form validation feedback */}
                {Object.keys(form.formState.errors).includes('videoFiles') && (
                  <p className="text-sm font-medium text-red-600 mt-2">
                    {form.formState.errors.videoFiles?.message as string}
                  </p>
                )}
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
    
    // Use queryClient to invalidate and refetch all relevant queries
    queryClient.invalidateQueries({ queryKey: ['/api/toys'] });
    queryClient.invalidateQueries({ queryKey: ['/api/toys/by-user'] });
    queryClient.invalidateQueries({ queryKey: ['/api/community-metrics'] });
    // Also invalidate any queries that might include our location/distance parameters
    queryClient.invalidateQueries({ queryKey: ['/api/toys?'] });
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-hidden p-0">
        <div className="sticky top-0 bg-white border-b py-4 px-6 z-20 w-full flex justify-between items-center">
          <DialogTitle className="text-xl font-bold">Share a Toy</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="overflow-y-auto p-6 max-h-[calc(90vh-80px)]">
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
              <form onSubmit={(e) => {
                // Prevent default form submission
                e.preventDefault();
                
                // Direct manual submission without any validation
                const formData = {
                  title: form.getValues().title || "Untitled Toy",
                  description: form.getValues().description || "No description provided",
                  ageRanges: form.getValues().ageRanges || ["0-12 months"],
                  condition: form.getValues().condition || "Like New",
                  location: form.getValues().location || user?.location || "Location not specified",
                  imageFiles: form.getValues().imageFiles,
                  videoFiles: form.getValues().videoFiles,
                  tags: selectedTags
                };
                
                // Bypass form validation and submit directly 
                if (!formData.imageFiles || (formData.imageFiles as any).length === 0) {
                  toast({
                    title: "Image Required",
                    description: "Please upload at least one image of your toy.",
                    variant: "destructive",
                  });
                  return;
                }
                
                console.log("Manual form submission:", formData);
                onSubmit(formData as FormValues);
                
              }} className="space-y-4">
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
                                // Also update form value directly to ensure it's properly updated
                                form.setValue('ageRanges', updated, { shouldValidate: true });
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                            />
                            <label htmlFor={`age-${age}`} className="text-sm">{age}</label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-blue-600">
                      Please select at least one age range
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Condition</FormLabel>
                <div className="relative">
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={form.getValues().condition || "Like New"}
                    onChange={(e) => {
                      form.setValue("condition", e.target.value);
                    }}
                  >
                    <option value="" disabled>Select condition</option>
                    {CONDITIONS.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>
                <FormDescription className="text-xs mt-1">
                  Like New = No visible wear / Gently Used = Minor wear / Used = Some visible wear / Well Loved = Significant wear but functional
                </FormDescription>
                <FormMessage />
              </FormItem>

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
                              // Store latitude and longitude with the toy
                              console.log("Selected coordinates:", coordinates);
                              setLocationCoordinates(coordinates);
                            } else {
                              setLocationCoordinates(null);
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
                  {/* Simplified Media Upload Area */}
                  <div 
                    className="relative cursor-pointer"
                    onClick={() => {
                      // Always open the image upload dialog directly - simplifies the experience
                      document.getElementById('image-upload')?.click();
                    }}
                  >
                    {renderMediaUploads()}
                  </div>
                  
                  {/* Hidden file inputs for actual uploads */}
                  <div>
                    {/* Video upload option is still available via a separate button */}
                    <div className="mt-2 text-center">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="text-blue-700 border-blue-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById('video-upload')?.click();
                        }}
                      >
                        Add Video (Optional)
                      </Button>
                    </div>
                    
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
                                if (e.target.files && e.target.files.length > 0) {
                                  // Create a DataTransfer object to build a new FileList
                                  const dataTransfer = new DataTransfer();
                                  
                                  // Add existing URLs to the list for preview
                                  const newImageUrls = [...imageUrls];
                                  
                                  // Add new files
                                  Array.from(e.target.files).forEach(file => {
                                    dataTransfer.items.add(file);
                                    
                                    // Create URL for preview
                                    const url = URL.createObjectURL(file);
                                    if (!newImageUrls.includes(url)) {
                                      newImageUrls.push(url);
                                    }
                                  });
                                  
                                  // Ensure we don't exceed 4 images maximum
                                  while (dataTransfer.files.length > 4) {
                                    dataTransfer.items.remove(dataTransfer.items.length - 1);
                                    if (newImageUrls.length > 4) {
                                      newImageUrls.pop();
                                    }
                                  }
                                  
                                  // Update image previews
                                  setImageUrls(newImageUrls.slice(0, 4));
                                  
                                  // Update the form with the combined files
                                  onChange(dataTransfer.files);
                                } else {
                                  onChange(e.target.files);
                                }
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
                        {/* Simple Tag Selector */}
                        <div className="mb-2">
                          <div className="relative w-full">
                            <Button
                              type="button"
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between text-left font-normal"
                              onClick={() => setShowTagSelector(!showTagSelector)}
                            >
                              <div className="flex items-center">
                                <Tag className="mr-2 h-4 w-4 shrink-0" />
                                <span>Select Tags ({selectedTags.length || 0})</span>
                              </div>
                            </Button>
                            
                            {/* Dropdown for tag selection */}
                            {showTagSelector && (
                              <>
                                <div 
                                  className="fixed inset-0 z-0"
                                  onClick={() => setShowTagSelector(false)}
                                ></div>
                                <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                                  <div className="max-h-60 overflow-auto p-2">
                                    {COMMON_ATTRIBUTES.map(tag => (
                                      <div 
                                        key={tag}
                                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                        onClick={() => toggleTag(tag)}
                                      >
                                        <input 
                                          type="checkbox" 
                                          checked={selectedTags.includes(tag)}
                                          readOnly
                                          className="h-4 w-4 mr-2 text-blue-700 border-blue-300 rounded-full focus:ring-blue-500 checkbox-pop cursor-pointer transform transition-transform duration-200 hover:scale-110"
                                        />
                                        <span>{tag}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          
                          {/* Show selected tags and allow removal */}
                          {selectedTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {selectedTags.map(tag => (
                                <Badge 
                                  key={tag} 
                                  variant="default"
                                  className="cursor-pointer py-1 px-3 transition-all bg-blue-100 text-blue-800 hover:bg-blue-200"
                                  onClick={() => toggleTag(tag)}
                                >
                                  #{tag} <X className="ml-1 h-3 w-3" />
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
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
                  onClick={(e) => {
                    if (isUploading || addToyMutation.isPending) return;
                    
                    // Submit form
                    const formElement = e.currentTarget.closest('form');
                    if (formElement) {
                      formElement.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                    }
                  }}
                >
                  {isUploading || addToyMutation.isPending ? "Uploading..." : "Share Toy"}
                </Button>
              </div>
            </form>
          </Form>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
}