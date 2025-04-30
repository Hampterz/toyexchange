import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Users, Package, AlertTriangle, MessageSquare, 
  Trash2, Eye, CheckCircle, XCircle, 
  BarChart3, PieChart, TrendingUp, Shield
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getQueryFn, queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User, Toy, Report, ContactMessage, Message } from "@shared/schema";

// Define interfaces for structured data
interface AdminUser extends User {
  totalToys?: number;
  joinDate?: string;
}

interface AdminToy extends Toy {
  userName?: string;
}

// Message context interface for report details dialog
interface MessageContext {
  targetMessage: Message;
  contextMessages: Message[];
  targetIndex: number;
  sender: { id: number; name: string; username: string } | null;
  receiver: { id: number; name: string; username: string } | null;
  report: Report;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  
  // Resolve report mutation
  const resolveReportMutation = useMutation({
    mutationFn: async (reportId: number) => {
      const res = await apiRequest("PATCH", `/api/admin/reports/${reportId}/resolve`, {
        status: "resolved",
        reviewedBy: user?.id
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Report resolved",
        description: "The report has been marked as resolved.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reports"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to resolve report",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.username !== "adminsreyas") {
      navigate("/");
    } else if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const { 
    data: users = [] as AdminUser[], 
    isLoading: usersLoading 
  } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && user.username === "adminsreyas",
  });

  const { 
    data: toys = [] as AdminToy[], 
    isLoading: toysLoading 
  } = useQuery<AdminToy[]>({
    queryKey: ["/api/admin/toys"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && user.username === "adminsreyas",
  });

  const { 
    data: reports = [] as Report[], 
    isLoading: reportsLoading 
  } = useQuery<Report[]>({
    queryKey: ["/api/admin/reports"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && user.username === "adminsreyas",
  });

  const { 
    data: contactMessages = [] as ContactMessage[], 
    isLoading: contactLoading 
  } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin/contact-messages"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && user.username === "adminsreyas",
  });
  
  // Fetch report context for selected report
  const {
    data: reportContext,
    isLoading: contextLoading
  } = useQuery<MessageContext>({
    queryKey: ["/api/admin/reports", selectedReportId, "context"],
    queryFn: async () => {
      if (!selectedReportId) throw new Error("No report selected");
      const res = await apiRequest("GET", `/api/admin/reports/${selectedReportId}/context`);
      return res.json();
    },
    enabled: !!selectedReportId && !!user && user.username === "adminsreyas",
  });

  // Admin mutations
  // Delete toy mutation
  const deleteToyMutation = useMutation({
    mutationFn: async (toyId: number) => {
      await apiRequest("DELETE", `/api/admin/toys/${toyId}`);
    },
    onSuccess: () => {
      toast({
        title: "Toy deleted",
        description: "The toy has been successfully removed.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/toys"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete toy",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      await apiRequest("DELETE", `/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      toast({
        title: "User deleted",
        description: "The user has been successfully removed from the platform.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete user",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Use the actual data from the server API endpoints
  // We already have users, toys, reports and contactMessages data from the queries above

  // Platform statistics from real API data - no fake numbers or calculations
  const stats = {
    totalUsers: users.length,
    totalToys: toys.length,
    newUsersThisWeek: users.filter((u: AdminUser) => {
      if (!u.createdAt) return false;
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(u.createdAt instanceof Date ? u.createdAt : String(u.createdAt)) > oneWeekAgo;
    }).length,
    newToysThisWeek: toys.filter((t: AdminToy) => {
      if (!t.createdAt) return false;
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(t.createdAt instanceof Date ? t.createdAt : String(t.createdAt)) > oneWeekAgo;
    }).length,
    // Only count toys marked as not available as truly exchanged
    toysExchanged: toys.filter((t: AdminToy) => !t.isAvailable).length
  };

  if (!user || usersLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-100 rounded-full mb-4"></div>
          <div className="h-6 w-48 bg-blue-100 rounded mb-4"></div>
          <div className="h-4 w-64 bg-blue-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (user.username !== "adminsreyas") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access the admin dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col">
        <div className="flex items-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <Shield className="h-8 w-8 text-blue-700" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-800">Admin Dashboard</h1>
            <p className="text-blue-600">Manage users, toys, and platform settings</p>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="mb-12" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="toys">Toys</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-700 text-lg flex items-center">
                    <Users className="mr-2 h-5 w-5" /> Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-800">{stats.totalUsers}</div>
                  <p className="text-sm text-blue-600 mt-1">+{stats.newUsersThisWeek} this week</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-700 text-lg flex items-center">
                    <Package className="mr-2 h-5 w-5" /> Toys
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-800">{stats.totalToys}</div>
                  <p className="text-sm text-blue-600 mt-1">+{stats.newToysThisWeek} this week</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-700 text-lg flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" /> Exchanged Toys
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-800">{stats.toysExchanged}</div>
                  <p className="text-sm text-blue-600 mt-1">Toys marked as unavailable</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-700 text-lg flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" /> Total Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-800">{reports.length}</div>
                  <p className="text-sm text-blue-600 mt-1">{reports.filter(r => r.status === "pending").length} pending</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-blue-800">Recent Activity</CardTitle>
                  <CardDescription>Latest platform interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  {users.length === 0 && toys.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-blue-600">No activity recorded yet.</p>
                      <p className="text-sm text-blue-500 mt-2">Activity will appear here as users interact with the platform.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Event</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.slice(0, 3).map((user, index) => (
                          <TableRow key={`user-${user.id}`}>
                            <TableCell className="font-medium">New User Registered</TableCell>
                            <TableCell>{user.name || user.username}</TableCell>
                            <TableCell>{user.createdAt ? new Date(user.createdAt instanceof Date ? user.createdAt : String(user.createdAt)).toLocaleString() : 'Unknown'}</TableCell>
                          </TableRow>
                        ))}
                        {toys.slice(0, 3).map((toy, index) => (
                          <TableRow key={`toy-${toy.id}`}>
                            <TableCell className="font-medium">New Toy Listed</TableCell>
                            <TableCell>{users.find(u => u.id === toy.userId)?.name || `User #${toy.userId}`}</TableCell>
                            <TableCell>{toy.createdAt ? new Date(toy.createdAt instanceof Date ? toy.createdAt : String(toy.createdAt)).toLocaleString() : 'Unknown'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-800">Sustainability Impact</CardTitle>
                  <CardDescription>Environmental benefits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Toys Reused</span>
                    <span className="font-bold text-blue-800">{stats.toysExchanged}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">User Engagement</span>
                    <span className="font-bold text-blue-800">{users.length > 0 ? Math.round((toys.length / users.length) * 10) / 10 : 0} toys/user</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Community Size</span>
                    <span className="font-bold text-blue-800">{users.length} users</span>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-2">Badge Distribution</h4>
                    {users.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-blue-600">No users with badges yet.</p>
                        <p className="text-sm text-blue-500 mt-1">Users earn badges by sharing toys and completing exchanges.</p>
                      </div>
                    ) : (
                      <>
                        {Object.entries(
                          users.reduce((acc, user) => {
                            const badge = user.currentBadge || "Newcomer";
                            acc[badge] = (acc[badge] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        ).map(([badge, count]) => {
                          const percentage = Math.round((count / users.length) * 100);
                          let color = "bg-gray-400";
                          
                          switch(badge) {
                            case "Newcomer": color = "bg-gray-400"; break;
                            case "Eco Friend": color = "bg-green-500"; break;
                            case "Sustainability Hero": color = "bg-blue-500"; break;
                            case "Earth Guardian": color = "bg-indigo-500"; break;
                            case "Planet Protector": color = "bg-purple-500"; break;
                          }
                          
                          return (
                            <div key={badge}>
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-blue-700">{badge}</span>
                                <span className="font-medium text-blue-800">{percentage}%</span>
                              </div>
                              <div className="w-full bg-blue-100 rounded-full h-2 mb-3">
                                <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-800">Contact Messages</CardTitle>
                  <CardDescription>Recent support inquiries</CardDescription>
                </CardHeader>
                <CardContent>
                  {contactMessages && contactMessages.slice(0, 2).map((message) => (
                    <div key={message.id} className="mb-4 pb-4 border-b border-blue-100 last:border-0 last:mb-0 last:pb-0">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-blue-700">{message.subject}</h4>
                        <Badge variant="outline" className="text-xs">
                          {message.createdAt ? new Date(message.createdAt instanceof Date ? message.createdAt : String(message.createdAt)).toLocaleDateString() : 'Unknown'}
                        </Badge>
                      </div>
                      <p className="text-sm text-blue-600 mt-1 line-clamp-2">{message.message}</p>
                      <div className="flex justify-between mt-2 text-xs text-blue-600">
                        <span>{message.name}</span>
                        <span>{message.email}</span>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2 text-blue-700 border-blue-200"
                    onClick={() => navigate("/admin/contact-messages")}
                  >
                    View All Messages
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-800">Open Reports</CardTitle>
                  <CardDescription>Issues requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  {reports && reports.filter(r => r.status === "pending").slice(0, 3).map((report) => (
                    <div key={report.id} className="mb-4 pb-4 border-b border-blue-100 last:border-0 last:mb-0 last:pb-0">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-blue-700">{report.targetType}</h4>
                        <Badge variant="destructive" className="text-xs">
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-blue-600 mt-1">{report.reason}</p>
                      <p className="text-xs text-blue-500 mt-1">Reported by: User #{report.reporterId}</p>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2 text-blue-700 border-blue-200"
                    onClick={() => navigate("/admin/reports-management")}
                  >
                    View All Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-800">Registered Users</CardTitle>
                <CardDescription>Manage platform users and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead className="hidden md:table-cell">Toys Shared</TableHead>
                        <TableHead className="hidden md:table-cell">Badge</TableHead>
                        <TableHead className="hidden md:table-cell">Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users && users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                          <TableCell className="hidden md:table-cell">{user.toysShared || 0}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant={
                              user.currentBadge === "PLANET_PROTECTOR" ? "default" :
                              user.currentBadge === "SUSTAINABILITY_CHAMPION" ? "secondary" : "outline"
                            }>
                              {user.currentBadge || "ECO_STARTER"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {user.createdAt ? new Date(user.createdAt instanceof Date ? user.createdAt : String(user.createdAt)).toLocaleDateString() : 'Unknown'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setUserToDelete(user.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Toys Tab */}
          <TabsContent value="toys" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-800">Toy Listings</CardTitle>
                <CardDescription>Manage toy listings and exchanges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead className="hidden md:table-cell">Category</TableHead>
                        <TableHead className="hidden md:table-cell">Age Range</TableHead>
                        <TableHead className="hidden md:table-cell">Condition</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {toys && toys.map((toy) => (
                        <TableRow key={toy.id}>
                          <TableCell className="font-medium">{toy.title}</TableCell>
                          <TableCell className="hidden md:table-cell">{toy.category}</TableCell>
                          <TableCell className="hidden md:table-cell">{toy.ageRange}</TableCell>
                          <TableCell className="hidden md:table-cell">{toy.condition}</TableCell>
                          <TableCell>User #{toy.userId}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end">
                              <Button variant="ghost" size="icon" className="h-8 w-8 mr-2">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Are you sure you want to delete "${toy.title || 'this toy'}"? This action cannot be undone.`)) {
                                    deleteToyMutation.mutate(toy.id);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Reports Tab */}
          <TabsContent value="reports" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-800">User Reports</CardTitle>
                <CardDescription>Manage community reports and safety issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Reported Item</TableHead>
                        <TableHead className="hidden md:table-cell">Reported By</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports && reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.targetType || "User Report"}</TableCell>
                          <TableCell>Item #{report.targetId}</TableCell>
                          <TableCell className="hidden md:table-cell">User #{report.reporterId}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {report.createdAt ? new Date(report.createdAt instanceof Date ? report.createdAt : String(report.createdAt)).toLocaleDateString() : 'Unknown'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={report.status === "resolved" ? "outline" : "destructive"}>
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 mr-2"
                                onClick={() => setSelectedReportId(report.id)}
                                disabled={report.targetType !== "message"}
                                title={report.targetType !== "message" ? "Only message reports show context" : "View report context"}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {report.status === "pending" ? (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-green-500 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => resolveReportMutation.mutate(report.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  disabled
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Confirmation Dialog for User Deletion */}
        <AlertDialog open={userToDelete !== null} onOpenChange={() => setUserToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the user account 
                and all associated data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => {
                  if (userToDelete) {
                    deleteUserMutation.mutate(userToDelete);
                    setUserToDelete(null);
                  }
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Report Detail Dialog for showing message context */}
        <Dialog 
          open={selectedReportId !== null} 
          onOpenChange={(open) => !open && setSelectedReportId(null)}
          className="overflow-y-auto"
        >
          <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Report Details</DialogTitle>
              <DialogDescription>
                {contextLoading ? (
                  "Loading report context..."
                ) : reportContext ? (
                  `Viewing context for reported message from ${reportContext.sender?.name || reportContext.sender?.username || "Unknown"} to ${reportContext.receiver?.name || reportContext.receiver?.username || "Unknown"}`
                ) : (
                  "Could not load report context"
                )}
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="flex-1 max-h-[calc(90vh-180px)]">
              <div className="flex-1 flex flex-col px-1 pb-4">
                {contextLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                  </div>
                ) : reportContext ? (
                  <>
                    <div className="bg-blue-50 p-4 rounded-md mb-4">
                      <h3 className="font-medium text-blue-800 mb-2">Report Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-blue-700">Reported By:</span>
                          <span className="text-sm">User #{reportContext.report.reporterId}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-blue-700">Date Reported:</span>
                          <span className="text-sm">
                            {reportContext.report.createdAt ? 
                              new Date(reportContext.report.createdAt instanceof Date ? 
                                reportContext.report.createdAt : 
                                String(reportContext.report.createdAt)
                              ).toLocaleString() : 
                              'Unknown'
                            }
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-blue-700">Reason:</span>
                          <span className="text-sm">{reportContext.report.reason}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-blue-700">Status:</span>
                          <span className="text-sm flex items-center">
                            <Badge variant={reportContext.report.status === "resolved" ? "outline" : "destructive"}>
                              {reportContext.report.status}
                            </Badge>
                          </span>
                        </div>
                        {reportContext.report.details && (
                          <div className="flex flex-col col-span-2">
                            <span className="text-sm font-medium text-blue-700">Additional Details:</span>
                            <p className="text-sm">{reportContext.report.details}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-blue-800 mb-2">Message Context</h3>
                    <div className="rounded-md border p-4 bg-white min-h-[450px]">
                      <div className="space-y-4">
                        {reportContext.contextMessages.map((message, idx) => {
                          const isReportedMessage = idx === reportContext.targetIndex;
                          const isSender = message.senderId === reportContext.sender?.id;
                          
                          return (
                            <div 
                              key={message.id} 
                              className={`flex ${isSender ? 'justify-start' : 'justify-end'}`}
                            >
                              <div className={`
                                flex items-start gap-2 max-w-[80%] group
                                ${isReportedMessage ? 'relative' : ''}
                              `}>
                                {isSender && (
                                  <Avatar className="h-8 w-8 mt-1">
                                    <AvatarFallback className="bg-blue-100 text-blue-800">
                                      {reportContext.sender?.name?.charAt(0) || reportContext.sender?.username?.charAt(0) || '?'}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                
                                <div>
                                  {isSender && (
                                    <p className="text-xs text-blue-600 ml-1 mb-1">
                                      {reportContext.sender?.name || reportContext.sender?.username}
                                    </p>
                                  )}
                                  
                                  <div className={`
                                    rounded-lg px-3 py-2 text-sm
                                    ${isSender 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-blue-500 text-white'
                                    }
                                    ${isReportedMessage 
                                      ? 'ring-2 ring-red-500 dark:ring-red-400' 
                                      : ''
                                    }
                                  `}>
                                    {message.content}
                                    <div className="text-xs opacity-70 mt-1 text-right">
                                      {message.createdAt ? 
                                        new Date(message.createdAt instanceof Date ? 
                                          message.createdAt : 
                                          String(message.createdAt)
                                        ).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
                                        ''
                                      }
                                    </div>
                                  </div>
                                  
                                  {isReportedMessage && (
                                    <div className="mt-1 text-xs text-red-500 font-medium ml-1">
                                      ↑ Reported message
                                    </div>
                                  )}
                                </div>
                                
                                {!isSender && (
                                  <Avatar className="h-8 w-8 mt-1">
                                    <AvatarFallback className="bg-blue-300 text-blue-800">
                                      {reportContext.receiver?.name?.charAt(0) || reportContext.receiver?.username?.charAt(0) || '?'}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
                    <p>Could not load message context. The report might not be a message report, or the message may have been deleted.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <DialogFooter className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setSelectedReportId(null)}>
                Close
              </Button>
              {reportContext && reportContext.report.status === "pending" && (
                <Button
                  onClick={() => {
                    resolveReportMutation.mutate(reportContext.report.id);
                    setSelectedReportId(null);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Mark as Resolved
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}