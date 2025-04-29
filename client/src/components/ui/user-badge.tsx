import React from 'react';
import { BADGES } from '@shared/schema';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserBadgeProps {
  badgeName?: string;
  className?: string;
  showTooltip?: boolean;
}

export function UserBadge({ badgeName = 'Newcomer', className = '', showTooltip = true }: UserBadgeProps) {
  const badgeInfo = Object.values(BADGES).find(b => b.name === badgeName) || BADGES.NEWCOMER;
  
  const BadgeIcon = () => (
    <span 
      className={`inline-flex ${className}`}
      aria-label={badgeInfo.name}
    >
      {badgeInfo.icon}
    </span>
  );
  
  if (!showTooltip) {
    return <BadgeIcon />;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">
            <BadgeIcon />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{badgeInfo.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}