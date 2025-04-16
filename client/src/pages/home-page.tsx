import { useState } from "react";
import { Link, useLocation } from "wouter";
import { FilterBar, FilterOptions } from "@/components/toys/filter-bar";
import { ToyList } from "@/components/toys/toy-list";
import { AddToyModal } from "@/components/toys/add-toy-modal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Plus } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [filters, setFilters] = useState<FilterOptions>({
    location: "any",
    ageRange: "any",
    category: "any",
    condition: "any",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddToyModalOpen, setIsAddToyModalOpen] = useState(false);

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
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 py-14 mb-6 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl md:text-5xl font-bold font-heading text-white mb-4 drop-shadow-md">
              Share Joy, Create Smiles!
            </h1>
            <p className="text-white text-opacity-90 mb-8 text-lg leading-relaxed max-w-2xl">
              Give your children's unused toys a second life by sharing them with other families in your community. Join our playful exchange today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button variant="secondary" className="px-6 py-6 bg-white text-blue-800 font-bold rounded-full shadow-md hover:shadow-lg transform transition hover:scale-105">
                Browse Toys
              </Button>
              <Button 
                className="px-6 py-6 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full shadow-md hover:shadow-lg transform transition hover:scale-105"
                onClick={handleShareToyClick}
              >
                <Plus className="mr-2 h-4 w-4" /> Share a Toy
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <FilterBar onFilterChange={handleFilterChange} initialFilters={filters} />

      {/* Toy Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-heading">Available Toys</h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-neutral-500">Sort by:</span>
            <select className="border-none bg-transparent focus:ring-0 text-sm font-medium">
              <option>Newest First</option>
              <option>Recently Added</option>
              <option>Closest to Me</option>
            </select>
          </div>
        </div>

        <ToyList filters={filters} searchQuery={searchQuery} />
      </section>

      {/* Community Impact */}
      <section className="bg-blue-100 py-12 mb-12 rounded-xl shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4 text-blue-800">Making a Difference Together</h2>
            <p className="text-blue-900 max-w-2xl mx-auto">
              Together we're creating a more playful world while reducing waste and making quality toys accessible to all families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-md text-center transform hover:scale-105 transition duration-300">
              <div className="h-16 w-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-recycle text-blue-700 text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold font-heading mb-2 text-blue-700">0</h3>
              <p className="text-blue-800">Toys saved from landfill</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md text-center transform hover:scale-105 transition duration-300">
              <div className="h-16 w-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-blue-700 text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold font-heading mb-2 text-blue-700">0</h3>
              <p className="text-blue-800">Families sharing toys</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md text-center transform hover:scale-105 transition duration-300">
              <div className="h-16 w-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-hand-holding-heart text-blue-700 text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold font-heading mb-2 text-blue-700">0</h3>
              <p className="text-blue-800">Successful exchanges</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4 text-blue-800">How ToyShare Works</h2>
          <p className="text-blue-800 max-w-2xl mx-auto">
            Our fun and simple process makes sharing toys easy, safe, and rewarding for everyone!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-blue-300">
              <i className="fas fa-camera text-blue-700 text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold font-heading mb-3 text-blue-800">1. Share Your Toys</h3>
            <p className="text-blue-800">
              Take photos of toys your children no longer use and create a listing with details about condition and age range.
            </p>
          </div>

          <div className="text-center bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-blue-300">
              <i className="fas fa-comments text-blue-700 text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold font-heading mb-3 text-blue-800">2. Connect With Families</h3>
            <p className="text-blue-800">
              Receive requests and chat with interested families through our secure messaging system.
            </p>
          </div>

          <div className="text-center bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-blue-300">
              <i className="fas fa-handshake text-blue-700 text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold font-heading mb-3 text-blue-800">3. Arrange a Handoff</h3>
            <p className="text-blue-800">
              Meet at a safe public location to exchange the toy and spread joy to another family.
            </p>
          </div>
        </div>

        <div className="text-center mt-10">
          <Button 
            className="px-6 py-6 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform transition hover:scale-105"
            onClick={handleShareToyClick}
          >
            <Plus className="mr-2 h-4 w-4" /> Share Your First Toy
          </Button>
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
    </div>
  );
}
