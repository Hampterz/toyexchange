import { useEffect, useState } from "react";
import { Share2, ArrowLeft, Check, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import confetti from "react-confetti";
import { Toy } from "@shared/schema";
import { SiWhatsapp } from "react-icons/si";

interface ToySuccessPageProps {
  isOpen: boolean;
  onClose: () => void;
  toy: Toy | null;
}

export function ToySuccessPage({ isOpen, onClose, toy }: ToySuccessPageProps) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(confettiTimer);
    };
  }, []);

  const shareToy = (platform: "facebook" | "twitter" | "linkedin" | "whatsapp") => {
    if (!toy) return;

    const toyUrl = `${window.location.origin}/toy/${toy.id}`;
    const title = `Check out this toy: ${toy.title} on ToyShare!`;
    const text = `I just shared a ${toy.condition} ${toy.title} on ToyShare. It's looking for a new home! #ToyShare #SustainableToys`;

    let shareUrl = "";
    
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(toyUrl)}&quote=${encodeURIComponent(text)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(toyUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(toyUrl)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${toyUrl}`)}`;
        break;
    }

    window.open(shareUrl, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {showConfetti && (
          <confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.2}
          />
        )}
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-center">Toy Successfully Shared!</DialogTitle>
          <p className="text-muted-foreground mt-2">
            Your toy is now visible to families in your community. Share it to expand its reach!
          </p>
        </DialogHeader>

        <div className="flex flex-col space-y-4 py-3">
          {toy && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                {toy.images && toy.images.length > 0 && (
                  <img 
                    src={toy.images[0]} 
                    alt={toy.title} 
                    className="h-16 w-16 rounded-md object-cover" 
                  />
                )}
                <div>
                  <h3 className="font-medium">{toy.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {toy.condition} · {toy.ageRange} · {toy.category}
                  </p>
                </div>
              </div>
            </div>
          )}

          <p className="text-sm font-medium">Share your listing:</p>
          <div className="flex justify-center space-x-3">
            <Button 
              onClick={() => shareToy("facebook")} 
              variant="outline" 
              className="p-2 h-auto w-auto"
              aria-label="Share on Facebook"
            >
              <Facebook className="h-5 w-5 text-blue-600" />
            </Button>
            <Button 
              onClick={() => shareToy("twitter")} 
              variant="outline" 
              className="p-2 h-auto w-auto"
              aria-label="Share on Twitter"
            >
              <Twitter className="h-5 w-5 text-blue-400" />
            </Button>
            <Button 
              onClick={() => shareToy("linkedin")} 
              variant="outline" 
              className="p-2 h-auto w-auto"
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="h-5 w-5 text-blue-700" />
            </Button>
            <Button 
              onClick={() => shareToy("whatsapp")} 
              variant="outline" 
              className="p-2 h-auto w-auto"
              aria-label="Share on WhatsApp"
            >
              <SiWhatsapp className="h-5 w-5 text-green-500" />
            </Button>
          </div>

          <div className="text-sm text-center py-2">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <p className="text-blue-700 font-medium">Impact Stats</p>
              <p className="text-blue-600 text-xs mt-1">
                You've shared {toy?.userId ? "your first" : "another"} toy! 
                Toy sharing reduces waste in landfills and helps other families.
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-3">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <Button
              className="bg-blue-700 hover:bg-blue-800"
              onClick={() => {
                onClose();
                window.location.href = `/toy/${toy?.id}`;
              }}
            >
              <Share2 className="mr-2 h-4 w-4" />
              View Listing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}