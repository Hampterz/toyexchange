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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
    // Custom image upload field for the form
    imageFiles: z
      .instanceof(FileList)
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
      .instanceof(FileList)
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
  const [customTag, setCustomTag] = useState<string>("");
  const [addedToy, setAddedToy] = useState<Toy | null>(null);
  const [showSuccessPage, setShowSuccessPage] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      ageRange: "",
      condition: "",
      category: "",
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
  
  // Add a custom tag
  const addCustomTag = () => {
    if (customTag.trim() === "" || selectedTags.includes(customTag.trim())) {
      return;
    }
    
    setSelectedTags(prev => [...prev, customTag.trim()]);
    setCustomTag("");
  };

  const addToyMutation = useMutation({
    mutationFn: async (toyData: any) => {
      const res = await apiRequest("POST", "/api/toys", toyData);
      return await res.json();
    },
    onSuccess: (data) => {
      // Instead of closing the modal, show the success page
      setAddedToy(data);
      setShowSuccessPage(true);
      
      queryClient.invalidateQueries({ queryKey: ["/api/toys"] });
      
      // Only reset the form, don't close the modal
      reset();
    },
    onError: (error: any) => {
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
        ageRange: data.ageRange,
        condition: data.condition,
        category: data.category,
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

  const renderImagePreview = () => {
    const files = form.watch("imageFiles");
    
    if (!files || files.length === 0) {
      return (
        <div className="border-2 border-dashed border-neutral-300 rounded-md p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-neutral-400" />
          <div className="mt-2">
            <p className="text-sm text-neutral-600">
              Drag and drop up to 4 images, or click to upload
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              PNG, JPG, WEBP up to 5MB
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-2">
        {Array.from(files).map((file, index) => (
          <div key={index} className="relative border rounded-md overflow-hidden h-24">
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    );
  };
  
  const renderVideoPreview = () => {
    const files = form.watch("videoFiles");
    
    if (!files || files.length === 0) {
      return (
        <div className="border-2 border-dashed border-neutral-300 rounded-md p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-neutral-400" />
          <div className="mt-2">
            <p className="text-sm text-neutral-600">
              Add a video of the toy in action
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              MP4, WEBM, MOV up to 50MB
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="border rounded-md overflow-hidden">
        {Array.from(files).map((file, index) => (
          <div key={index} className="relative h-32 bg-gray-100 flex items-center justify-center">
            <video
              src={URL.createObjectURL(file)}
              controls
              className="max-h-full max-w-full"
            />
          </div>
        ))}
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ageRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age Range</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select age range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {AGE_RANGES.map((age) => (
                            <SelectItem key={age} value={age}>
                              {age}
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
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
              </div>

              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                  <ImageIcon className="h-4 w-4 mr-1" /> Media Upload
                </h3>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="imageFiles"
                    render={({ field: { ref, name, onBlur, onChange } }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-blue-700">Photos (Up to 4)</FormLabel>
                        <FormControl>
                          <div className="cursor-pointer" onClick={() => document.getElementById('image-upload')?.click()}>
                            {renderImagePreview()}
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
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="videoFiles"
                    render={({ field: { ref, name, onBlur, onChange } }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-blue-700">Video (Optional)</FormLabel>
                        <FormControl>
                          <div className="cursor-pointer" onClick={() => document.getElementById('video-upload')?.click()}>
                            {renderVideoPreview()}
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
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
