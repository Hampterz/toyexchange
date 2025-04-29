import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from 'wouter';

interface MessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiverId: number;
  receiverName: string;
  toyId?: number;
  toyName?: string;
}

export function MessageDialog({
  open,
  onOpenChange,
  receiverId,
  receiverName,
  toyId = 0,
  toyName = ""
}: MessageDialogProps) {
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isSending, setIsSending] = useState(false);

  // Send a message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/messages", {
        receiverId,
        content: message,
        toyId: toyId || 0,
        read: false
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${receiverName}`,
      });
      setMessage("");
      onOpenChange(false);
      
      // Invalidate queries to refresh messages
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${receiverId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Message",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSending(false);
    }
  });

  const handleSendMessage = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to send messages",
        variant: "default"
      });
      onOpenChange(false);
      navigate("/auth");
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message to send",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    sendMessageMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Message to {receiverName}
            {toyName && <span className="text-blue-600"> about {toyName}</span>}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea
            placeholder="Write your message here..."
            className="min-h-[120px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage} 
            disabled={isSending || !message.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSending ? "Sending..." : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}