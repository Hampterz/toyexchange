import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { insertWishSchema } from "@shared/schema";
import { COMMON_ATTRIBUTES } from "@shared/schema";
import { AddressAutocomplete } from "@/components/address-autocomplete";
import { PageHeader } from "@/components/page-header";
import { Loader2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

// Create a separate validation schema that extends the insert schema
// with client-side specific validations
const createWishSchema = insertWishSchema.extend({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(20, "Description must be at least 20 characters").max(1000, "Description must be less than 1000 characters"),
  location: z.string().min(1, "Location is required"),
  ageRange: z.string().min(1, "Age range is required"),
  // Category field removed
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).min(1, "Please add at least one tag"),
});

// Type inferred from schema
type CreateWishValues = z.infer<typeof createWishSchema>;

function CreateWishPageContent() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const queryClient = useQueryClient();

  // Set up form with validation
  const form = useForm<CreateWishValues>({
    resolver: zodResolver(createWishSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      ageRange: "",
      tags: [],
      images: [],
      latitude: null,
      longitude: null,
    },
  });

  // Create wish mutation
  const createWishMutation = useMutation({
    mutationFn: async (data: CreateWishValues) => {
      const response = await apiRequest("POST", "/api/wishes", data);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate wishes query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/wishes"] });
      toast({
        title: "Wish Created!",
        description: "Your wish has been successfully created.",
      });
      setLocation("/wishes");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create wish",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: CreateWishValues) => {
    // Add the selected tags to the form data
    data.tags = selectedTags;
    
    // Add user ID to the form data
    data.userId = user!.id;
    
    // Submit the form data
    createWishMutation.mutate(data);
  };

  // Handle adding a tag
  const addTag = () => {
    if (newTag && !selectedTags.includes(newTag)) {
      const updatedTags = [...selectedTags, newTag];
      setSelectedTags(updatedTags);
      form.setValue("tags", updatedTags);
      setNewTag("");
    }
  };

  // Handle removing a tag
  const removeTag = (tag: string) => {
    const updatedTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(updatedTags);
    form.setValue("tags", updatedTags);
  };

  // Handle adding a common tag
  const addCommonTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const updatedTags = [...selectedTags, tag];
      setSelectedTags(updatedTags);
      form.setValue("tags", updatedTags);
    }
  };

  // Handle location selection
  const handleAddressSelect = (
    address: string,
    coordinates?: { latitude: number; longitude: number }
  ) => {
    form.setValue("location", address);
    if (coordinates) {
      form.setValue("latitude", coordinates.latitude);
      form.setValue("longitude", coordinates.longitude);
    }
  };

  return (
    <div className="container py-6 space-y-6 mb-12">
      <PageHeader
        title="Create a Wish"
        description="Let others know what toy you're looking for!"
        rightContent={
          <Button variant="outline" onClick={() => setLocation("/wishes")}>
            Cancel
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Main form content */}
        <Card>
          <CardHeader>
            <CardTitle>Wish Details</CardTitle>
            <CardDescription>
              Provide details about the toy you're wishing for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wish Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Looking for a wooden train set"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Be specific about what you're looking for
                      </FormDescription>
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
                          placeholder="Describe the toy you're looking for in detail..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include details like condition, brand, or features you're
                        looking for
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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
                            <SelectItem value="0-12 months">
                              0-12 months
                            </SelectItem>
                            <SelectItem value="1-2 years">1-2 years</SelectItem>
                            <SelectItem value="3-5 years">3-5 years</SelectItem>
                            <SelectItem value="6-8 years">6-8 years</SelectItem>
                            <SelectItem value="9-12 years">
                              9-12 years
                            </SelectItem>
                            <SelectItem value="13+ years">13+ years</SelectItem>
                            <SelectItem value="All Ages">All Ages</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <AddressAutocomplete
                          onAddressSelect={handleAddressSelect}
                          defaultValue={field.value}
                          placeholder="Enter your location"
                        />
                      </FormControl>
                      <FormDescription>
                        This helps connect you with people nearby
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {selectedTags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {tag}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => removeTag(tag)}
                              >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remove tag</span>
                              </Button>
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Input
                            placeholder="Add custom tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addTag();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={addTag}
                            variant="outline"
                            className="shrink-0"
                          >
                            Add
                          </Button>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-2">
                            Common attributes:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {COMMON_ATTRIBUTES.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="cursor-pointer hover:bg-secondary"
                                onClick={() => addCommonTag(tag)}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/wishes")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createWishMutation.isPending}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
                  >
                    {createWishMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Wish"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Guidelines sidebar */}
        <Card>
          <CardHeader>
            <CardTitle>Wish Guidelines</CardTitle>
            <CardDescription>
              Tips for creating an effective wish
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Be Specific</h3>
              <p className="text-sm text-muted-foreground">
                Clearly describe what you're looking for, including brand,
                model, or specific features.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Add Relevant Tags</h3>
              <p className="text-sm text-muted-foreground">
                Tags help others find your wish when searching.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Include Your Location</h3>
              <p className="text-sm text-muted-foreground">
                This helps match you with local families.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Be Responsive</h3>
              <p className="text-sm text-muted-foreground">
                Check for offers regularly and respond promptly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Export a protected version of the page
export default function CreateWishPage() {
  return <ProtectedRoute path="/wishes/create" component={CreateWishPageContent} />;
}