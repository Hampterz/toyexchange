import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Edit, Trash2, Tag, Upload, RefreshCw } from "lucide-react";
import { HandshakeIcon } from "@/components/ui/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Toy } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ProfileToysProps {
  userId: number;
}

export function ProfileToys({ userId }: ProfileToysProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [toyToDelete, setToyToDelete] = useState<number | null>(null);
  const [toyToMarkAsTraded, setToyToMarkAsTraded] = useState<number | null>(null);
  const [toyToEdit, setToyToEdit] = useState<Toy | null>(null);
  const [toyToReactivate, setToyToReactivate] = useState<number | null>(null);
  const [editedToyTitle, setEditedToyTitle] = useState<string>("");
  const [editedToyDescription, setEditedToyDescription] = useState<string>("");
  const [editedToyAgeRange, setEditedToyAgeRange] = useState<string>("");
  const [editedToyCondition, setEditedToyCondition] = useState<string>("");
  const [editedToyImages, setEditedToyImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("active");

  // Query user's toys
  const { data: toys, isLoading } = useQuery<Toy[]>({
    queryKey: [`/api/users/${userId}/toys`],
  });

  // Delete toy mutation
  const deleteToyMutation = useMutation({
    mutationFn: async (toyId: number) => {
      await apiRequest("DELETE", `/api/toys/${toyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/toys`] });
      toast({
        title: "Toy Deleted",
        description: "Your toy listing has been successfully removed",
      });
      setToyToDelete(null);
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete the toy. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Toggle toy availability mutation
  const toggleAvailabilityMutation = useMutation({
    mutationFn: async ({ toyId, isAvailable }: { toyId: number; isAvailable: boolean }) => {
      await apiRequest("PATCH", `/api/toys/${toyId}`, { isAvailable });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/toys`] });
      toast({
        title: "Availability Updated",
        description: "Your toy's availability has been updated",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update availability. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Mark toy as traded mutation
  const markAsTradedMutation = useMutation({
    mutationFn: async (toyId: number) => {
      // Update the toy status
      await apiRequest("PATCH", `/api/toys/${toyId}`, { 
        status: "traded",
        isAvailable: false
      });
      
      // Update the community metrics to increment toys saved count
      await apiRequest("PATCH", "/api/community-metrics", {
        toysSaved: 1, // Increment by 1
        familiesConnected: 1 // Increment by 1
      });
      
      // Update user exchange count
      await apiRequest("PATCH", `/api/users/${userId}`, {
        successfulExchanges: 1
      });
    },
    onSuccess: () => {
      // Invalidate queries to update UI
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/toys`] });
      queryClient.invalidateQueries({ queryKey: ['/api/community-metrics'] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
      
      toast({
        title: "Toy Marked as Traded",
        description: "Thank you for sharing and making a difference!",
      });
      setToyToMarkAsTraded(null);
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to mark toy as traded. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Unmark toy as traded mutation
  const unmarkTradedMutation = useMutation({
    mutationFn: async (toyId: number) => {
      // Update the toy status back to active
      await apiRequest("PATCH", `/api/toys/${toyId}`, { 
        status: "active",
        isAvailable: true
      });
      
      // Update the community metrics to decrement toys saved count
      await apiRequest("PATCH", "/api/community-metrics", {
        toysSaved: -1, // Decrement by 1
        familiesConnected: -1 // Decrement by 1
      });
      
      // Update user exchange count
      await apiRequest("PATCH", `/api/users/${userId}`, {
        successfulExchanges: -1
      });
    },
    onSuccess: () => {
      // Invalidate queries to update UI
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/toys`] });
      queryClient.invalidateQueries({ queryKey: ['/api/community-metrics'] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
      
      toast({
        title: "Toy Marked as Active",
        description: "Your toy is now back in active listings.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to reactivate toy. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Reactivate toy mutation
  const reactivateToyMutation = useMutation({
    mutationFn: async (toyId: number) => {
      await apiRequest("POST", `/api/toys/${toyId}/reactivate`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/toys`] });
      toast({
        title: "Toy Reactivated",
        description: "Your toy listing has been successfully reactivated",
      });
      setToyToReactivate(null);
    },
    onError: () => {
      toast({
        title: "Reactivation Failed",
        description: "Failed to reactivate the toy. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Edit toy mutation
  const editToyMutation = useMutation({
    mutationFn: async (params: { toyId: number, updates: Partial<Toy> }) => {
      await apiRequest("PATCH", `/api/toys/${params.toyId}`, params.updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/toys`] });
      toast({
        title: "Toy Updated",
        description: "Your toy listing has been successfully updated",
      });
      setToyToEdit(null);
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update the toy. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleToggleAvailability = (toyId: number, currentAvailability: boolean) => {
    toggleAvailabilityMutation.mutate({ 
      toyId, 
      isAvailable: !currentAvailability 
    });
  };
  
  const handleEditToy = (toy: Toy) => {
    setToyToEdit(toy);
    setEditedToyTitle(toy.title);
    setEditedToyDescription(toy.description || "");
    setEditedToyAgeRange(toy.ageRange || "");
    setEditedToyCondition(toy.condition || "");
    setEditedToyImages(toy.images || []);
    setNewImageFiles(null);
  };
  
  const handleSaveEditedToy = async () => {
    if (!toyToEdit) return;
    
    setIsUploading(true);
    
    try {
      // Prepare updates object with basic text fields
      const updates: Partial<Toy> = {
        title: editedToyTitle,
        description: editedToyDescription,
        ageRange: editedToyAgeRange,
        condition: editedToyCondition
      };
      
      // Process new image uploads if any
      if (newImageFiles && newImageFiles.length > 0) {
        const imagePromises = Array.from(newImageFiles).map(file => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
          });
        });
        
        const newImages = await Promise.all(imagePromises);
        
        // Combine existing images with new ones
        updates.images = [...editedToyImages, ...newImages];
      } else if (editedToyImages.length > 0) {
        // Keep current images if no new ones uploaded
        updates.images = editedToyImages;
      }
      
      editToyMutation.mutate({
        toyId: toyToEdit.id,
        updates
      });
    } catch (error) {
      console.error("Error processing images:", error);
      toast({
        title: "Image Processing Failed",
        description: "Failed to process images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setEditedToyImages(current => current.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!toys || toys.length === 0) {
    return (
      <div className="text-center py-16 bg-neutral-50 rounded-lg border border-neutral-200">
        <i className="fas fa-box-open text-neutral-300 text-5xl mb-4"></i>
        <h2 className="text-xl font-semibold mb-2">No toys listed yet</h2>
        <p className="text-neutral-600 mb-6">
          Share your unused toys with other families in your community
        </p>
        <Button className="bg-primary hover:bg-primary/90">
          <i className="fas fa-plus mr-2"></i> Add Your First Toy
        </Button>
      </div>
    );
  }

  // Filter toys based on status
  const activeToys = Array.isArray(toys) ? toys.filter(toy => toy.status === 'active') : [];
  const tradedToys = Array.isArray(toys) ? toys.filter(toy => toy.status === 'traded') : [];
  const inactiveToys = Array.isArray(toys) ? toys.filter(toy => toy.status === 'inactive') : [];

  return (
    <div className="space-y-4">
      <Tabs 
        defaultValue="active" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger 
            value="active" 
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            Active ({activeToys.length})
          </TabsTrigger>
          <TabsTrigger 
            value="inactive" 
            className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700"
          >
            Inactive ({inactiveToys.length})
          </TabsTrigger>
          <TabsTrigger 
            value="traded" 
            className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
          >
            Traded ({tradedToys.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4 space-y-4">
          {activeToys.length === 0 ? (
            <div className="text-center py-8 bg-blue-50 rounded-lg">
              <p className="text-blue-700">You don't have any active toy listings.</p>
            </div>
          ) : (
            activeToys.map(toy => (
              <Card key={toy.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/3 h-48 sm:h-auto bg-neutral-100">
                      {toy.images && toy.images.length > 0 ? (
                        <img 
                          src={toy.images[0]} 
                          alt={toy.title} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <i className="fas fa-image text-4xl"></i>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 sm:w-2/3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg mb-1">{toy.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline">{toy.category}</Badge>
                            <Badge variant="outline">Ages {toy.ageRange}</Badge>
                            <Badge variant="outline">{toy.condition}</Badge>
                            <Badge 
                              variant={!!toy.isAvailable ? "default" : "destructive"}
                              className={!!toy.isAvailable ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-red-100 text-red-800 hover:bg-red-100"}
                            >
                              {!!toy.isAvailable ? "Available" : "Not Available"}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => handleEditToy(toy)}
                            title="Edit toy"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive" 
                            onClick={() => setToyToDelete(toy.id)}
                            title="Delete toy"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                        {toy.description}
                      </p>
                      
                      <div className="mt-auto flex flex-wrap justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id={`availability-${toy.id}`}
                            checked={!!toy.isAvailable}
                            onCheckedChange={() => handleToggleAvailability(toy.id, !!toy.isAvailable)}
                            disabled={toggleAvailabilityMutation.isPending}
                          />
                          <Label 
                            htmlFor={`availability-${toy.id}`}
                            className="cursor-pointer"
                          >
                            {!!toy.isAvailable ? "Available" : "Not available"}
                          </Label>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="mt-2 sm:mt-0 text-green-700 border-green-200 bg-green-50 hover:bg-green-100"
                          onClick={() => setToyToMarkAsTraded(toy.id)}
                        >
                          <HandshakeIcon className="h-4 w-4 mr-2" />
                          Mark as Traded
                        </Button>
                        
                        <div className="mt-2 sm:mt-0 text-sm text-neutral-500 w-full sm:w-auto">
                          Posted on {toy.createdAt ? new Date(toy.createdAt).toLocaleDateString() : 'Unknown date'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="inactive" className="mt-4 space-y-4">
          {inactiveToys.length === 0 ? (
            <div className="text-center py-8 bg-amber-50 rounded-lg">
              <p className="text-amber-700">You don't have any inactive toy listings.</p>
            </div>
          ) : (
            inactiveToys.map(toy => (
              <Card key={toy.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-amber-900/10 z-10 flex items-center justify-center">
                      <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-lg font-bold transform -rotate-6 shadow-md">
                        Inactive
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-1/3 h-48 sm:h-auto bg-neutral-100">
                        {toy.images && toy.images.length > 0 ? (
                          <img 
                            src={toy.images[0]} 
                            alt={toy.title} 
                            className="w-full h-full object-cover filter grayscale opacity-75" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            <i className="fas fa-image text-4xl"></i>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 sm:w-2/3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg mb-1">{toy.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant="outline">{toy.category}</Badge>
                              <Badge variant="outline">Ages {toy.ageRange}</Badge>
                              <Badge variant="outline">{toy.condition}</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                          {toy.description}
                        </p>
                        
                        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                          <div className="text-sm text-neutral-500">
                            <span className="text-amber-700 font-medium">Inactive since:</span> {toy.lastActivityDate ? new Date(toy.lastActivityDate).toLocaleDateString() : 'Unknown date'}
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              onClick={() => setToyToReactivate(toy.id)}
                              disabled={reactivateToyMutation.isPending}
                            >
                              {reactivateToyMutation.isPending ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <RefreshCw className="h-4 w-4 mr-2" />
                              )}
                              Reactivate
                            </Button>

                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-500"
                              onClick={() => setToyToDelete(toy.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="traded" className="mt-4 space-y-4">
          {tradedToys.length === 0 ? (
            <div className="text-center py-8 bg-green-50 rounded-lg">
              <p className="text-green-700">You haven't traded any toys yet.</p>
            </div>
          ) : (
            tradedToys.map(toy => (
              <Card key={toy.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-green-900/10 z-10 flex items-center justify-center">
                      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-lg font-bold transform -rotate-6 shadow-md">
                        Traded
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-1/3 h-48 sm:h-auto bg-neutral-100">
                        {toy.images && toy.images.length > 0 ? (
                          <img 
                            src={toy.images[0]} 
                            alt={toy.title} 
                            className="w-full h-full object-cover filter grayscale opacity-75" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            <i className="fas fa-image text-4xl"></i>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 sm:w-2/3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg mb-1">{toy.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant="outline">{toy.category}</Badge>
                              <Badge variant="outline">Ages {toy.ageRange}</Badge>
                              <Badge variant="outline">{toy.condition}</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                          {toy.description}
                        </p>
                        
                        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                          <div className="text-sm text-neutral-500">
                            <span className="text-green-700 font-medium">Traded on:</span> {toy.createdAt ? new Date(toy.createdAt).toLocaleDateString() : 'Unknown date'}
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                unmarkTradedMutation.mutate(toy.id);
                              }}
                              disabled={unmarkTradedMutation.isPending}
                            >
                              {unmarkTradedMutation.isPending ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Tag className="h-4 w-4 mr-2" />
                              )}
                              Mark as Active
                            </Button>

                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-500"
                              onClick={() => setToyToDelete(toy.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Toy Dialog */}
      <AlertDialog open={toyToDelete !== null} onOpenChange={() => setToyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this toy listing. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toyToDelete !== null) {
                  deleteToyMutation.mutate(toyToDelete);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteToyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Toy"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mark as Traded Dialog */}
      <AlertDialog open={toyToMarkAsTraded !== null} onOpenChange={() => setToyToMarkAsTraded(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Traded</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark your toy as "Traded" and remove it from active listings. This action also 
              increases our community impact metrics.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toyToMarkAsTraded !== null) {
                  markAsTradedMutation.mutate(toyToMarkAsTraded);
                }
              }}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {markAsTradedMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <HandshakeIcon className="mr-2 h-4 w-4" />
                  Confirm Trade
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reactivate Toy Dialog */}
      <AlertDialog open={toyToReactivate !== null} onOpenChange={() => setToyToReactivate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reactivate Toy</AlertDialogTitle>
            <AlertDialogDescription>
              This will make your toy listing active again, and it will appear in search results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toyToReactivate !== null) {
                  reactivateToyMutation.mutate(toyToReactivate);
                }
              }}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {reactivateToyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reactivate Toy
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Toy Dialog */}
      <Dialog open={toyToEdit !== null} onOpenChange={(open) => !open && setToyToEdit(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Toy Listing</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editedToyTitle}
                onChange={(e) => setEditedToyTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedToyDescription}
                onChange={(e) => setEditedToyDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ageRange">Age Range</Label>
                <Input
                  id="ageRange"
                  value={editedToyAgeRange}
                  onChange={(e) => setEditedToyAgeRange(e.target.value)}
                  placeholder="e.g. 3-5"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="condition">Condition</Label>
                <Input
                  id="condition"
                  value={editedToyCondition}
                  onChange={(e) => setEditedToyCondition(e.target.value)}
                  placeholder="e.g. Like New"
                />
              </div>
            </div>
            
            {/* Image Management Section */}
            <div className="grid gap-2">
              <Label>Images</Label>
              
              {/* Current Images */}
              {editedToyImages && editedToyImages.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium mb-2">Current Images</div>
                  <div className="grid grid-cols-2 gap-3">
                    {editedToyImages.map((image, index) => (
                      <div key={index} className="relative border rounded-md overflow-hidden h-36 group">
                        <img
                          src={image}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            className="p-1 bg-white bg-opacity-90 rounded-full text-red-600 hover:text-red-800 hover:bg-white"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No images currently uploaded</div>
              )}
              
              {/* New Image Upload */}
              <Input
                id="edit-image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setNewImageFiles(e.target.files);
                  }
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('edit-image-upload')?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {editedToyImages.length > 0 ? "Add More Images" : "Upload Images"}
              </Button>
              
              {/* Preview New Images */}
              {newImageFiles && newImageFiles.length > 0 && (
                <div className="space-y-2 mt-4">
                  <div className="text-sm font-medium">New Images to Upload</div>
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from(newImageFiles).map((file, index) => (
                      <div key={`new-${index}`} className="relative border rounded-md overflow-hidden h-36">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Availability Toggle */}
            {toyToEdit && (
              <div className="flex items-center space-x-2">
                <Label htmlFor="edit-availability" className="text-sm">
                  Availability:
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="edit-availability"
                    checked={!!toyToEdit.isAvailable}
                    onCheckedChange={(checked) => {
                      if (toyToEdit) {
                        handleToggleAvailability(toyToEdit.id, !!toyToEdit.isAvailable);
                      }
                    }}
                    disabled={toggleAvailabilityMutation.isPending}
                  />
                  <Label 
                    htmlFor="edit-availability"
                    className="cursor-pointer text-sm"
                  >
                    {!!toyToEdit.isAvailable ? "Available" : "Not available"}
                  </Label>
                </div>
                <div className="text-xs text-muted-foreground ml-4">
                  {!!toyToEdit.isAvailable 
                    ? "This toy is visible to others" 
                    : "This toy is hidden from search results"}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleSaveEditedToy}
              disabled={editToyMutation.isPending || isUploading || !editedToyTitle}
            >
              {(editToyMutation.isPending || isUploading) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
