import { BADGES } from "@shared/schema";
import { User } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SustainabilityBadgeProps {
  user: Omit<User, "password">;
  className?: string;
  showDetails?: boolean;
}

export function SustainabilityBadge({ 
  user, 
  className, 
  showDetails = false 
}: SustainabilityBadgeProps) {
  // Default badge to Newcomer if not defined
  const currentBadge = user.currentBadge || BADGES.NEWCOMER.name;
  
  // Get badge info based on current badge
  const getBadgeInfo = () => {
    let badgeKey = Object.keys(BADGES).find(
      key => BADGES[key as keyof typeof BADGES].name === currentBadge
    ) as keyof typeof BADGES;
    
    // Default to NEWCOMER if no match found
    if (!badgeKey) badgeKey = 'NEWCOMER';
    
    return BADGES[badgeKey];
  };
  
  const badgeInfo = getBadgeInfo();
  const score = user.sustainabilityScore || 0;
  
  // Calculate next badge (if any)
  const getNextBadge = () => {
    const badgeKeys = Object.keys(BADGES) as Array<keyof typeof BADGES>;
    const sortedBadges = badgeKeys
      .map(key => BADGES[key])
      .sort((a, b) => a.minScore - b.minScore);
    
    const currentIndex = sortedBadges.findIndex(badge => badge.name === currentBadge);
    
    // If we're at the highest badge already, or if index is not found
    if (currentIndex === -1 || currentIndex >= sortedBadges.length - 1) {
      return null;
    }
    
    return sortedBadges[currentIndex + 1];
  };
  
  const nextBadge = getNextBadge();
  
  // Calculate progress to next badge
  const calculateProgress = () => {
    if (!nextBadge) return 100; // Already at max badge
    
    const currentMin = badgeInfo.minScore;
    const nextMin = nextBadge.minScore;
    const range = nextMin - currentMin;
    
    // Prevent division by zero
    if (range <= 0) return 100;
    
    const progress = ((score - currentMin) / range) * 100;
    return Math.min(Math.max(progress, 0), 100); // Clamp between 0-100
  };
  
  const progressPercent = calculateProgress();
  
  // Simple badge display for non-detailed views like toy cards
  if (!showDetails) {
    return (
      <div 
        className={cn(
          "flex items-center gap-1.5 text-sm px-2 py-1 rounded-full", 
          badgeInfo.bgColor, 
          badgeInfo.color,
          className
        )}
      >
        <span>{badgeInfo.icon}</span>
        <span className="font-medium">{currentBadge}</span>
      </div>
    );
  }
  
  // Full badge card with details for profile page
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className={cn("pb-2", badgeInfo.bgColor)}>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{badgeInfo.icon}</span>
          <span className={cn("font-bold", badgeInfo.color)}>{currentBadge}</span>
        </CardTitle>
        <CardDescription>
          Sustainability Badge
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sustainability Score</span>
            <span className="font-medium">{score} points</span>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Toys Shared</span>
              <span className="font-medium">{user.toysShared || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Successful Exchanges</span>
              <span className="font-medium">{user.successfulExchanges || 0}</span>
            </div>
          </div>
          
          {nextBadge && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next Badge</span>
                <span className={cn("font-medium", nextBadge.color)}>
                  {nextBadge.icon} {nextBadge.name}
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{score} points</span>
                <span>{nextBadge.minScore} points needed</span>
              </div>
            </div>
          )}
          
          {!nextBadge && (
            <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-600">
              Congratulations! You've reached the highest sustainability badge.
              Thank you for your contributions to reducing toy waste!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}