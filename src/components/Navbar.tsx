import React from 'react';
import { ShoppingCart, Package, BarChart3, HelpCircle, Wifi, WifiOff } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView, isOffline } = useStore();

  const navItems = [
    { id: 'ventas', label: 'Ventas', icon: ShoppingCart, tutorialId: 'ventas-btn' },
    { id: 'inventario', label: 'Inventario', icon: Package, tutorialId: 'inventario-btn' },
    { id: 'reportes', label: 'Reportes', icon: BarChart3, tutorialId: 'reportes-btn' },
    { id: 'ayuda', label: 'Ayuda', icon: HelpCircle, tutorialId: 'ayuda-btn' },
  ] as const;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40" data-tutorial="navbar">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
              FeriaValle
            </h1>
          </div>

          <div className="flex items-center space-x-1">
            {navItems.map(({ id, label, icon: Icon, tutorialId }) => (
              <button
                key={id}
                data-tutorial={tutorialId}
                onClick={() => setCurrentView(id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === id
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2" data-tutorial="status">
            {isOffline ? (
              <div className="flex items-center space-x-1">
                <WifiOff className="h-4 w-4 text-danger-500" />
                <span className="text-xs text-danger-500 hidden sm:inline">Sin conexión</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Wifi className="h-4 w-4 text-success-500" />
                <span className="text-xs text-success-500 hidden sm:inline">En línea</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};