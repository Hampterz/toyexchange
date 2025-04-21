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
import { getQueryFn, queryClient, apiRequest } from "@/lib/queryClient";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect non-admin users
  useEffect(() => {
    if (user && user.username !== "adminsreyas") {
      navigate("/");
    } else if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const { 
    data: users = [], 
    isLoading: usersLoading 
  } = useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && user.username === "adminsreyas",
  });

  const { 
    data: toys = [], 
    isLoading: toysLoading 
  } = useQuery({
    queryKey: ["/api/admin/toys"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && user.username === "adminsreyas",
  });

  const { 
    data: reports = [], 
    isLoading: reportsLoading 
  } = useQuery({
    queryKey: ["/api/admin/reports"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && user.username === "adminsreyas",
  });

  const { 
    data: contactMessages = [], 
    isLoading: contactLoading 
  } = useQuery({
    queryKey: ["/api/admin/contact-messages"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user && user.username === "adminsreyas",
  });

  // Admin mutations
  const removeToyMutation = useMutation({
    mutationFn: async (toyId: number) => {
      await apiRequest("DELETE", `/api/admin/toys/${toyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/toys"] });
    },
  });

  const resolveReportMutation = useMutation({
    mutationFn: async (reportId: number) => {
      await apiRequest("PATCH", `/api/admin/reports/${reportId}/resolve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reports"] });
    },
  });

  // Use the actual data from the server API endpoints
  // We already have users, toys, reports and contactMessages data from the queries above

  // Platform statistics based on real data
  const stats = {
    totalUsers: users.length,
    totalToys: toys.length,
    activeExchanges: 0, // Would need to implement in the future
    completedExchanges: users.reduce((total, user) => total + (user.successfulExchanges || 0), 0),
    averageRating: 0, // Would need to implement in the future
    newUsersThisWeek: users.filter(u => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(u.createdAt) > oneWeekAgo;
    }).length,
    newToysThisWeek: toys.filter(t => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(t.createdAt) > oneWeekAgo;
    }).length,
    sustainabilityImpact: {
      toysReused: toys.filter(t => !t.isAvailable).length,
      estimatedWasteSaved: `${toys.filter(t => !t.isAvailable).length * 2} kg`, // Assuming each toy saves ~2kg
      co2Reduced: `${Math.round(toys.filter(t => !t.isAvailable).length * 1.5)} kg` // Assuming each toy saves ~1.5kg CO2
    }
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
                    <TrendingUp className="mr-2 h-5 w-5" /> Exchanges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-800">{stats.completedExchanges}</div>
                  <p className="text-sm text-blue-600 mt-1">{stats.activeExchanges} active</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-700 text-lg flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" /> Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-800">{stats.averageRating}/5</div>
                  <p className="text-sm text-blue-600 mt-1">Average community rating</p>
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">New Toy Listed</TableCell>
                        <TableCell>Emma Wilson</TableCell>
                        <TableCell>2 hours ago</TableCell>
                      </TableRow>
                      <TableCell className="font-medium">Exchange Completed</TableCell>
                        <TableCell>Michael Brown</TableCell>
                        <TableCell>3 hours ago</TableCell>
                      <TableRow>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">New User Registered</TableCell>
                        <TableCell>James Miller</TableCell>
                        <TableCell>5 hours ago</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Toy Requested</TableCell>
                        <TableCell>Sophia Williams</TableCell>
                        <TableCell>6 hours ago</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">New Report Filed</TableCell>
                        <TableCell>Alex Johnson</TableCell>
                        <TableCell>8 hours ago</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
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
                    <span className="font-bold text-blue-800">{stats.sustainabilityImpact.toysReused}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Waste Saved</span>
                    <span className="font-bold text-blue-800">{stats.sustainabilityImpact.estimatedWasteSaved}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">CO2 Reduction</span>
                    <span className="font-bold text-blue-800">{stats.sustainabilityImpact.co2Reduced}</span>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-2">Badge Distribution</h4>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-blue-700">Bronze</span>
                      <span className="font-medium text-blue-800">65%</span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2 mb-3">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-blue-700">Silver</span>
                      <span className="font-medium text-blue-800">25%</span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2 mb-3">
                      <div className="bg-slate-400 h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-blue-700">Gold</span>
                      <span className="font-medium text-blue-800">10%</span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2 mb-3">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "10%" }}></div>
                    </div>
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
                          {new Date(message.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-sm text-blue-600 mt-1 line-clamp-2">{message.message}</p>
                      <div className="flex justify-between mt-2 text-xs text-blue-600">
                        <span>{message.name}</span>
                        <span>{message.email}</span>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full mt-2 text-blue-700 border-blue-200">
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
                        <h4 className="font-medium text-blue-700">{report.reportType}</h4>
                        <Badge variant="destructive" className="text-xs">
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-blue-600 mt-1">{report.reportedItem.name}</p>
                      <p className="text-xs text-blue-500 mt-1">Reported by: {report.reportedBy.name}</p>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full mt-2 text-blue-700 border-blue-200">
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
                        <TableRow key={demoUser.id}>
                          <TableCell className="font-medium">{demoUser.name}</TableCell>
                          <TableCell>{demoUser.username}</TableCell>
                          <TableCell className="hidden md:table-cell">{demoUser.email}</TableCell>
                          <TableCell className="hidden md:table-cell">{demoUser.toysShared}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant={
                              demoUser.currentBadge === "Gold" ? "default" :
                              demoUser.currentBadge === "Silver" ? "secondary" : "outline"
                            }>
                              {demoUser.currentBadge}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(demoUser.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
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
                      {demoToys.map((toy) => (
                        <TableRow key={toy.id}>
                          <TableCell className="font-medium">{toy.title}</TableCell>
                          <TableCell className="hidden md:table-cell">{toy.category}</TableCell>
                          <TableCell className="hidden md:table-cell">{toy.ageRange}</TableCell>
                          <TableCell className="hidden md:table-cell">{toy.condition}</TableCell>
                          <TableCell>{toy.owner.name}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end">
                              <Button variant="ghost" size="icon" className="h-8 w-8 mr-2">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
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
                      {demoReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.reportType}</TableCell>
                          <TableCell>{report.reportedItem.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{report.reportedBy.name}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={report.status === "resolved" ? "outline" : "destructive"}>
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end">
                              <Button variant="ghost" size="icon" className="h-8 w-8 mr-2">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {report.status === "pending" ? (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-green-500 hover:text-green-700 hover:bg-green-50"
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
      </div>
    </div>
  );
}