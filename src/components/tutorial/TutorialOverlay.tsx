import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Lightbulb, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: '¡Bienvenido a FeriaValle!',
    description: 'Te guiaremos por las funciones principales de tu nueva herramienta gratuita de control de ventas.',
    targetSelector: '[data-tutorial="navbar"]',
    position: 'bottom',
    icon: Lightbulb,
  },
  {
    id: 'ventas',
    title: 'Sección Ventas',
    description: 'Aquí podrás registrar tus ventas diarias de forma rápida. Selecciona productos, cantidades y métodos de pago.',
    targetSelector: '[data-tutorial="ventas-btn"]',
    position: 'bottom',
  },
  {
    id: 'inventario',
    title: 'Gestión de Inventario',
    description: 'Administra tus productos, precios, stock y costos. También puedes configurar boletas de honorarios aquí.',
    targetSelector: '[data-tutorial="inventario-btn"]',
    position: 'bottom',
  },
  {
    id: 'reportes',
    title: 'Reportes y Estadísticas',
    description: 'Visualiza tus ingresos, ganancias y productos más vendidos. Exporta datos en PDF o CSV.',
    targetSelector: '[data-tutorial="reportes-btn"]',
    position: 'bottom',
  },
  {
    id: 'ayuda',
    title: 'Centro de Ayuda',
    description: 'Encuentra tutoriales detallados, preguntas frecuentes y contacto para soporte técnico.',
    targetSelector: '[data-tutorial="ayuda-btn"]',
    position: 'bottom',
  },
  {
    id: 'offline',
    title: 'Funciona Sin Internet',
    description: 'Usa el indicador superior para confirmar tu estado de conexión y continúa trabajando sin internet.',
    targetSelector: '[data-tutorial="status"]',
    position: 'left',
  },
  {
    id: 'backup',
    title: 'Respaldos Locales',
    description: 'Genera copias de seguridad y restaura tus datos desde la barra de estado.',
    targetSelector: '[data-tutorial="backup-controls"]',
    position: 'bottom',
    icon: ShieldCheck,
  },
];

interface TutorialOverlayProps {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  isActive,
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!isActive) return;

    const updateTargetElement = () => {
      const step = tutorialSteps[currentStep];
      const element = document.querySelector(step.targetSelector) as HTMLElement;
      
      if (element) {
        setTargetElement(element);
        
        // Calculate tooltip position
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        let top = 0;
        let left = 0;
        
        switch (step.position) {
          case 'bottom':
            top = rect.bottom + scrollTop + 10;
            left = rect.left + scrollLeft + (rect.width / 2);
            break;
          case 'top':
            top = rect.top + scrollTop - 10;
            left = rect.left + scrollLeft + (rect.width / 2);
            break;
          case 'right':
            top = rect.top + scrollTop + (rect.height / 2);
            left = rect.right + scrollLeft + 10;
            break;
          case 'left':
            top = rect.top + scrollTop + (rect.height / 2);
            left = rect.left + scrollLeft - 10;
            break;
        }
        
        setTooltipPosition({ top, left });
      }
    };

    // Initial update
    updateTargetElement();
    
    // Update on resize
    window.addEventListener('resize', updateTargetElement);
    
    return () => {
      window.removeEventListener('resize', updateTargetElement);
    };
  }, [currentStep, isActive]);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = () => {
    onSkip();
  };

  if (!isActive || !targetElement) return null;

  const step = tutorialSteps[currentStep];
  const Icon = step.icon;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      
      {/* Highlight */}
      <div
        className="fixed z-50 pointer-events-none"
        style={{
          top: targetElement.offsetTop - 4,
          left: targetElement.offsetLeft - 4,
          width: targetElement.offsetWidth + 8,
          height: targetElement.offsetHeight + 8,
          border: '3px solid #3B82F6',
          borderRadius: '8px',
          boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.3)',
          animation: 'pulse 2s infinite',
        }}
      />

      {/* Tooltip */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm animate-fade-in"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: step.position === 'bottom' || step.position === 'top' 
            ? 'translateX(-50%)' 
            : step.position === 'left' 
              ? 'translate(-100%, -50%)' 
              : 'translateY(-50%)',
        }}
      >
        {/* Arrow */}
        <div
          className={`absolute w-3 h-3 bg-white border transform rotate-45 ${
            step.position === 'bottom' 
              ? '-top-1.5 left-1/2 -translate-x-1/2 border-b-0 border-r-0' 
              : step.position === 'top'
                ? '-bottom-1.5 left-1/2 -translate-x-1/2 border-t-0 border-l-0'
                : step.position === 'right'
                  ? '-left-1.5 top-1/2 -translate-y-1/2 border-r-0 border-b-0'
                  : '-right-1.5 top-1/2 -translate-y-1/2 border-l-0 border-t-0'
          }`}
        />

        <div className="flex items-start space-x-3 mb-4">
          {Icon && (
            <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-lg flex-shrink-0">
              <Icon className="w-4 h-4 text-primary-600" />
            </div>
          )}
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
            <p className="text-sm text-gray-600">{step.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {currentStep + 1} de {tutorialSteps.length}
            </span>
            <div className="flex space-x-1">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={skipTutorial}
              className="text-xs"
            >
              Saltar
            </Button>
            
            {currentStep > 0 && (
              <Button
                variant="secondary"
                size="sm"
                icon={ArrowLeft}
                onClick={prevStep}
                className="!p-2"
              />
            )}
            
            <Button
              variant="primary"
              size="sm"
              icon={currentStep === tutorialSteps.length - 1 ? X : ArrowRight}
              onClick={nextStep}
              className="!p-2"
            />
          </div>
        </div>
      </div>
    </>
  );
};
