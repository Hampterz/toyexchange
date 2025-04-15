import { useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { FilterBar, FilterOptions } from "@/components/toys/filter-bar";
import { ToyList } from "@/components/toys/toy-list";
import { AddToyModal } from "@/components/toys/add-toy-modal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Plus } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
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

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearchChange={handleSearchChange} searchValue={searchQuery} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-300 to-primary py-10 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
                  Share Joy, Reduce Waste
                </h1>
                <p className="text-white text-opacity-90 mb-6 text-lg">
                  Give your children's unused toys a second life by sharing them with other families in your community.
                </p>
                <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button variant="secondary" className="px-6 py-6 bg-white text-primary font-bold rounded-full shadow-md hover:shadow-lg">
                    Browse Toys
                  </Button>
                  <Button 
                    className="px-6 py-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full shadow-md hover:shadow-lg"
                    onClick={() => setIsAddToyModalOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Share a Toy
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center md:justify-end">
                <img 
                  src="https://images.unsplash.com/photo-1551124054-0324bbd99feb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                  alt="Happy kids playing with toys" 
                  className="w-full max-w-md rounded-lg shadow-xl" 
                />
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
        <section className="bg-neutral-100 py-12 mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4">Our Community Impact</h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Together we're reducing waste and making quality toys accessible to all families.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="h-16 w-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-recycle text-primary text-2xl"></i>
                </div>
                <h3 className="text-lg font-bold font-heading mb-2">2,450</h3>
                <p className="text-neutral-600">Toys saved from landfill</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="h-16 w-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-users text-primary text-2xl"></i>
                </div>
                <h3 className="text-lg font-bold font-heading mb-2">1,345</h3>
                <p className="text-neutral-600">Happy families</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="h-16 w-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-hand-holding-heart text-primary text-2xl"></i>
                </div>
                <h3 className="text-lg font-bold font-heading mb-2">980</h3>
                <p className="text-neutral-600">Successful exchanges</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4">How ToyShare Works</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Our simple process makes sharing toys easy, safe, and rewarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-camera text-orange-500 text-2xl"></i>
              </div>
              <h3 className="text-lg font-bold font-heading mb-2">1. Share Your Toys</h3>
              <p className="text-neutral-600">
                Take photos of toys your children no longer use and create a listing with details about condition and age range.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-comments text-orange-500 text-2xl"></i>
              </div>
              <h3 className="text-lg font-bold font-heading mb-2">2. Connect With Families</h3>
              <p className="text-neutral-600">
                Receive requests and chat with interested families through our secure messaging system.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-handshake text-orange-500 text-2xl"></i>
              </div>
              <h3 className="text-lg font-bold font-heading mb-2">3. Arrange a Handoff</h3>
              <p className="text-neutral-600">
                Meet at a safe public location to exchange the toy and spread joy to another family.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Button 
              className="px-6 py-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full shadow-md hover:shadow-lg"
              onClick={() => setIsAddToyModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Share Your First Toy
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Mobile Bottom Navigation */}
      <MobileNav onAddToyClick={() => setIsAddToyModalOpen(true)} />

      {/* Fixed action button - desktop only */}
      <div className="hidden md:block fixed right-6 bottom-6 z-40">
        <Button 
          className="h-14 w-14 rounded-full bg-primary shadow-lg flex items-center justify-center text-white hover:bg-primary/90"
          onClick={() => setIsAddToyModalOpen(true)}
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
