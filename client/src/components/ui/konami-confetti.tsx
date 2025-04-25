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
  rotationAnimation: number;
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
        rotationAnimation: Math.random() * 720, // Random rotation during fall (0-720deg)
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
      {confettiPieces.map((piece, index) => (
        <div
          key={piece.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${piece.x}%`,
            width: `${piece.size}rem`,
            height: `${piece.size * 0.4}rem`,
            backgroundColor: piece.color,
            animation: `konami-confetti-fall-${index} ${piece.speed}s ${piece.delay}s linear forwards`,
            opacity: piece.opacity,
          }}
        />
      ))}
      
      <style dangerouslySetInnerHTML={{
        __html: confettiPieces.map((piece, index) => `
          @keyframes konami-confetti-fall-${index} {
            0% {
              transform: translateY(-10px) rotate(${piece.rotation}deg);
              opacity: 1;
            }
            80% {
              opacity: 0.8;
            }
            100% {
              transform: translateY(100vh) rotate(${piece.rotation + piece.rotationAnimation}deg);
              opacity: 0;
            }
          }
        `).join('\n')
      }} />
    </div>
  );
}