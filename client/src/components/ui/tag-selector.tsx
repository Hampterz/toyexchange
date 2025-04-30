import { useState, useEffect } from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { COMMON_ATTRIBUTES } from "@shared/schema";

interface TagSelectorProps {
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  allowCustomTags?: boolean;
  className?: string;
}

export function TagSelector({
  availableTags,
  selectedTags,
  onTagsChange,
  placeholder = "Select tags...",
  allowCustomTags = true,
  className,
}: TagSelectorProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filteredTags, setFilteredTags] = useState(availableTags);

  // Initialize filtered tags when component mounts
  useEffect(() => {
    setFilteredTags(availableTags.filter(tag => !selectedTags.includes(tag)));
  }, [availableTags, selectedTags]);
  
  // When input value changes, filter the available tags
  const updateFilteredTags = (value: string) => {
    setInputValue(value);
    if (value.trim() === "") {
      setFilteredTags(availableTags.filter(tag => !selectedTags.includes(tag)));
    } else {
      setFilteredTags(
        availableTags.filter(
          tag => 
            !selectedTags.includes(tag) && 
            tag.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
    updateFilteredTags("");
  };

  const removeTag = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue && allowCustomTags) {
      e.preventDefault();
      if (!selectedTags.includes(inputValue.trim()) && inputValue.trim() !== "") {
        onTagsChange([...selectedTags, inputValue.trim()]);
        setInputValue("");
        updateFilteredTags("");
      }
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedTags.length > 0
              ? `${selectedTags.length} tag${selectedTags.length > 1 ? "s" : ""} selected`
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full max-w-[400px] p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search tags..." 
              value={inputValue}
              onValueChange={updateFilteredTags}
              onKeyDown={handleInputKeyDown}
            />
            <CommandList className="max-h-[300px] overflow-auto">
              <CommandEmpty>
                {allowCustomTags && inputValue.trim() !== "" ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      if (!selectedTags.includes(inputValue.trim())) {
                        onTagsChange([...selectedTags, inputValue.trim()]);
                        setInputValue("");
                        setOpen(false);
                      }
                    }}
                  >
                    Add "{inputValue.trim()}"
                  </Button>
                ) : (
                  "No tags found."
                )}
              </CommandEmpty>
              
              {/* If we're searching, show flat list of filtered tags */}
              {inputValue.trim() !== "" ? (
                <CommandGroup heading="Matching Tags">
                  {filteredTags.map(tag => (
                    <CommandItem
                      key={tag}
                      value={tag}
                      onSelect={() => {
                        toggleTag(tag);
                        setInputValue("");
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedTags.includes(tag) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {tag}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                // When not searching, show categories
                <>
                  {/* Educational Group */}
                  <CommandGroup heading="Educational">
                    {COMMON_ATTRIBUTES.filter(tag => 
                      ["Educational", "STEM", "Science Kit", "Math Skills", "Reading", 
                       "Language Development", "Geography", "History", "Coding", 
                       "Problem Solving", "Memory Skills", "Learning Tools", 
                       "Flash Cards", "Educational Games"].includes(tag) &&
                      !selectedTags.includes(tag)
                    ).map(tag => (
                      <CommandItem
                        key={tag}
                        value={tag}
                        onSelect={() => {
                          toggleTag(tag);
                          setInputValue("");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedTags.includes(tag) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {tag}
                      </CommandItem>
                    ))}
                  </CommandGroup>

                  {/* Activities Group */}
                  <CommandGroup heading="Activities">
                    {COMMON_ATTRIBUTES.filter(tag => 
                      ["Outdoor", "Indoor", "Creative", "Sports", "Active Play",
                       "Quiet Play", "Pretend Play", "Dress Up", "Imaginative Play",
                       "Cooperative Play", "Dramatic Play", "Solo Play", 
                       "Group Activity", "Travel Friendly", "Water Play", 
                       "Sand Play", "Bath Toys", "Camping"].includes(tag) &&
                      !selectedTags.includes(tag)
                    ).map(tag => (
                      <CommandItem
                        key={tag}
                        value={tag}
                        onSelect={() => {
                          toggleTag(tag);
                          setInputValue("");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedTags.includes(tag) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {tag}
                      </CommandItem>
                    ))}
                  </CommandGroup>

                  {/* Materials Group */}
                  <CommandGroup heading="Materials">
                    {COMMON_ATTRIBUTES.filter(tag => 
                      ["Wooden", "Plastic", "Plush", "Fabric", "Metal", 
                       "Eco-Friendly", "Natural Materials", "Magnetic", 
                       "Foam", "Silicone"].includes(tag) &&
                      !selectedTags.includes(tag)
                    ).map(tag => (
                      <CommandItem
                        key={tag}
                        value={tag}
                        onSelect={() => {
                          toggleTag(tag);
                          setInputValue("");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedTags.includes(tag) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {tag}
                      </CommandItem>
                    ))}
                  </CommandGroup>

                  {/* Electronics Group */}
                  <CommandGroup heading="Electronics">
                    {COMMON_ATTRIBUTES.filter(tag => 
                      ["Electronic", "Battery Operated", "Rechargeable", 
                       "Lights", "Sounds", "Music", "Interactive", 
                       "Talking", "Remote Control", "Digital", 
                       "Screen-Free"].includes(tag) &&
                      !selectedTags.includes(tag)
                    ).map(tag => (
                      <CommandItem
                        key={tag}
                        value={tag}
                        onSelect={() => {
                          toggleTag(tag);
                          setInputValue("");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedTags.includes(tag) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {tag}
                      </CommandItem>
                    ))}
                  </CommandGroup>

                  {/* Arts Group */}
                  <CommandGroup heading="Arts & Crafts">
                    {COMMON_ATTRIBUTES.filter(tag => 
                      ["Musical", "Art", "Crafts", "Drawing", "Painting", 
                       "Coloring", "Musical Instruments", "Clay Modeling", 
                       "Beading", "Jewelry Making", "Knitting", "Sewing"].includes(tag) &&
                      !selectedTags.includes(tag)
                    ).map(tag => (
                      <CommandItem
                        key={tag}
                        value={tag}
                        onSelect={() => {
                          toggleTag(tag);
                          setInputValue("");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedTags.includes(tag) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {tag}
                      </CommandItem>
                    ))}
                  </CommandGroup>

                  {/* Toy Types Group */}
                  <CommandGroup heading="Toy Types">
                    {COMMON_ATTRIBUTES.filter(tag => 
                      ["Dolls", "Action Figures", "Vehicles", "Cars", "Trucks",
                       "Trains", "Airplanes", "Building", "Blocks", "Construction",
                       "Lego Compatible", "Puzzles", "Games", "Board Games",
                       "Card Games", "Strategy Games"].includes(tag) &&
                      !selectedTags.includes(tag)
                    ).map(tag => (
                      <CommandItem
                        key={tag}
                        value={tag}
                        onSelect={() => {
                          toggleTag(tag);
                          setInputValue("");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedTags.includes(tag) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {tag}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  
                  {/* Other tags that don't fit into the above categories */}
                  <CommandGroup heading="Other Tags">
                    {availableTags.filter(tag => 
                      !selectedTags.includes(tag) &&
                      ![...COMMON_ATTRIBUTES].includes(tag)
                    ).map(tag => (
                      <CommandItem
                        key={tag}
                        value={tag}
                        onSelect={() => {
                          toggleTag(tag);
                          setInputValue("");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedTags.includes(tag) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {tag}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map(tag => (
            <Badge key={tag} variant="secondary" className="px-3 py-1 text-xs">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {tag} tag</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}