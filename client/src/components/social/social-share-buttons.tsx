import { Facebook, Twitter, Linkedin, Mail, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export function SocialShareButtons({ url, title, description = "" }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  
  // Encode text for URLs
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || title);
  const encodedUrl = encodeURIComponent(url);
  
  // Handle copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  // Check if the Web Share API is supported
  const isWebShareSupported = () => {
    return navigator.share !== undefined;
  };

  // Handle sharing with Web Share API (mobile devices)
  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: title,
        text: description,
        url: url,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {isWebShareSupported() && (
        <Button
          variant="outline"
          size="sm"
          className="bg-white text-primary hover:bg-primary hover:text-white border-primary"
          onClick={handleNativeShare}
        >
          <span className="mr-1">Share</span>
          <i className="fas fa-share-alt text-xs"></i>
        </Button>
      )}
      
      <TooltipProvider>
        {/* Facebook */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white text-[#1877F2] hover:bg-[#1877F2] hover:text-white border-[#1877F2]"
              onClick={() => {
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
                  "_blank",
                  "width=600,height=400"
                );
              }}
            >
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Share on Facebook</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on Facebook</p>
          </TooltipContent>
        </Tooltip>
        
        {/* Twitter */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white border-[#1DA1F2]"
              onClick={() => {
                window.open(
                  `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
                  "_blank",
                  "width=600,height=400"
                );
              }}
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Share on Twitter</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on Twitter</p>
          </TooltipContent>
        </Tooltip>
        

        
        {/* Email */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white text-gray-500 hover:bg-gray-500 hover:text-white border-gray-300"
              onClick={() => {
                window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;
              }}
            >
              <Mail className="h-4 w-4" />
              <span className="sr-only">Share via Email</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share via Email</p>
          </TooltipContent>
        </Tooltip>
        
        {/* Copy Link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white border-gray-300"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy Link</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? "Copied!" : "Copy Link"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}