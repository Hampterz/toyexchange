import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  Loader2, 
  Map as MapIcon, 
  List, 
  Filter as FilterIcon, 
  X, 
  ChevronDown,
  Search,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { useState, useEffect } from "react";

export default function ToyMapView() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [view, setView] = useState<"map" | "list">("map");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [ageRange, setAgeRange] = useState<string | null>(null);
  const [maxDistance, setMaxDistance] = useState<number>(25); // in miles/km
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  // Mock user locations for example purposes
  const [location, setLocation] = useState<{city: string; state: string; lat?: number; lng?: number}>({
    city: "San Francisco",
    state: "CA"
  });
  
  // Helper function to get location display
  const getLocationDisplay = () => {
    return selectedLocation || `${location.city}, ${location.state}`;
  };
  
  // Fetch toys with filters
  const { data: toys, isLoading } = useQuery({
    queryKey: [
      '/api/toys', 
      { 
        search: searchQuery, 
        category, 
        ageRange, 
        maxDistance, 
        lat: location.lat, 
        lng: location.lng,
        location: selectedLocation 
      }
    ],
    queryFn: undefined,
    enabled: true
  });
  
  // Attempt to get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, we would use reverse geocoding to get the city and state
          // For this example, just storing the coordinates
          setLocation(prevLocation => ({
            ...prevLocation,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }));
        },
        (error) => {
          console.log("Unable to retrieve your location. Using default location.");
        }
      );
    } else {
      console.log("Geolocation not supported by your browser. Using default location.");
    }
  }, []);
  
  // Helper function for toy distance display
  const getDistanceDisplay = (distance: number) => {
    if (distance < 1) {
      return "< 1 mile away";
    }
    return `${Math.round(distance)} miles away`;
  };
  
  if (isLoading) {
    return (
      <div className="container py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Toys Near You</h1>
          <p className="text-muted-foreground">
            Find available toys in your area
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select 
            value={selectedLocation || ""} 
            onValueChange={(value) => setSelectedLocation(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={getLocationDisplay()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Current: {getLocationDisplay()}</SelectItem>
              <SelectItem value="New York, NY">New York, NY</SelectItem>
              <SelectItem value="Los Angeles, CA">Los Angeles, CA</SelectItem>
              <SelectItem value="Chicago, IL">Chicago, IL</SelectItem>
              <SelectItem value="Houston, TX">Houston, TX</SelectItem>
              <SelectItem value="Phoenix, AZ">Phoenix, AZ</SelectItem>
            </SelectContent>
          </Select>
          
          <Tabs 
            value={view} 
            onValueChange={(v) => setView(v as "map" | "list")}
            className="h-10"
          >
            <TabsList>
              <TabsTrigger value="map" className="px-3">
                <MapIcon className="h-4 w-4 mr-1" />
                Map
              </TabsTrigger>
              <TabsTrigger value="list" className="px-3">
                <List className="h-4 w-4 mr-1" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-stretch mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-8"
            placeholder="Search for toys by name, description or category" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="min-w-[120px]">
              <FilterIcon className="h-4 w-4 mr-2" />
              Filter
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Filter Toys</SheetTitle>
              <SheetDescription>
                Adjust filters to find toys that match your preferences
              </SheetDescription>
            </SheetHeader>
            
            <div className="grid gap-6 py-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Category</h3>
                <Select 
                  value={category || ""} 
                  onValueChange={(value) => setCategory(value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="action-figures">Action Figures</SelectItem>
                    <SelectItem value="board-games">Board Games</SelectItem>
                    <SelectItem value="building-blocks">Building Blocks</SelectItem>
                    <SelectItem value="dolls">Dolls</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="electronic">Electronic</SelectItem>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                    <SelectItem value="plush">Plush Toys</SelectItem>
                    <SelectItem value="puzzles">Puzzles</SelectItem>
                    <SelectItem value="vehicles">Vehicles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Age Range</h3>
                <Select 
                  value={ageRange || ""} 
                  onValueChange={(value) => setAgeRange(value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Ages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Ages</SelectItem>
                    <SelectItem value="0-2">0-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="6-8">6-8 years</SelectItem>
                    <SelectItem value="9-12">9-12 years</SelectItem>
                    <SelectItem value="12+">12+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">Maximum Distance</h3>
                  <span className="text-sm text-muted-foreground">{maxDistance} miles</span>
                </div>
                <Slider
                  value={[maxDistance]}
                  min={5}
                  max={100}
                  step={5}
                  onValueChange={(value) => setMaxDistance(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5mi</span>
                  <span>50mi</span>
                  <span>100mi</span>
                </div>
              </div>
              
              <div className="pt-4 space-y-2">
                <Button 
                  variant="default" 
                  className="w-full" 
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => {
                    setCategory(null);
                    setAgeRange(null);
                    setMaxDistance(25);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="mb-8">
        {(category || ageRange || maxDistance !== 25 || selectedLocation) && (
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="text-sm text-muted-foreground mt-1">Active filters:</div>
            
            {category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {category}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => setCategory(null)} 
                />
              </Badge>
            )}
            
            {ageRange && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Age: {ageRange}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => setAgeRange(null)} 
                />
              </Badge>
            )}
            
            {maxDistance !== 25 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Distance: {maxDistance}mi
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => setMaxDistance(25)} 
                />
              </Badge>
            )}
            
            {selectedLocation && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Location: {selectedLocation}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => setSelectedLocation(null)} 
                />
              </Badge>
            )}
          </div>
        )}
      </div>
      
      <TabsContent value="map" className="m-0">
        <div className="relative bg-muted rounded-lg overflow-hidden" style={{ height: "calc(100vh - 330px)", minHeight: "400px" }}>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <MapIcon className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
            <p className="text-muted-foreground">
              Map view requires Google Maps API integration.<br />
              For this prototype, please use the List view.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4 mr-2" />
              Switch to List View
            </Button>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="list" className="m-0">
        {toys && toys.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toys.map((toy) => (
              <Link key={toy.id} href={`/toys/${toy.id}`}>
                <a className="block h-full">
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader className="p-0">
                      <div 
                        className="h-48 bg-cover bg-center rounded-t-lg relative"
                        style={{ backgroundImage: `url(${toy.imageUrl || 'https://placehold.co/400x300?text=Toy+Image'})` }}
                      >
                        <div className="absolute bottom-2 left-2 flex gap-1">
                          {toy.condition && (
                            <Badge className="bg-black/60 text-white hover:bg-black/70">
                              {toy.condition}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{toy.name}</CardTitle>
                        <Badge variant="outline">{toy.ageRange}</Badge>
                      </div>
                      <CardDescription className="mt-1 line-clamp-2">
                        {toy.description}
                      </CardDescription>
                      
                      <div className="mt-4 flex flex-wrap gap-1">
                        {toy.tags?.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-3 flex justify-between items-center">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {getDistanceDisplay(toy.distance || 0)}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Posted {new Date(toy.createdAt).toLocaleDateString()}
                      </span>
                    </CardFooter>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No toys found nearby</h3>
            <p className="text-muted-foreground max-w-md mt-2 mb-6">
              {searchQuery || category || ageRange || maxDistance !== 25 || selectedLocation
                ? "No toys match your current filters. Try adjusting your search criteria or filters."
                : "There are no toys available in your area yet."
              }
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setCategory(null);
              setAgeRange(null);
              setMaxDistance(25);
              setSelectedLocation(null);
            }}>
              Clear All Filters
            </Button>
          </div>
        )}
      </TabsContent>
    </div>
  );
}