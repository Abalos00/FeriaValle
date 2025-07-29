import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';

interface WelcomeAnimationProps {
  onComplete: () => void;
}

export const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ onComplete }) => {
  const [showCircle, setShowCircle] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCircle(false);
      setTimeout(onComplete, 300);
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!showCircle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
      {/* Expanding Circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 bg-white rounded-full animate-expand-circle" />
      </div>
      
      {/* Welcome Content */}
      <div className="relative z-10 text-center text-white animate-fade-in-up">
        <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mx-auto mb-6 backdrop-blur-sm">
          <ShoppingCart className="w-10 h-10 text-white animate-bounce-gentle" />
        </div>
        <h1 className="text-3xl font-bold mb-2">¡Bienvenido!</h1>
        <p className="text-lg text-primary-100">FeriaValle - Control de Ventas Gratuito</p>
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};