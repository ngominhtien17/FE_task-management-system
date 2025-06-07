import React from 'react';
import Lottie from 'lottie-react';

interface LottieAnimationProps {
  animationData: object;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export function LottieAnimation({ 
  animationData, 
  className = '', 
  loop = true, 
  autoplay = true 
}: LottieAnimationProps) {
  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      className={className}
      rendererSettings={{
        preserveAspectRatio: 'xMidYMid slice'
      }}
    />
  );
}