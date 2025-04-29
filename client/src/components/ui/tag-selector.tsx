import { useState, useEffect, useRef } from 'react';
import { X, Check, Tag, Search, ChevronsUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TagSelectorProps {
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  className?: string;
  placeholder?: string;
}

export function TagSelector({
  availableTags,
  selectedTags,
  onTagsChange,
  className,
  placeholder = "Select tags..."
}: TagSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [customTag, setCustomTag] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter tags based on search query
  const filteredTags = availableTags
    .filter(tag => !selectedTags.includes(tag))
    .filter(tag => tag.toLowerCase().includes(search.toLowerCase()));

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  // Add custom tag
  const addCustomTag = () => {
    const trimmedTag = customTag.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      onTagsChange([...selectedTags, trimmedTag]);
      setCustomTag('');
    }
  };

  // Handle custom tag input key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomTag();
    }
  };

  // Close the popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (open && inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-muted-foreground h-auto min-h-10"
          >
            <div className="flex items-center">
              <Tag className="mr-2 h-4 w-4" />
              {selectedTags.length > 0 ? `${selectedTags.length} tags selected` : placeholder}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command className="w-full">
            <CommandInput 
              placeholder="Search tags..." 
              value={search}
              onValueChange={setSearch}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty className="py-3 px-4">
                <div className="space-y-2">
                  <p className="text-sm">No tags found.</p>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      placeholder="Add custom tag..."
                      className="h-8 flex-1"
                      onKeyDown={handleKeyPress}
                      ref={inputRef}
                    />
                    <Button 
                      size="sm" 
                      onClick={addCustomTag} 
                      disabled={!customTag.trim()}
                      className="h-8 bg-blue-600 hover:bg-blue-700"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </CommandEmpty>
              <CommandGroup className="max-h-52 overflow-y-auto">
                {filteredTags.map((tag) => (
                  <CommandItem
                    key={tag}
                    onSelect={() => toggleTag(tag)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center">
                      {tag}
                    </div>
                    <Check
                      className={cn(
                        "h-4 w-4 opacity-0 transition-opacity",
                        selectedTags.includes(tag) && "opacity-100"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              {filteredTags.length > 0 && (
                <div className="border-t p-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      placeholder="Add custom tag..."
                      className="h-8 flex-1"
                      onKeyDown={handleKeyPress}
                      ref={inputRef}
                    />
                    <Button 
                      size="sm" 
                      onClick={addCustomTag} 
                      disabled={!customTag.trim()}
                      className="h-8 bg-blue-600 hover:bg-blue-700"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Display selected tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="default"
              className="py-1 px-2 bg-blue-100 text-blue-800 hover:bg-blue-200"
            >
              #{tag}
              <button
                className="ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => toggleTag(tag)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}