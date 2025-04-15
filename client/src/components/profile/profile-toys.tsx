import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Edit, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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

  // Query user's toys
  const { data: toys, isLoading } = useQuery({
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

  return (
    <div className="space-y-4">
      {toys.map(toy => (
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
                        variant={toy.isAvailable ? "success" : "destructive"}
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
                
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center">
                    <Switch 
                      id={`availability-${toy.id}`}
                      checked={toy.isAvailable}
                      onCheckedChange={() => handleToggleAvailability(toy.id, toy.isAvailable)}
                      disabled={toggleAvailabilityMutation.isPending}
                    />
                    <Label 
                      htmlFor={`availability-${toy.id}`}
                      className="ml-2 cursor-pointer"
                    >
                      {toy.isAvailable ? "Available for sharing" : "Not available"}
                    </Label>
                  </div>
                  
                  <div className="text-sm text-neutral-500">
                    Posted on {new Date(toy.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

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
    </div>
  );
}
