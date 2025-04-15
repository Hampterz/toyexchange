import { useState, useEffect } from "react";
import { MapPin, Baby, Grid, Star } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AGE_RANGES, CATEGORIES, CONDITIONS, LOCATIONS } from "@/lib/utils/constants";

type FilterBarProps = {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
};

export type FilterOptions = {
  location: string;
  ageRange: string;
  category: string;
  condition: string;
};

export function FilterBar({ onFilterChange, initialFilters }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    location: initialFilters?.location || "any",
    ageRange: initialFilters?.ageRange || "any",
    category: initialFilters?.category || "any",
    condition: initialFilters?.condition || "any",
  });

  // Update filters when a selection changes
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // Initialize filters with any provided initial values
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  return (
    <section className="bg-white shadow-sm mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center overflow-x-auto scrollbar-hide space-x-4">
          <div className="flex items-center space-x-2 bg-neutral-100 px-3 py-2 rounded-full">
            <MapPin className="text-primary h-4 w-4" />
            <Select 
              value={filters.location} 
              onValueChange={(value) => handleFilterChange("location", value)}
            >
              <SelectTrigger className="bg-transparent border-none focus:ring-0 text-sm font-medium min-w-36">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Location</SelectItem>
                {LOCATIONS.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 bg-neutral-100 px-3 py-2 rounded-full">
            <Baby className="text-primary h-4 w-4" />
            <Select 
              value={filters.ageRange} 
              onValueChange={(value) => handleFilterChange("ageRange", value)}
            >
              <SelectTrigger className="bg-transparent border-none focus:ring-0 text-sm font-medium min-w-32">
                <SelectValue placeholder="All Ages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">All Ages</SelectItem>
                {AGE_RANGES.map(ageRange => (
                  <SelectItem key={ageRange} value={ageRange}>{ageRange}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 bg-neutral-100 px-3 py-2 rounded-full">
            <Grid className="text-primary h-4 w-4" />
            <Select 
              value={filters.category} 
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger className="bg-transparent border-none focus:ring-0 text-sm font-medium min-w-36">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">All Categories</SelectItem>
                {CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 bg-neutral-100 px-3 py-2 rounded-full">
            <Star className="text-primary h-4 w-4" />
            <Select 
              value={filters.condition} 
              onValueChange={(value) => handleFilterChange("condition", value)}
            >
              <SelectTrigger className="bg-transparent border-none focus:ring-0 text-sm font-medium min-w-36">
                <SelectValue placeholder="Any Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Condition</SelectItem>
                {CONDITIONS.map(condition => (
                  <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
}
