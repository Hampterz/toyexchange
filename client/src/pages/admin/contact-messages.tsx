import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Clock, User, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ContactMessages() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  
  // Redirect if not admin
  if (user && user.username !== "adminsreyas") {
    navigate("/");
    return null;
  }
  
  const { data: contactMessages, isLoading, error } = useQuery({
    queryKey: ["/api/contact-messages"],
    queryFn: undefined,
    enabled: !!user
  });
  
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      // This would be a real API call in the actual implementation
      return { id, read: true };
    },
    onSuccess: () => {
      toast({
        title: "Message marked as read",
        description: "The contact message has been marked as read.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contact-messages"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update message",
        description: "There was an error marking the message as read.",
      });
    }
  });
  
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
      description: "Failed to load contact messages. Please try again later."
    });
  }
  
  return (
    <div className="container py-8">
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <p className="text-muted-foreground">Review and respond to user inquiries</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contactMessages && contactMessages.length > 0 ? (
          contactMessages.map((message) => (
            <Card key={message.id} className={`overflow-hidden transition-all ${!message.read ? 'border-blue-300 shadow-md' : ''}`}>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-blue-800">{message.subject}</CardTitle>
                  <Badge variant={message.read ? "outline" : "default"}>
                    {message.read ? "Read" : "New"}
                  </Badge>
                </div>
                <CardDescription className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(message.createdAt).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="font-medium">{message.name}</span>
                    </div>
                    <div className="flex items-center">
                      <AtSign className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="text-sm text-blue-700">{message.email}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-blue-800 line-clamp-3">{message.message}</p>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-blue-700 border-blue-200"
                      onClick={() => setSelectedMessage(message)}
                    >
                      View Full Message
                    </Button>
                    {!message.read && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-700"
                        onClick={() => markAsReadMutation.mutate(message.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <Mail className="h-16 w-16 text-blue-300 mb-4" />
            <h3 className="text-xl font-semibold text-blue-800">No Contact Messages</h3>
            <p className="text-blue-600 max-w-md mt-2">
              There are no contact messages from users at this time.
            </p>
          </div>
        )}
      </div>
      
      {/* Message dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-blue-800">{selectedMessage?.subject}</DialogTitle>
            <DialogDescription className="flex justify-between">
              <span>{selectedMessage?.name} ({selectedMessage?.email})</span>
              <span>{selectedMessage && new Date(selectedMessage?.createdAt).toLocaleString()}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-blue-50 p-4 rounded-md my-4">
            <p className="whitespace-pre-wrap text-blue-900">{selectedMessage?.message}</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-blue-700">Response</h4>
            <Textarea 
              placeholder="Type your response here..." 
              className="min-h-[120px]"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setSelectedMessage(null)}>
              Cancel
            </Button>
            <Button className="w-full sm:w-auto">
              Send Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="mt-8">
        <Button variant="outline" onClick={() => navigate("/admin/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}