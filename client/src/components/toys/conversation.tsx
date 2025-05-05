import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";
import { Send, Loader2, Trash2, Flag } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Message, User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ConversationProps {
  userId: number;
  otherUserId: number;
  otherUser: User | undefined;
}

export function Conversation({ userId, otherUserId, otherUser }: ConversationProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState<string>("");
  const [messageToReport, setMessageToReport] = useState<number | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  
  // Check if the user is blocked
  useQuery({
    queryKey: [`/api/user-blocks/check/${otherUserId}`],
    enabled: !!otherUserId,
    queryFn: async () => {
      try {
        const res = await fetch(`/api/user-blocks/check/${otherUserId}`, {
          credentials: 'include'
        });
        if (!res.ok) {
          return false;
        }
        const data = await res.json();
        setIsBlocked(data.isBlocked);
        return data.isBlocked;
      } catch (error) {
        console.error("Error checking block status:", error);
        return false;
      }
    }
  });
  
  // Get messages between the two users
  const { data: messages, isLoading, refetch } = useQuery<Message[]>({
    queryKey: [`/api/messages/${otherUserId}`],
    enabled: !!otherUserId,
    queryFn: async () => {
      const res = await fetch(`/api/messages/${otherUserId}`, {
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error('Failed to fetch messages');
      }
      return res.json();
    },
    refetchInterval: 1000, // Auto-refetch every 1 second to get new messages
  });

  // Send a new message
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            receiverId: otherUserId,
            content,
            toyId: 0, // This is required by the schema but may not be relevant for direct messages
            read: false
          })
        });
        
        if (!res.ok) {
          throw new Error("Failed to send message");
        }
        
        return await res.json();
      } catch (error) {
        console.error("Message send error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      setNewMessage("");
      // Immediately refetch the messages to show the new message
      // No delay needed anymore since we've reduced the polling interval
      refetch();
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${otherUserId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: (error) => {
      console.error("Message send error:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: number) => {
      try {
        const res = await apiRequest("DELETE", `/api/messages/${messageId}`);
        return res.ok;
      } catch (error) {
        console.error("Message delete error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Refetch messages after deletion
      refetch();
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${otherUserId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      
      toast({
        title: "Message deleted",
        description: "Your message has been removed",
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete message",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  });

  // Mark messages as read
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      try {
        // Use the apiRequest utility for better error handling
        const response = await apiRequest("PATCH", `/api/messages/${messageId}/read`, { read: true });
        return await response.json();
      } catch (error) {
        console.error("Mark as read error:", error);
        // Don't throw the error, just log it to prevent unhandled promise rejections
        return { success: false, error };
      }
    },
    onSuccess: () => {
      // No delay needed - immediately update the UI
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${otherUserId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: (error) => {
      console.error("Mark as read error:", error);
      // We'll handle the error silently to prevent disrupting the user experience
    }
  });
  
  // Report message mutation
  const reportMessageMutation = useMutation({
    mutationFn: async ({ messageId, reason }: { messageId: number; reason: string }) => {
      try {
        const res = await apiRequest("POST", `/api/reports`, {
          targetId: messageId,
          targetType: "message",
          reason,
          details: `Reported message from user ${otherUserId}`
        });
        return await res.json();
      } catch (error) {
        console.error("Report message error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      setIsReportDialogOpen(false);
      setMessageToReport(null);
      setReportReason("");
      
      toast({
        title: "Message reported",
        description: "Thank you for helping to keep our community safe",
      });
    },
    onError: () => {
      toast({
        title: "Failed to report message",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  });

  // Mark unread messages as read when conversation is opened
  useEffect(() => {
    if (messages && messages.length > 0) {
      // Use a single-fire effect to avoid infinite loops
      const unreadMessages = messages.filter(message => 
        message.receiverId === userId && !message.read
      );
      
      if (unreadMessages.length > 0) {
        // Process each message with a small delay to avoid overwhelming the server
        unreadMessages.forEach((message, index) => {
          setTimeout(() => {
            try {
              markAsReadMutation.mutate(message.id);
            } catch (error) {
              console.error(`Failed to mark message ${message.id} as read:`, error);
            }
          }, index * 50); // Reduced delay to 50ms between requests
        });
      }
    }
  }, [messages?.length, userId]);

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessageMutation.mutate(newMessage);
    }
  };

  if (isLoading) {
    return (
      <Card className="h-[500px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  // Handle opening the report dialog
  const handleReportMessage = (messageId: number) => {
    setMessageToReport(messageId);
    setIsReportDialogOpen(true);
  };

  // Handle submitting the report
  const handleSubmitReport = () => {
    if (!messageToReport || !reportReason) return;
    
    reportMessageMutation.mutate({
      messageId: messageToReport,
      reason: reportReason
    });
  };

  return (
    <Card className="h-[600px] flex flex-col shadow-none border-none">
      <CardHeader className="border-b px-4 py-3 flex-shrink-0 bg-white">
        <div className="flex items-center space-x-3">
          <AvatarWithFallback user={otherUser || undefined} className="border-2 border-blue-100" />
          <div>
            <h3 className="font-medium">{otherUser?.name || "User"}</h3>
            {otherUser?.locationPrivacy === 'exact_location' && (
              <p className="text-xs text-muted-foreground">{otherUser.location}</p>
            )}
            {otherUser?.locationPrivacy === 'city_only' && (
              <p className="text-xs text-muted-foreground">{otherUser.cityName || otherUser.location?.split(',')[0]}</p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {!messages || messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-muted-foreground">
            <div>
              <p>No messages yet</p>
              <p className="text-sm">Send a message to start the conversation</p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isSentByMe = message.senderId === userId;
            
            return (
              <div 
                key={message.id}
                className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isSentByMe && (
                  <div className="mr-2 self-end mb-1">
                    <AvatarWithFallback user={otherUser || undefined} className="h-6 w-6" />
                  </div>
                )}
                
                <div className="relative group">
                  {/* Message content */}
                  <div 
                    className={`max-w-[75%] group relative ${
                      isSentByMe 
                        ? 'bg-primary text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-lg rounded-tr-lg rounded-br-lg shadow-sm'
                    } px-4 py-2`}
                  >
                    <p>{message.content}</p>
                  </div>

                  {/* Three dots menu icon that appears on hover */}
                  <div 
                    className="absolute top-0 right-0 transform translate-x-[calc(100%+4px)] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      const dropdown = e.currentTarget.nextElementSibling;
                      if (dropdown) {
                        dropdown.classList.toggle('hidden');
                      }
                    }}
                  >
                    <div className="p-1 rounded-full hover:bg-gray-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Dropdown menu for message actions */}
                  <div className="absolute z-10 top-0 right-0 transform translate-x-[calc(100%+24px)] hidden bg-white rounded-md shadow-md border border-gray-200 text-sm">
                    <ul className="py-1">
                      {isSentByMe ? (
                        <li 
                          className="px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer flex items-center"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this message?")) {
                              deleteMessageMutation.mutate(message.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </li>
                      ) : (
                        <li 
                          className="px-4 py-2 hover:bg-amber-50 text-amber-600 cursor-pointer flex items-center"
                          onClick={() => handleReportMessage(message.id)}
                        >
                          <Flag className="h-4 w-4 mr-2" />
                          Report
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  {/* Timestamp and read status outside the bubble */}
                  <div className={`text-xs mt-1 px-1 ${isSentByMe ? 'text-right text-gray-500' : 'text-gray-500'}`}>
                    {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    {isSentByMe && (
                      <span className="ml-2 text-[10px] text-blue-500">
                        {message.read ? "Read" : "Delivered"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      
      <CardFooter className="border-t p-3 bg-white">
        {isBlocked ? (
          <div className="w-full text-center py-2 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
            You cannot send messages to this user because they have blocked you.
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
            <Textarea
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                // Send message on Enter without Shift key
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (newMessage.trim() && !sendMessageMutation.isPending) {
                    handleSendMessage(e);
                  }
                }
              }}
              className="flex-1 min-h-[50px] max-h-[100px] border-gray-200 focus-visible:ring-primary resize-none"
            />
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90 self-end rounded-full h-10 w-10 p-0 shadow-md"
              disabled={!newMessage.trim() || sendMessageMutation.isPending}
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        )}
      </CardFooter>

      {/* Report Message Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Message</DialogTitle>
            <DialogDescription>
              Please select a reason for reporting this message. This will be reviewed by our moderation team.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <Select 
              value={reportReason} 
              onValueChange={setReportReason}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inappropriate_content">Inappropriate Content</SelectItem>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="spam">Spam</SelectItem>
                <SelectItem value="scam">Scam/Fraud</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitReport}
              disabled={!reportReason || reportMessageMutation.isPending}
              className="ml-2"
            >
              {reportMessageMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
