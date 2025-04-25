import { useState, useEffect } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  speed: number;
  delay: number;
  rotation: number;
  opacity: number;
}

export function KonamiConfetti() {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Create confetti pieces
    const colors = ['#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD'];
    const pieces: ConfettiPiece[] = [];
    
    for (let i = 0; i < 100; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100, // Random horizontal position (0-100%)
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 1 + 0.5, // Random size (0.5-1.5rem)
        speed: Math.random() * 3 + 2, // Random fall speed (2-5s)
        delay: Math.random() * 1, // Random start delay (0-1s)
        rotation: Math.random() * 360, // Random rotation (0-360deg)
        opacity: Math.random() * 0.6 + 0.4 // Random opacity (0.4-1)
      });
    }
    
    setConfettiPieces(pieces);
    
    // Hide after animation completes
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4000); // Animation lasts for 4 seconds
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${piece.x}%`,
            width: `${piece.size}rem`,
            height: `${piece.size * 0.4}rem`,
            backgroundColor: piece.color,
            animation: `konami-confetti-fall ${piece.speed}s ${piece.delay}s linear forwards`,
            transform: `rotate(${piece.rotation}deg)`,
            opacity: piece.opacity,
          }}
        />
      ))}
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes konami-confetti-fall {
            0% {
              transform: translateY(-10px) rotate(${Math.random() * 360}deg);
              opacity: 1;
            }
            80% {
              opacity: 0.8;
            }
            100% {
              transform: translateY(100vh) rotate(${Math.random() * 720}deg);
              opacity: 0;
            }
          }
        `
      }} />
    </div>
  );
}