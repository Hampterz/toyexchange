import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Edit, Trash2, HandshakeIcon, Tag, Film } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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

interface ProfileToysProps {
  userId: number;
}

export function ProfileToys({ userId }: ProfileToysProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [toyToDelete, setToyToDelete] = useState<number | null>(null);
  const [toyToMarkAsTraded, setToyToMarkAsTraded] = useState<number | null>(null);
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
      await apiRequest("PATCH", `/api/toys/${toyId}`, { 
        status: "traded",
        isAvailable: false
      });
      
      // Update the community metrics to increment toys saved count
      await apiRequest("PATCH", "/api/community-metrics", {
        toysSaved: 1, // Increment by 1
        familiesConnected: 1 // Increment by 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/toys`] });
      queryClient.invalidateQueries({ queryKey: ['/api/community-metrics'] });
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

  const handleToggleAvailability = (toyId: number, currentAvailability: boolean) => {
    toggleAvailabilityMutation.mutate({ 
      toyId, 
      isAvailable: !currentAvailability 
    });
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

  return (
    <div className="space-y-4">
      <Tabs 
        defaultValue="active" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger 
            value="active" 
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            Active Listings ({activeToys.length})
          </TabsTrigger>
          <TabsTrigger 
            value="traded" 
            className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
          >
            Traded Toys ({tradedToys.length})
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
                              className={toy.isAvailable ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-red-100 text-red-800 hover:bg-red-100"}
                            >
                              {toy.isAvailable ? "Available" : "Not Available"}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit toy">
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
                            checked={toy.isAvailable}
                            onCheckedChange={() => handleToggleAvailability(toy.id, toy.isAvailable)}
                            disabled={toggleAvailabilityMutation.isPending}
                          />
                          <Label 
                            htmlFor={`availability-${toy.id}`}
                            className="cursor-pointer"
                          >
                            {toy.isAvailable ? "Available" : "Not available"}
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
                          Posted on {new Date(toy.createdAt).toLocaleDateString()}
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
                        
                        <div className="mt-auto flex items-center justify-between">
                          <div className="text-sm text-neutral-500">
                            <span className="text-green-700 font-medium">Traded on:</span> {new Date(toy.createdAt).toLocaleDateString()}
                          </div>
                          
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
    </div>
  );
}
