import React, { useState } from 'react';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Award, Leaf, Heart, Star, Zap, Shield, Trophy } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface UserBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  badgeName: string;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  iconOnly?: boolean;
}

const badgeConfig: Record<string, {
  icon: React.ReactNode;
  description: string;
  color: string;
}> = {
  'eco_champion': {
    icon: <Leaf className="h-3 w-3" />,
    description: 'Eco Champion: Significantly contributed to reducing waste through recycling toys',
    color: 'bg-green-100 text-green-800 hover:bg-green-200',
  },
  'super_sharer': {
    icon: <Heart className="h-3 w-3" />,
    description: 'Super Sharer: Shared 20+ toys with the community',
    color: 'bg-pink-100 text-pink-800 hover:bg-pink-200',
  },
  'trusted_member': {
    icon: <Shield className="h-3 w-3" />,
    description: 'Trusted Member: Earned exceptional trust from other community members',
    color: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  },
  'top_contributor': {
    icon: <Star className="h-3 w-3" />,
    description: 'Top Contributor: Among the most active members in the community',
    color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  },
  'safety_advocate': {
    icon: <Shield className="h-3 w-3" />,
    description: 'Safety Advocate: Promotes safe toy sharing practices',
    color: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
  },
  'community_builder': {
    icon: <Award className="h-3 w-3" />,
    description: 'Community Builder: Actively helps grow the ToyShare community',
    color: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  },
  'toy_expert': {
    icon: <Zap className="h-3 w-3" />,
    description: 'Toy Expert: Recognized for expertise in toys and child development',
    color: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
  },
  'newcomer': {
    icon: <Star className="h-3 w-3" />,
    description: 'Newcomer: Just started their toy sharing journey',
    color: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  },
  'pioneer': {
    icon: <Trophy className="h-3 w-3" />,
    description: 'Pioneer: One of the first members of the ToyShare community',
    color: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
  },
};

export function UserBadge({
  badgeName,
  showTooltip = false,
  size = 'md',
  className,
  iconOnly = false,
  ...props
}: UserBadgeProps) {
  const badgeInfo = badgeConfig[badgeName] || {
    icon: <Award className="h-3 w-3" />,
    description: badgeName,
    color: 'bg-primary/10 text-primary hover:bg-primary/20',
  };

  const formattedBadgeName = badgeName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const sizeClasses = {
    sm: 'text-xs py-0 px-1.5',
    md: 'text-sm py-0.5 px-2',
    lg: 'text-base py-1 px-2.5',
  };

  const badge = (
    <Badge
      variant="outline"
      className={cn(
        badgeInfo.color,
        'font-medium border-transparent flex items-center gap-1',
        iconOnly && 'px-1 py-1 rounded-full',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {badgeInfo.icon}
      {!iconOnly && <span>{formattedBadgeName}</span>}
    </Badge>
  );

  return showTooltip ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <p>{badgeInfo.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    badge
  );
}