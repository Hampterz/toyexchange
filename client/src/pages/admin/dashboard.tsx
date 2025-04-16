import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, getQueryFn, apiRequest } from "@/lib/queryClient";
import { Toy, ContactMessage } from "@shared/schema";
import { Loader2, Trash2, XCircle, CheckCircle, MessageSquare, Package, ShieldAlert } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedToy, setSelectedToy] = useState<Toy | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Redirect if not an admin
  useEffect(() => {
    if (user && user.username !== "adminsreyas") {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access the admin dashboard.",
        variant: "destructive",
      });
      window.location.href = '/';
    }
  }, [user, toast]);

  // Fetch all contact messages
  const { 
    data: contactMessages, 
    isLoading: isLoadingMessages 
  } = useQuery({
    queryKey: ['/api/contact-messages'],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && user.username === "adminsreyas"
  });

  // Fetch all toys for management
  const { 
    data: toys, 
    isLoading: isLoadingToys 
  } = useQuery({
    queryKey: ['/api/toys/all'],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && user.username === "adminsreyas"
  });

  // Delete toy mutation
  const deleteToyMutation = useMutation({
    mutationFn: async (toyId: number) => {
      const response = await apiRequest("DELETE", `/api/toys/${toyId}`);
      if (!response.ok) {
        throw new Error("Failed to delete toy");
      }
      return toyId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/toys/all'] });
      toast({
        title: "Toy Deleted",
        description: "The toy has been successfully removed.",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleDeleteToy = (toy: Toy) => {
    setSelectedToy(toy);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteToy = () => {
    if (selectedToy) {
      deleteToyMutation.mutate(selectedToy.id);
    }
  };

  if (!user || user.username !== "adminsreyas") {
    return (
      <div className="container mx-auto py-8 text-center">
        <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-6">You do not have permission to access this page.</p>
        <Button onClick={() => window.location.href = '/'}>Return Home</Button>
      </div>
    );
  }

  if (isLoadingMessages || isLoadingToys) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Loading admin dashboard...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Admin Dashboard</h1>
      
      <Tabs defaultValue="messages" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="messages" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Support Messages
          </TabsTrigger>
          <TabsTrigger value="toys" className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            Manage Toys
          </TabsTrigger>
        </TabsList>
        
        {/* Support Messages Tab */}
        <TabsContent value="messages">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">User Support Messages</h2>
          {contactMessages && contactMessages.length > 0 ? (
            <div className="grid gap-4">
              {contactMessages.map((message: ContactMessage) => (
                <Card key={message.id} className="p-4 bg-white shadow-md border-t-4 border-blue-500">
                  <div className="mb-2 flex justify-between">
                    <h3 className="font-semibold">{message.name}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-600">Email: </span>
                    <a href={`mailto:${message.email}`} className="text-blue-600 hover:underline">
                      {message.email}
                    </a>
                  </div>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p>{message.message}</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No support messages to display.</p>
            </div>
          )}
        </TabsContent>
        
        {/* Manage Toys Tab */}
        <TabsContent value="toys">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Manage Toy Listings</h2>
          {toys && toys.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-lg">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-blue-800">Title</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-blue-800">Category</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-blue-800">Condition</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-blue-800">Location</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-blue-800">Status</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-blue-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {toys.map((toy: Toy) => (
                    <tr key={toy.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{toy.title}</td>
                      <td className="py-3 px-4 text-sm">{toy.category}</td>
                      <td className="py-3 px-4 text-sm">{toy.condition}</td>
                      <td className="py-3 px-4 text-sm">{toy.location}</td>
                      <td className="py-3 px-4 text-sm">
                        {toy.isAvailable ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" /> Available
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center">
                            <XCircle className="h-3 w-3 mr-1" /> Unavailable
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex items-center"
                          onClick={() => handleDeleteToy(toy)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No toy listings to display.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Toy Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the toy listing "{selectedToy?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteToy} className="bg-red-600 hover:bg-red-700">
              {deleteToyMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;