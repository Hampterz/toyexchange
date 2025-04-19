import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, CheckCircle2, XCircle, User, MessageSquare, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function ReportsManagement() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [adminNote, setAdminNote] = useState("");
  
  // Redirect if not admin
  if (user && user.username !== "adminsreyas") {
    navigate("/");
    return null;
  }
  
  const { data: reports, isLoading, error } = useQuery({
    queryKey: ["/api/reports"],
    queryFn: undefined,
    enabled: !!user
  });
  
  const updateReportStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      // This would be a real API call in the actual implementation
      return { id, status };
    },
    onSuccess: () => {
      toast({
        title: "Report status updated",
        description: "The report status has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      setAdminNote("");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update report",
        description: "There was an error updating the report status.",
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
      description: "Failed to load reports. Please try again later."
    });
  }
  
  const getReportsByStatus = (status: string) => {
    return reports?.filter(report => report.status === status) || [];
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "investigating": return "bg-blue-100 text-blue-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "dismissed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case "user": return <User className="h-4 w-4" />;
      case "message": return <MessageSquare className="h-4 w-4" />;
      case "toy": return <Flag className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };
  
  const handleStatusChange = (reportId: number, newStatus: string) => {
    updateReportStatusMutation.mutate({ id: reportId, status: newStatus });
  };
  
  return (
    <div className="container py-8">
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold">Reports Management</h1>
        <p className="text-muted-foreground">Review and handle user reports</p>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList className="w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="pending" className="flex-1">
            Pending
            <Badge variant="secondary" className="ml-2">
              {getReportsByStatus("pending").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="investigating" className="flex-1">
            Investigating
            <Badge variant="secondary" className="ml-2">
              {getReportsByStatus("investigating").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="resolved" className="flex-1">
            Resolved
          </TabsTrigger>
          <TabsTrigger value="dismissed" className="flex-1">
            Dismissed
          </TabsTrigger>
        </TabsList>
        
        {["pending", "investigating", "resolved", "dismissed"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-6">
            {getReportsByStatus(status).length > 0 ? (
              getReportsByStatus(status).map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getReportTypeIcon(report.reportType)}
                          {report.reportType.charAt(0).toUpperCase() + report.reportType.slice(1)} Report #{report.id}
                        </CardTitle>
                        <CardDescription>
                          Reported {new Date(report.createdAt).toLocaleString()}
                        </CardDescription>
                      </div>
                      <Badge 
                        className={getStatusBadgeColor(report.status)}
                      >
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-2">Report Details</h3>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <span className="font-medium text-sm w-24">Reporter:</span>
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-1">
                                <AvatarFallback>{report.reporter?.name?.charAt(0) || '?'}</AvatarFallback>
                              </Avatar>
                              <span>{report.reporter?.name || 'Unknown'}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-medium text-sm w-24">Reported:</span>
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-1">
                                <AvatarFallback>{report.reportedItem?.name?.charAt(0) || '?'}</AvatarFallback>
                              </Avatar>
                              <span>{report.reportedItem?.name || `${report.reportType} #${report.reportedItemId}`}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-medium text-sm w-24">Reason:</span>
                            <span>{report.reason}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="font-medium text-sm w-24">Description:</span>
                            <p className="text-sm">{report.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Admin Actions</h3>
                        {status === "resolved" || status === "dismissed" ? (
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <span className="font-medium text-sm w-24">Reviewed by:</span>
                              <span>{report.reviewedBy === user?.id ? 'You' : `Admin #${report.reviewedBy}`}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="font-medium text-sm w-24">Reviewed on:</span>
                              <span>{new Date(report.reviewedAt).toLocaleString()}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="font-medium text-sm w-24">Admin Note:</span>
                              <p className="text-sm">{report.adminNote || 'No notes added'}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium mb-1 block">
                                Update Status
                              </label>
                              <Select 
                                value={report.status} 
                                onValueChange={(value) => handleStatusChange(report.id, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="investigating">Investigating</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                  <SelectItem value="dismissed">Dismissed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium mb-1 block">
                                Admin Note
                              </label>
                              <Textarea 
                                placeholder="Add notes about this report" 
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                              />
                            </div>
                            
                            <div className="flex gap-2">
                              {report.status === "pending" && (
                                <Button 
                                  variant="default" 
                                  className="flex items-center gap-1"
                                  onClick={() => handleStatusChange(report.id, "investigating")}
                                >
                                  Start Investigation
                                </Button>
                              )}
                              
                              {(report.status === "pending" || report.status === "investigating") && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    className="flex items-center gap-1 text-green-600"
                                    onClick={() => handleStatusChange(report.id, "resolved")}
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Resolve
                                  </Button>
                                  
                                  <Button 
                                    variant="outline" 
                                    className="flex items-center gap-1 text-red-600"
                                    onClick={() => handleStatusChange(report.id, "dismissed")}
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Dismiss
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">No {status} reports</h3>
                <p className="text-muted-foreground max-w-md mt-2">
                  {status === "pending" 
                    ? "There are no pending reports that need your attention." 
                    : `There are no reports with status "${status}".`}
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}