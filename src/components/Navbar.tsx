import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ShoppingCart, Package, BarChart3, HelpCircle, Wifi, WifiOff, Menu } from 'lucide-react';
import { useStore } from '../store/useStore';

const navItems = [
  { id: 'ventas', label: 'Ventas', icon: ShoppingCart, tutorialId: 'ventas-btn' },
  { id: 'inventario', label: 'Inventario', icon: Package, tutorialId: 'inventario-btn' },
  { id: 'reportes', label: 'Reportes', icon: BarChart3, tutorialId: 'reportes-btn' },
  { id: 'ayuda', label: 'Ayuda', icon: HelpCircle, tutorialId: 'ayuda-btn' },
] as const;

interface NavbarProps {
  onOpenStatusPanel: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenStatusPanel }) => {
  const { currentView, setCurrentView, isOffline } = useStore();
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState<{ width: number; left: number }>({ width: 0, left: 0 });
  const StatusIcon = isOffline ? WifiOff : Wifi;

  const updateIndicator = useCallback(() => {
    const container = navContainerRef.current;
    const activeBtn = navRefs.current[currentView];
    if (container && activeBtn) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      setIndicatorStyle({
        width: btnRect.width,
        left: btnRect.left - containerRect.left,
      });
    }
  }, [currentView]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  return (
    <nav className="sticky top-6 z-40 px-4" data-tutorial="navbar">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 rounded-[32px] border border-white/80 bg-white/95 px-6 py-4 text-gray-900 shadow-[0_25px_80px_rgba(15,23,42,0.15)] md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 shadow-inner">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">FeriaValle</p>
              <h1 className="text-2xl font-semibold font-display text-gray-900">Controla tus ventas</h1>
              <p className="text-sm text-gray-500">Funciona con o sin conexión</p>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <div
              className="relative flex items-center gap-2 md:justify-center rounded-2xl border border-gray-100 bg-gray-50 px-2 py-2 overflow-x-auto no-scrollbar"
              ref={navContainerRef}
            >
              <span
                className="absolute top-2 bottom-2 left-0 rounded-2xl bg-white shadow-[0_8px_20px_rgba(59,130,246,0.15)] transition-all duration-300"
                style={{
                  width: indicatorStyle.width,
                  left: indicatorStyle.left,
                }}
              />
              {navItems.map(({ id, label, icon: Icon, tutorialId }) => (
                <button
                  key={id}
                  ref={(el) => {
                    navRefs.current[id] = el;
                  }}
                  data-tutorial={tutorialId}
                  onClick={() => setCurrentView(id)}
                  className={`relative z-10 flex flex-shrink-0 items-center space-x-2 px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    currentView === id ? 'text-primary-700' : 'text-gray-500'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2" data-tutorial="status">
            <div
              className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center space-x-2 ${
                isOffline ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              <StatusIcon className="h-4 w-4" />
              <div className="leading-tight">
                <p>{isOffline ? 'Sin conexión' : 'En línea'}</p>
                <p className="text-[11px] font-normal">
                  {isOffline ? 'Guardando en tu dispositivo' : 'Respaldos disponibles'}
                </p>
              </div>
            </div>
            <button
              className="lg:hidden w-10 h-10 rounded-2xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors"
              onClick={onOpenStatusPanel}
              aria-label="Abrir panel de estado"
            >
              <Menu className="w-5 h-5 mx-auto" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
