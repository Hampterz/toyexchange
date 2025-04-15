import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Toy } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertToyRequestSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";

interface RequestToyModalProps {
  toy: Toy;
  isOpen: boolean;
  onClose: () => void;
}

export function RequestToyModal({ toy, isOpen, onClose }: RequestToyModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [preferredLocation, setPreferredLocation] = useState(toy.location);
  const [acceptedGuidelines, setAcceptedGuidelines] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestToyMutation = useMutation({
    mutationFn: async (requestData: any) => {
      const res = await apiRequest("POST", `/api/toys/${toy.id}/request`, requestData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Request Sent!",
        description: "The toy owner has been notified of your interest.",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Request Failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to request toys",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message for the toy owner",
        variant: "destructive",
      });
      return;
    }

    if (!acceptedGuidelines) {
      toast({
        title: "Guidelines required",
        description: "Please accept the community guidelines",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData = {
        message,
        preferredLocation,
      };

      requestToyMutation.mutate(requestData);
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Request Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Request Toy</DialogTitle>
          <Button
            variant="ghost"
            className="absolute right-4 top-4 rounded-sm opacity-70 h-auto p-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-md overflow-hidden bg-neutral-100">
              {toy.images && toy.images.length > 0 ? (
                <img 
                  src={toy.images[0]} 
                  alt={toy.title} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <i className="fas fa-image text-2xl"></i>
                </div>
              )}
            </div>
            <div>
              <h4 className="font-bold font-heading">{toy.title}</h4>
              <p className="text-sm text-neutral-600">
                {user ? `Posted by another parent` : "Sign in to request this toy"}
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="message" className="font-medium text-neutral-700 mb-2">
              Why are you interested in this toy?
            </Label>
            <Textarea 
              id="message"
              placeholder="Tell the owner a bit about why you'd like this toy..." 
              className="mt-2"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!user}
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="location" className="font-medium text-neutral-700 mb-2">
              Preferred pickup location
            </Label>
            <Select 
              value={preferredLocation} 
              onValueChange={setPreferredLocation}
              disabled={!user}
            >
              <SelectTrigger id="location" className="w-full mt-2">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={toy.location}>
                  Owner's suggested location ({toy.location})
                </SelectItem>
                <SelectItem value="Suggest alternate public location">
                  Suggest alternate public location
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="guidelines" 
                checked={acceptedGuidelines}
                onCheckedChange={(checked) => setAcceptedGuidelines(checked as boolean)}
                disabled={!user}
              />
              <Label htmlFor="guidelines" className="text-sm text-neutral-700">
                I have read and agree to the <a href="#" className="text-primary hover:underline">Community Guidelines</a>
              </Label>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90" 
              onClick={handleSubmit}
              disabled={isSubmitting || !user || !message || !acceptedGuidelines}
            >
              {isSubmitting ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
