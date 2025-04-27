import React from 'react';
import { BADGES } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';

interface SustainabilityBadgeProps {
  badge?: string;
  user?: any; // Allow passing user object with currentBadge property
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SustainabilityBadge: React.FC<SustainabilityBadgeProps> = ({ 
  badge,
  user,
  size = 'md',
  className = ''
}) => {
  // Determine which badge to display - from direct prop or from user object
  const badgeName = badge || (user?.currentBadge) || 'Newcomer';
  
  // Find the badge in the schema
  const badgeInfo = Object.values(BADGES).find(b => b.name === badgeName) || BADGES.NEWCOMER;
  
  // Set size-based styles
  const sizeClasses = {
    sm: {
      card: "p-1",
      icon: "text-xl mr-1",
      title: "text-sm font-medium",
      subtitle: "text-xs"
    },
    md: {
      card: "p-3",
      icon: "text-3xl mr-2",
      title: "text-lg font-semibold",
      subtitle: "text-sm"
    },
    lg: {
      card: "p-4",
      icon: "text-4xl mr-3",
      title: "text-xl font-bold",
      subtitle: "text-base"
    }
  };
  
  const currentSize = sizeClasses[size];
  
  return (
    <Card className={`${badgeInfo.bgColor} border-none ${currentSize.card} ${className}`}>
      <CardContent className="flex items-center p-0">
        <span className={`${currentSize.icon}`} role="img" aria-label={badgeInfo.name}>
          {badgeInfo.icon}
        </span>
        <div>
          <h3 className={`${badgeInfo.color} ${currentSize.title}`}>
            {badgeInfo.name}
          </h3>
          <p className={`${currentSize.subtitle} text-muted-foreground`}>
            Sustainability level
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SustainabilityBadge;