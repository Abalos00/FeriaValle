import React, { useEffect } from 'react';
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

function App() {
  const { currentView, showWelcome, setShowWelcome } = useStore();
  const { showTutorial, completeTutorial, skipTutorial } = useTutorial();
  
  // Initialize offline detection
  useOffline();

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator && !window.location.hostname.includes('stackblitz')) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {showWelcome && <WelcomeAnimation onComplete={handleWelcomeComplete} />}
      <TutorialOverlay 
        isActive={showTutorial}
        onComplete={completeTutorial}
        onSkip={skipTutorial}
      />
      <Navbar />
      <main className="animate-fade-in">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;