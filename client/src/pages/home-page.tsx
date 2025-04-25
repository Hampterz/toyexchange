import { useState } from "react";
import { Link, useLocation } from "wouter";
import { FilterBar, FilterOptions } from "@/components/toys/filter-bar";
import { ToyList } from "@/components/toys/toy-list";
import { AddToyModal } from "@/components/toys/add-toy-modal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Plus, Search, Gift, BookOpen, Shield, MessageSquare } from "lucide-react";
import { ToySearch } from "@/components/toys/toy-search";
import { NewsletterSignup } from "@/components/layout/newsletter-signup";
import { Testimonials } from "@/components/layout/testimonials";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [filters, setFilters] = useState<FilterOptions>({
    location: "any",
    ageRange: "any",
    category: "any",
    condition: "any",
    tags: [],
    search: "",
  });
  const [isAddToyModalOpen, setIsAddToyModalOpen] = useState(false);
  
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
  const { data: userToys = [] } = useQuery({
    queryKey: ['/api/toys/by-user'],
    enabled: !!user,
    staleTime: 60000, // Cache for 1 minute
  });

  const handleFilterChange = (newFilters: FilterOptions) => {
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

      {/* Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <FilterBar onFilterChange={handleFilterChange} initialFilters={filters} />
        </div>
      </section>

      {/* Toy Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-2xl font-bold font-heading mb-3">Available Toys</h2>
        
        <div className="flex items-center mb-5">
          <span className="text-sm text-neutral-600 font-medium mr-3">Sort by:</span>
          <div className="relative">
            <select className="pl-3 pr-8 py-1.5 rounded-md border border-blue-200 bg-blue-50 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm font-medium shadow-sm text-blue-800 cursor-pointer appearance-none">
              <option>Newest First</option>
              <option>Recently Added</option>
              <option>Closest to Me</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-800">
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <ToyList filters={filters} />
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
              <p className="text-blue-800 text-sm sm:text-base">Families connected</p>
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
            Join hundreds of families who are already sharing toys and creating lasting connections.
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
              Take photos of toys your children no longer use and create a listing with details about condition and age range.
            </p>
          </div>

          <div className="text-center bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1">
            <div className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border-3 sm:border-4 border-blue-300">
              <i className="fas fa-comments text-blue-700 text-xl sm:text-2xl md:text-3xl"></i>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-heading mb-2 sm:mb-3 text-blue-800">2. Connect With Families</h3>
            <p className="text-blue-800 text-sm sm:text-base">
              Receive requests and chat with interested families through our secure messaging system.
            </p>
          </div>

          <div className="text-center bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1">
            <div className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border-3 sm:border-4 border-blue-300">
              <i className="fas fa-handshake text-blue-700 text-xl sm:text-2xl md:text-3xl"></i>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-heading mb-2 sm:mb-3 text-blue-800">3. Arrange a Handoff</h3>
            <p className="text-blue-800 text-sm sm:text-base">
              Meet at a safe public location to exchange the toy and spread joy to another family.
            </p>
          </div>
        </div>

        {user && userToys.length === 0 && (
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
