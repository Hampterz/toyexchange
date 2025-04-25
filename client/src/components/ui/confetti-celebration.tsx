import React, { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  delay: number;
  duration: number;
}

interface ConfettiCelebrationProps {
  trigger: boolean;
  count?: number;
  duration?: number;
  colors?: string[];
  onComplete?: () => void;
}

export function ConfettiCelebration({
  trigger,
  count = 100,
  duration = 3000,
  colors = ['#3b82f6', '#22d3ee', '#10b981', '#fbbf24', '#f87171', '#a78bfa'],
  onComplete
}: ConfettiCelebrationProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [active, setActive] = useState(false);

  // Generate confetti pieces when triggered
  useEffect(() => {
    if (trigger && !active) {
      const pieces: ConfettiPiece[] = [];
      
      for (let i = 0; i < count; i++) {
        pieces.push({
          id: i,
          x: Math.random() * 100, // Random horizontal position (0-100%)
          y: -10, // Start slightly above viewport
          size: Math.random() * 1 + 0.5, // Random size (0.5-1.5)
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360, // Random initial rotation
          delay: Math.random() * 1000, // Random start delay (0-1000ms)
          duration: Math.random() * 2000 + duration // Random duration
        });
      }
      
      setConfetti(pieces);
      setActive(true);
      
      // Clear confetti after the longest piece duration
      const maxDuration = Math.max(...pieces.map(p => p.delay + p.duration)) + 500;
      
      const timer = setTimeout(() => {
        setConfetti([]);
        setActive(false);
        if (onComplete) onComplete();
      }, maxDuration);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, active, count, duration, colors, onComplete]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}rem`,
            height: `${piece.size}rem`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            animation: `confetti-fall ${piece.duration}ms ${piece.delay}ms linear forwards`,
            opacity: 0 // Start invisible (animation will set to 1)
          }}
        />
      ))}
    </div>
  );
}