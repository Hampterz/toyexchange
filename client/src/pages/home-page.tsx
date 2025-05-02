import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { FilterBar, FilterOptions } from "@/components/toys/filter-bar";
import { ToyList } from "@/components/toys/toy-list";
import { AddToyModal } from "@/components/toys/add-toy-modal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { 
  Plus, Search, Gift, BookOpen, Shield, MessageSquare, 
  Users, Award, RefreshCw, Smartphone, MapPin, X
} from "lucide-react";
import { ToySearch } from "@/components/toys/toy-search";
import { NewsletterSignup } from "@/components/layout/newsletter-signup";
import { Testimonials } from "@/components/layout/testimonials";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function HomePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [filters, setFilters] = useState<FilterOptions>({
    location: [],
    ageRange: [],
    condition: [],
    tags: [],
    search: "",
    distance: 10, // Default distance of 10 miles
  });
  const [isAddToyModalOpen, setIsAddToyModalOpen] = useState(false);
  
  // State for location access popup
  const [showLocationDeniedAlert, setShowLocationDeniedAlert] = useState(false);

  // Set user's location from their profile or try to get current location
  useEffect(() => {
    // If user is logged in, use their stored address from profile
    if (user && user.latitude && user.longitude && user.location) {
      const updatedFilters = {
        ...filters,
        latitude: typeof user.latitude === 'string' ? parseFloat(user.latitude) : user.latitude,
        longitude: typeof user.longitude === 'string' ? parseFloat(user.longitude) : user.longitude,
        distance: filters.distance || 10, // Ensure a default value
        location: user.location ? [user.location] : []
      };
      setFilters(updatedFilters);
      
      // Immediately apply the filter with the user's location
      if (updatedFilters.latitude && updatedFilters.longitude) {
        handleFilterChange(updatedFilters);
        console.log("Auto-applied location filter from user profile:", user.location);
      }
    } 
    // Otherwise try to get their current location
    else if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Get coordinates
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Try to get a readable address using Google Maps Geocoding API
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`);
            const data = await response.json();
            
            let formattedAddress = '';
            if (data.results && data.results.length > 0) {
              // Get a human-readable address
              formattedAddress = data.results[0].formatted_address;
              console.log("Geocoded address:", formattedAddress);
            }
            
            // Update filters with location information
            const updatedFilters = {
              ...filters,
              latitude: lat,
              longitude: lng,
              distance: filters.distance || 10, // Ensure a default value
              location: formattedAddress ? [formattedAddress] : []
            };
            
            setFilters(updatedFilters);
            
            // Immediately apply the filter
            handleFilterChange(updatedFilters);
            console.log("Auto-applied location filter from browser geolocation with address:", formattedAddress);
          } catch (error) {
            console.error("Error geocoding address:", error);
            // Still use the coordinates even if we couldn't get an address
            const updatedFilters = {
              ...filters,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              distance: filters.distance || 10
            };
            setFilters(updatedFilters);
            handleFilterChange(updatedFilters);
          }
        },
        (error) => {
          console.log("Unable to get location: ", error.message);
          // Show error to user through a toast notification
          setShowLocationDeniedAlert(true);
        }
      );
    }
  }, [user]);
  
  // Query for community metrics
  const { data: communityMetrics } = useQuery<{ 
    toysSaved: number; 
    familiesConnected: number;
    wasteReduced: number;
  }>({
    queryKey: ['/api/community-metrics'],
    staleTime: 60000, // Cache for 1 minute
  });
  
  // Query for user's toys to determine if they've already shared toys
  const { data: userToys = [] } = useQuery<any[]>({
    queryKey: ['/api/toys/by-user'],
    enabled: !!user,
    staleTime: 60000, // Cache for 1 minute
  });

  const handleFilterChange = (newFilters: FilterOptions) => {
    console.log('Applying filters:', newFilters);
    // Log specifically about locations since that's what we're debugging
    if (newFilters.location && newFilters.location.length > 0) {
      console.log('Location filters:', newFilters.location);
    }
    setFilters(newFilters);
  };

  const handleShareToyClick = () => {
    if (user) {
      setIsAddToyModalOpen(true);
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="page-transition">
      {/* Location access denied alert */}
      {showLocationDeniedAlert && (
        <div className="fixed top-4 left-0 right-0 mx-auto z-50 max-w-md px-4">
          <Alert className="bg-white border border-amber-300 shadow-lg relative">
            <MapPin className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-700">Location access required</AlertTitle>
            <AlertDescription className="text-amber-600">
              To see toys near you, please allow location access. This helps us show toys within your preferred distance.
            </AlertDescription>
            <button 
              onClick={() => setShowLocationDeniedAlert(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </Alert>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 py-10 md:py-14 mb-4 md:mb-6 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold font-heading text-white mb-3 md:mb-4 drop-shadow-md">
              Share Joy, Create Smiles!
            </h1>
            <p className="text-white text-opacity-90 mb-6 md:mb-8 text-base md:text-lg leading-relaxed max-w-2xl px-2">
              Give your children's unused toys a second life by sharing them with other families in your community. Join our playful exchange today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none px-4 sm:px-0">
              <Button variant="secondary" className="w-full sm:w-auto px-4 py-3 md:px-6 md:py-4 bg-white text-blue-800 font-bold rounded-full shadow-md hover:shadow-lg transform transition hover:scale-105">
                Browse Toys
              </Button>
              <Button 
                className="w-full sm:w-auto px-4 py-3 md:px-6 md:py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full shadow-md hover:shadow-lg transform transition hover:scale-105"
                onClick={handleShareToyClick}
              >
                <Plus className="mr-2 h-4 w-4" /> Share a Toy
              </Button>
              {!user && (
                <Button 
                  className="w-full sm:w-auto px-4 py-3 md:px-6 md:py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-full shadow-md hover:shadow-lg transform transition hover:scale-105"
                  onClick={() => navigate('/auth')}
                >
                  Join Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Toy Listings with Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-2xl font-bold font-heading mb-2 md:mb-0">Available Toys</h2>
          
          {/* Mobile-only search bar */}
          <div className="w-full md:hidden mb-3">
            <ToySearch 
              onSearch={(query) => handleFilterChange({...filters, search: query})} 
              initialValue={filters.search || ""}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Filters - Full height on mobile with sticky position */}
          <div className="md:col-span-3 lg:col-span-3 bg-white p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow md:sticky md:top-[100px] self-start">

            

            
            <FilterBar onFilterChange={handleFilterChange} initialFilters={filters} />
          </div>
          
          {/* Toy Listings */}
          <div className="col-span-1 md:col-span-9 lg:col-span-9">
            <ToyList filters={filters} />
          </div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="bg-blue-100 py-8 sm:py-12 mb-8 sm:mb-12 rounded-xl shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading mb-3 sm:mb-4 text-blue-800">Making a Difference Together</h2>
            <p className="text-blue-900 max-w-2xl mx-auto text-sm sm:text-base">
              Together we're creating a more playful world while reducing waste and making quality toys accessible to all families.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md text-center transform transition duration-300 hover:-translate-y-1">
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Gift className="h-5 w-5 sm:h-7 sm:w-7 text-blue-700" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-1 sm:mb-2 text-blue-700">
                {communityMetrics?.toysSaved || 0}
              </h3>
              <p className="text-blue-800 text-sm sm:text-base">Toys saved from landfill</p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md text-center transform transition duration-300 hover:-translate-y-1">
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <MessageSquare className="h-5 w-5 sm:h-7 sm:w-7 text-blue-700" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-1 sm:mb-2 text-blue-700">
                {communityMetrics?.familiesConnected || 0}
              </h3>
              <p className="text-blue-800 text-sm sm:text-base">Members connected</p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md text-center transform transition duration-300 hover:-translate-y-1">
              <div className="h-12 w-12 sm:h-16 sm:w-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Shield className="h-5 w-5 sm:h-7 sm:w-7 text-blue-700" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-1 sm:mb-2 text-blue-700">
                {communityMetrics?.wasteReduced || 0}
              </h3>
              <p className="text-blue-800 text-sm sm:text-base">Kg of waste saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4 text-blue-800">What Our Community Says</h2>
          <p className="text-blue-700 max-w-2xl mx-auto">
            Join hundreds of members who are already sharing toys and creating lasting connections.
          </p>
        </div>
        
        <Testimonials />
      </section>
      
      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading mb-3 sm:mb-4 text-blue-800">How ToyShare Works</h2>
          <p className="text-blue-800 max-w-2xl mx-auto text-sm sm:text-base">
            Our fun and simple process makes sharing toys easy, safe, and rewarding for everyone!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="text-center bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1">
            <div className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border-3 sm:border-4 border-blue-300">
              <i className="fas fa-camera text-blue-700 text-xl sm:text-2xl md:text-3xl"></i>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-heading mb-2 sm:mb-3 text-blue-800">1. Share Your Toys</h3>
            <p className="text-blue-800 text-sm sm:text-base">
              Take photos of toys you no longer need and create a listing with details about condition and age range.
            </p>
          </div>

          <div className="text-center bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1">
            <div className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border-3 sm:border-4 border-blue-300">
              <i className="fas fa-comments text-blue-700 text-xl sm:text-2xl md:text-3xl"></i>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-heading mb-2 sm:mb-3 text-blue-800">2. Connect With Others</h3>
            <p className="text-blue-800 text-sm sm:text-base">
              Receive requests and chat with interested members through our secure messaging system.
            </p>
          </div>

          <div className="text-center bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1">
            <div className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border-3 sm:border-4 border-blue-300">
              <i className="fas fa-handshake text-blue-700 text-xl sm:text-2xl md:text-3xl"></i>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-heading mb-2 sm:mb-3 text-blue-800">3. Arrange a Handoff</h3>
            <p className="text-blue-800 text-sm sm:text-base">
              Meet at a safe public location to exchange the toy and spread joy to another member.
            </p>
          </div>
        </div>

        {user && Array.isArray(userToys) && userToys.length === 0 && (
          <div className="text-center mt-10">
            <Button 
              className="px-6 py-6 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform transition hover:scale-105"
              onClick={handleShareToyClick}
            >
              <Plus className="mr-2 h-4 w-4" /> Share Your First Toy
            </Button>
          </div>
        )}
      </section>

      {/* Trust & Safety Banner */}
      <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-8 rounded-xl mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3 text-blue-800">Your Safety is Our Priority</h2>
            <p className="text-blue-700 max-w-3xl mx-auto text-sm md:text-base">
              ToyShare is built on a foundation of trust, safety, and community values to create a secure environment for all members.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1 text-center">
              <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="font-bold text-blue-800 mb-1">Trust & Verification</h3>
              <p className="text-blue-600 text-sm">User profiles are verified with secure Google sign-in</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1 text-center">
              <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="font-bold text-blue-800 mb-1">Community Reporting</h3>
              <p className="text-blue-600 text-sm">Report system ensures all listings meet our safety standards</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1 text-center">
              <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="font-bold text-blue-800 mb-1">Rating System</h3>
              <p className="text-blue-600 text-sm">Peer reviews help maintain high quality exchanges</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1 text-center">
              <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <RefreshCw className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="font-bold text-blue-800 mb-1">Toy Safety Checks</h3>
              <p className="text-blue-600 text-sm">Guidelines to ensure all shared toys meet safety standards</p>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Link href="/safety-center">
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                Visit our Safety Center
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4 text-blue-800">Stay Connected</h2>
          <p className="text-blue-700 max-w-2xl mx-auto mb-8">
            Sign up for our newsletter to receive toy sharing tips, community stories, and updates on new features.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <NewsletterSignup />
        </div>
      </section>

      {/* Resource Links */}
      <section className="bg-blue-50 py-6 sm:py-10 mb-8 sm:mb-12 rounded-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-center">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-700 mx-auto mb-2 sm:mb-3" />
              <h3 className="font-bold text-blue-800 mb-1 sm:mb-2 text-base sm:text-lg">Exchange Guide</h3>
              <p className="text-blue-600 mb-2 sm:mb-3 text-xs sm:text-sm">Learn the best practices for successful toy exchanges</p>
              <Link href="/resources/exchange-guide">
                <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 h-8 text-xs sm:text-sm">
                  Read Guide
                </Button>
              </Link>
            </div>
            
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-700 mx-auto mb-2 sm:mb-3" />
              <h3 className="font-bold text-blue-800 mb-1 sm:mb-2 text-base sm:text-lg">Safety Center</h3>
              <p className="text-blue-600 mb-2 sm:mb-3 text-xs sm:text-sm">Everything you need to know to stay safe while sharing</p>
              <Link href="/safety-center">
                <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 h-8 text-xs sm:text-sm">
                  Visit Safety Center
                </Button>
              </Link>
            </div>
            
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-blue-700 mx-auto mb-2 sm:mb-3" />
              <h3 className="font-bold text-blue-800 mb-1 sm:mb-2 text-base sm:text-lg">Get Support</h3>
              <p className="text-blue-600 mb-2 sm:mb-3 text-xs sm:text-sm">Have questions? Our support team is ready to help</p>
              <Link href="/resources/contact-support">
                <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 h-8 text-xs sm:text-sm">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fixed action button - desktop only */}
      <div className="hidden md:block fixed right-6 bottom-6 z-40">
        <Button 
          className="h-14 w-14 rounded-full bg-blue-700 shadow-lg flex items-center justify-center text-white hover:bg-blue-800 transform transition hover:scale-105"
          onClick={handleShareToyClick}
          aria-label="Add toy"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Add Toy Modal */}
      <AddToyModal
        isOpen={isAddToyModalOpen}
        onClose={() => setIsAddToyModalOpen(false)}
      />

      {/* Footer with name */}
      <footer className="mt-16 py-6 text-center border-t border-blue-100">
        <p className="text-sm text-blue-500">
          Created by Sreyas R
        </p>
      </footer>
    </div>
  );
}
