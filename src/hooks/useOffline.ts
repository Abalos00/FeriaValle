import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const useOffline = () => {
  const { setOfflineStatus } = useStore();

  useEffect(() => {
    const handleOnline = () => setOfflineStatus(false);
    const handleOffline = () => setOfflineStatus(true);

    // Set initial status
    setOfflineStatus(!navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOfflineStatus]);
};