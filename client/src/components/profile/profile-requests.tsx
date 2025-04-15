import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export function ProfileRequests() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query requests received (as owner)
  const { data: receivedRequests, isLoading: isLoadingReceived } = useQuery({
    queryKey: ["/api/requests/received"],
    enabled: !!user,
  });

  // Query requests made (as requester)
  const { data: madeRequests, isLoading: isLoadingMade } = useQuery({
    queryKey: ["/api/requests/made"],
    enabled: !!user,
  });

  // Update request status mutation
  const updateRequestMutation = useMutation({
    mutationFn: async ({ requestId, status }: { requestId: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/requests/${requestId}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests/received"] });
      queryClient.invalidateQueries({ queryKey: ["/api/requests/made"] });
      toast({
        title: "Request Updated",
        description: "The toy request status has been updated",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update request status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (requestId: number) => {
    updateRequestMutation.mutate({ requestId, status: "approved" });
  };

  const handleReject = (requestId: number) => {
    updateRequestMutation.mutate({ requestId, status: "rejected" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    }
  };

  const isLoading = isLoadingReceived || isLoadingMade;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if ((!receivedRequests || receivedRequests.length === 0) && 
      (!madeRequests || madeRequests.length === 0)) {
    return (
      <div className="text-center py-16 bg-neutral-50 rounded-lg border border-neutral-200">
        <i className="fas fa-inbox text-neutral-300 text-5xl mb-4"></i>
        <h2 className="text-xl font-semibold mb-2">No requests yet</h2>
        <p className="text-neutral-600 mb-6">
          When you request toys or others request your toys, they'll appear here
        </p>
        <Button 
          onClick={() => window.location.href = "/"} 
          className="bg-primary hover:bg-primary/90"
        >
          Browse Toys
        </Button>
      </div>
    );
  }

  return (
    <Tabs defaultValue="received">
      <TabsList className="mb-4 w-full grid grid-cols-2">
        <TabsTrigger value="received">
          Requests to You
          {receivedRequests && receivedRequests.length > 0 && (
            <span className="ml-2 bg-orange-500 text-white text-xs py-0.5 px-2 rounded-full">
              {receivedRequests.filter(req => req.status === "pending").length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="made">
          Your Requests
          {madeRequests && madeRequests.length > 0 && (
            <span className="ml-2 bg-neutral-200 text-neutral-800 text-xs py-0.5 px-2 rounded-full">
              {madeRequests.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="received">
        {!receivedRequests || receivedRequests.length === 0 ? (
          <div className="text-center py-8 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-neutral-600">No requests received yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {receivedRequests.map(request => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">Request for your toy</h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-neutral-600 mb-2">
                        Message: "{request.message}"
                      </p>
                      <p className="text-xs text-neutral-500">
                        Requested on {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {request.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => handleReject(request.id)}
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          disabled={updateRequestMutation.isPending}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Decline
                        </Button>
                        <Button 
                          onClick={() => handleApprove(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={updateRequestMutation.isPending}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="made">
        {!madeRequests || madeRequests.length === 0 ? (
          <div className="text-center py-8 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-neutral-600">You haven't requested any toys yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {madeRequests.map(request => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">Your request</h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-neutral-600 mb-2">
                        Your message: "{request.message}"
                      </p>
                      <p className="text-xs text-neutral-500">
                        Requested on {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {request.status === "approved" && (
                      <Button>
                        Contact Owner
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
