import React, { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';

type ConfettiEffectProps = {
  duration?: number; // Duration in milliseconds
  recycle?: boolean; // Whether to recycle confetti
  numberOfPieces?: number; // Number of confetti pieces
};

// Reusable confetti component that automatically handles cleanup
export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({
  duration = 5000,
  recycle = false,
  numberOfPieces = 200,
}) => {
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ 
    width: window.innerWidth,
    height: window.innerHeight, 
  });
  
  const [showConfetti, setShowConfetti] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Auto-hide confetti after specified duration
    if (!recycle && duration > 0) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, duration);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [duration, recycle]);

  if (!showConfetti) return null;

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      numberOfPieces={numberOfPieces}
      recycle={recycle}
      gravity={0.15}
      colors={['#4299e1', '#3182ce', '#2b6cb0', '#ebf8ff', '#bee3f8']} // Blue-themed confetti to match app colors
      confettiSource={{
        x: dimensions.width / 2,
        y: dimensions.height / 3,
        w: 0,
        h: 0,
      }}
    />
  );
};

export default ConfettiEffect;