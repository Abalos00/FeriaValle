import React, { useState, useEffect } from 'react';
import { ShoppingCart, Wifi, ShieldCheck } from 'lucide-react';

interface WelcomeAnimationProps {
  onComplete: () => void;
}

interface Slide {
  title: string;
  description: string;
  highlight: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const slides: Slide[] = [
  {
    title: 'Bienvenido a FeriaValle',
    description: 'Tu panel gratuito para registrar ventas y controlar tu negocio.',
    highlight: 'Listo para usar en segundos',
    icon: ShoppingCart,
  },
  {
    title: 'Funciona sin conexión',
    description: 'Sigue vendiendo aunque te quedes sin internet, todo queda guardado localmente.',
    highlight: 'Datos seguros en tu dispositivo',
    icon: Wifi,
  },
  {
    title: 'Respaldos inteligentes',
    description: 'Genera y restaura copias de seguridad en un par de clics.',
    highlight: 'Recupera tu información cuando quieras',
    icon: ShieldCheck,
  },
];

export const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev >= slides.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1700);

    const exitTimer = window.setTimeout(() => {
      setVisible(false);
      window.setTimeout(onComplete, 350);
    }, slides.length * 1700 + 600);

    return () => {
      clearInterval(interval);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
      <div className="absolute inset-x-0 top-0 h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-500"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      <div className="absolute inset-0 opacity-40">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-primary-400/30 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-xl px-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl animate-fade-in-up">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Icon className="w-8 h-8 animate-bounce-gentle" />
            </div>
            <div>
              <p className="uppercase text-xs tracking-widest text-primary-100">Primer ingreso</p>
              <h1 className="text-3xl font-bold">{slide.title}</h1>
            </div>
          </div>

          <p className="text-primary-50 text-lg mb-4">{slide.description}</p>

          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-sm text-white/90 mb-8">
            {slide.highlight}
          </div>

          <div className="flex items-center space-x-3 text-sm text-primary-100">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  index <= currentSlide ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
