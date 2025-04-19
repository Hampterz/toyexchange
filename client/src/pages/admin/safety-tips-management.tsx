import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit, Trash2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { useState } from "react";

export default function SafetyTipsManagement() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [selectedTip, setSelectedTip] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general",
    priority: "normal"
  });
  
  // Redirect if not admin
  if (user && user.username !== "adminsreyas") {
    navigate("/");
    return null;
  }
  
  const { data: safetyTips, isLoading, error } = useQuery({
    queryKey: ["/api/safety-tips"],
    queryFn: undefined,
    enabled: !!user
  });
  
  const addSafetyTipMutation = useMutation({
    mutationFn: async (tipData: typeof formData) => {
      // This would be a real API call in the actual implementation
      return { id: Date.now(), ...tipData, createdAt: new Date() };
    },
    onSuccess: () => {
      toast({
        title: "Safety tip added",
        description: "The safety tip has been successfully added.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/safety-tips"] });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to add safety tip",
        description: "There was an error adding the safety tip.",
      });
    }
  });
  
  const updateSafetyTipMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: typeof formData }) => {
      // This would be a real API call in the actual implementation
      return { id, ...data, updatedAt: new Date() };
    },
    onSuccess: () => {
      toast({
        title: "Safety tip updated",
        description: "The safety tip has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/safety-tips"] });
      setIsEditDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update safety tip",
        description: "There was an error updating the safety tip.",
      });
    }
  });
  
  const deleteSafetyTipMutation = useMutation({
    mutationFn: async (id: number) => {
      // This would be a real API call in the actual implementation
      return { id };
    },
    onSuccess: () => {
      toast({
        title: "Safety tip deleted",
        description: "The safety tip has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/safety-tips"] });
      setIsDeleteDialogOpen(false);
      setSelectedTip(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to delete safety tip",
        description: "There was an error deleting the safety tip.",
      });
    }
  });
  
  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "general",
      priority: "normal"
    });
    setSelectedTip(null);
  };
  
  const handleAddTip = () => {
    if (!formData.title || !formData.content) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    addSafetyTipMutation.mutate(formData);
  };
  
  const handleUpdateTip = () => {
    if (!selectedTip || !formData.title || !formData.content) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    updateSafetyTipMutation.mutate({ id: selectedTip.id, data: formData });
  };
  
  const handleDeleteTip = () => {
    if (!selectedTip) return;
    deleteSafetyTipMutation.mutate(selectedTip.id);
  };
  
  const openEditDialog = (tip: any) => {
    setSelectedTip(tip);
    setFormData({
      title: tip.title,
      content: tip.content,
      category: tip.category,
      priority: tip.priority
    });
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (tip: any) => {
    setSelectedTip(tip);
    setIsDeleteDialogOpen(true);
  };
  
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "normal": return "bg-blue-100 text-blue-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "meeting": return "bg-purple-100 text-purple-800";
      case "online": return "bg-yellow-100 text-yellow-800";
      case "toy": return "bg-pink-100 text-pink-800";
      case "general": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  if (isLoading) {
    return (
      <div className="container py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load safety tips. Please try again later."
    });
  }
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Safety Tips Management</h1>
          <p className="text-muted-foreground">Manage safety tips for users</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Safety Tip
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Safety Tip</DialogTitle>
              <DialogDescription>
                Create a new safety tip to help users stay safe on the platform.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Safety tip title" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  placeholder="Safety tip content" 
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="meeting">Meeting Safety</SelectItem>
                      <SelectItem value="online">Online Safety</SelectItem>
                      <SelectItem value="toy">Toy Safety</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTip}>
                Add Tip
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safetyTips && safetyTips.length > 0 ? (
          safetyTips.map((tip: any) => (
            <Card key={tip.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>{tip.title}</CardTitle>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openEditDialog(tip)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openDeleteDialog(tip)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm">{tip.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 border-t">
                <Badge className={getCategoryBadgeColor(tip.category)}>
                  {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
                </Badge>
                <Badge className={getPriorityBadgeColor(tip.priority)}>
                  {tip.priority.charAt(0).toUpperCase() + tip.priority.slice(1)} Priority
                </Badge>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <ShieldAlert className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No safety tips yet</h3>
            <p className="text-muted-foreground text-center max-w-md mt-2">
              Add safety tips to help users stay safe when exchanging toys and meeting other families.
            </p>
            <Button 
              className="mt-4 flex items-center gap-2"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add First Safety Tip
            </Button>
          </div>
        )}
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Safety Tip</DialogTitle>
            <DialogDescription>
              Update this safety tip information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input 
                id="edit-title" 
                placeholder="Safety tip title" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea 
                id="edit-content" 
                placeholder="Safety tip content" 
                rows={5}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="meeting">Meeting Safety</SelectItem>
                    <SelectItem value="online">Online Safety</SelectItem>
                    <SelectItem value="toy">Toy Safety</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger id="edit-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTip}>
              Update Tip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Safety Tip</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this safety tip? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTip && (
            <div className="py-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>{selectedTip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{selectedTip.content}</p>
                </CardContent>
              </Card>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTip}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}