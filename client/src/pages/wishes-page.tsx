import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Wish } from "@shared/schema";
import { FilterBar } from "@/components/toys/filter-bar";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/toys/empty-state";

export default function WishesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: [] as string[],
    ageRange: [] as string[],
    category: [] as string[],
    distance: 10,
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
  });

  // Fetch wishes with applied filters
  const { data: wishes, isLoading, error } = useQuery<Wish[]>({
    queryKey: ["/api/wishes", filters, searchTerm],
    queryFn: async () => {
      // Build query string from filters
      const params = new URLSearchParams();
      
      if (searchTerm) params.append("search", searchTerm);
      
      if (filters.location?.length > 0) {
        filters.location.forEach(loc => params.append("location", loc));
      }
      
      if (filters.ageRange?.length > 0) {
        filters.ageRange.forEach(age => params.append("ageRange", age));
      }
      
      if (filters.category?.length > 0) {
        filters.category.forEach(cat => params.append("category", cat));
      }
      
      if (filters.latitude !== undefined && filters.longitude !== undefined) {
        params.append("latitude", filters.latitude.toString());
        params.append("longitude", filters.longitude.toString());
        params.append("distance", filters.distance.toString());
      }
      
      const res = await fetch(`/api/wishes?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch wishes");
      return res.json();
    },
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes from FilterBar
  const handleFilterChange = (newFilters: any) => {
    setFilters({
      ...filters,
      ...newFilters,
    });
  };

  return (
    <div className="container py-6 space-y-6">
      <PageHeader 
        title="Wish List" 
        description="Find toy wishes from families in your community or create your own!"
        rightContent={
          <Button 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md"
            onClick={() => setLocation("/wishes/create")}
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Create Wish
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Sidebar with filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search wishes..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-3">Filter Wishes</h3>
            <FilterBar 
              onChange={handleFilterChange}
              initialFilters={filters}
              showToySpecificFilters={false}
            />
          </div>
        </div>
        
        {/* Main content with wishes list */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading wishes...</span>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-destructive">
              <p>Error loading wishes. Please try again later.</p>
            </div>
          ) : wishes && wishes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishes.map((wish) => (
                <WishCard key={wish.id} wish={wish} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Search className="h-12 w-12 text-muted-foreground" />}
              title="No wishes found"
              description="Try adjusting your filters or create a new wish."
              action={
                <Button onClick={() => setLocation("/wishes/create")}>
                  Create Wish
                </Button>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Wish card component to display individual wishes
function WishCard({ wish }: { wish: Wish }) {
  const [, setLocation] = useLocation();
  
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const handleClick = () => {
    setLocation(`/wishes/${wish.id}`);
  };

  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md cursor-pointer" onClick={handleClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="line-clamp-2 text-lg">{wish.title}</CardTitle>
          <Badge variant="outline">{wish.category}</Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-xs">
          {wish.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {truncateText(wish.description, 120)}
        </p>
        {wish.tags && wish.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {wish.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {wish.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{wish.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 border-t">
        <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
          <span>Age: {wish.ageRange}</span>
          <span>
            {new Date(wish.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}