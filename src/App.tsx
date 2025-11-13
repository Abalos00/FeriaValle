import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { WelcomeAnimation } from './components/WelcomeAnimation';
import { VentasPage } from './pages/VentasPage';
import { InventarioPage } from './pages/InventarioPage';
import { ReportesPage } from './pages/ReportesPage';
import { AyudaPage } from './pages/AyudaPage';
import { useStore } from './store/useStore';
import { useOffline } from './hooks/useOffline';
import { useTutorial } from './hooks/useTutorial';
import { TutorialOverlay } from './components/tutorial/TutorialOverlay';
import { StatusSidebar } from './components/offline/StatusSidebar';

function App() {
  const { currentView, showWelcome, setShowWelcome } = useStore();
  const { showTutorial, completeTutorial, skipTutorial } = useTutorial();
  const [mobileStatusOpen, setMobileStatusOpen] = useState(false);
  
  // Initialize offline detection
  useOffline();

  // Register service worker for PWA
  useEffect(() => {
    if (
      'serviceWorker' in navigator &&
      import.meta.env.PROD &&
      !window.location.hostname.includes('stackblitz')
    ) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'ventas':
        return <VentasPage />;
      case 'inventario':
        return <InventarioPage />;
      case 'reportes':
        return <ReportesPage />;
      case 'ayuda':
        return <AyudaPage />;
      default:
        return <VentasPage />;
    }
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-70 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_45%)] pointer-events-none" />
      {showWelcome && <WelcomeAnimation onComplete={handleWelcomeComplete} />}
      <TutorialOverlay 
        isActive={showTutorial && !showWelcome}
        onComplete={completeTutorial}
        onSkip={skipTutorial}
      />
      <div className="relative z-10">
        <Navbar onOpenStatusPanel={() => setMobileStatusOpen(true)} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-6 lg:flex-row lg:items-start">
          <main className="flex-1 animate-fade-in">
            <div className="rounded-[36px] bg-white/95 p-6 sm:p-10 shadow-[0_45px_120px_rgba(15,23,42,0.25)] border border-white/80">
              {renderCurrentView()}
            </div>
          </main>
          <StatusSidebar isMobileOpen={mobileStatusOpen} onCloseMobile={() => setMobileStatusOpen(false)} />
        </div>
      </div>
    </div>
  );
}

export default App;
