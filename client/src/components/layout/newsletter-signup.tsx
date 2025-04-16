import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function NewsletterSignup({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Thanks for subscribing!",
        description: "You've been added to our newsletter",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className={cn("bg-blue-50 rounded-xl p-6 shadow-sm", className)}>
      <h3 className="text-lg font-semibold text-blue-800 mb-2">
        Join our community
      </h3>
      <p className="text-blue-700 text-sm mb-4">
        Subscribe to our newsletter for toy sharing tips and community updates.
      </p>
      <form onSubmit={handleSubscribe} className="flex gap-2">
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-blue-200 focus:border-blue-400"
          required
        />
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-blue-700 hover:bg-blue-800 transition-colors"
        >
          <Send className="h-4 w-4 mr-2" /> 
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    </div>
  );
}