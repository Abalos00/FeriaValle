import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useStore } from '../store/useStore';

const BACKUP_TIMESTAMP_KEY = 'feriavalle-backup-timestamp';
const STORAGE_LIMIT_BYTES = 5 * 1024 * 1024; // Approximate browser limit (5MB)
const BACKUP_DIRECTORY = 'feriavalle-backups';
const BACKUP_FILENAME = 'ultimo-respaldo.json';

declare global {
  interface StorageManager {
    getDirectory?: () => Promise<FileSystemDirectoryHandle>;
  }

  interface FileSystemDirectoryHandle {
    getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<FileSystemDirectoryHandle>;
    getFileHandle(name: string, options?: { create?: boolean }): Promise<FileSystemFileHandle>;
  }

  interface FileSystemFileHandle {
    createWritable(): Promise<FileSystemWritableFileStream>;
    getFile(): Promise<File>;
  }

  interface FileSystemWritableFileStream extends WritableStream {
    write(data: Blob | string): Promise<void>;
    close(): Promise<void>;
  }
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 KB';
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(0)} KB`;
  }
  return `${(kb / 1024).toFixed(1)} MB`;
};

const calculateUsage = () => {
  try {
    const serialized = localStorage.getItem('feriavalle-storage');
    if (!serialized) {
      return { bytes: 0, label: '0 KB', percent: 0 };
    }
    const encoder = new TextEncoder();
    const bytes = encoder.encode(serialized).length;
    const percent = Math.min(100, Math.round((bytes / STORAGE_LIMIT_BYTES) * 100));
    return { bytes, label: formatBytes(bytes), percent };
  } catch (error) {
    console.error('No pudimos estimar el uso de almacenamiento:', error);
    return { bytes: 0, label: '0 KB', percent: 0 };
  }
};

export const useBackupManager = () => {
  const importData = useStore((state) => state.importData);
  const [storageUsage, setStorageUsage] = useState(() => calculateUsage());

  const [lastBackup, setLastBackup] = useState<Date | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(BACKUP_TIMESTAMP_KEY);
    if (stored) {
      setLastBackup(new Date(stored));
    }
  }, []);

  useEffect(() => {
    const unsubscribe = useStore.subscribe(
      (state) => [state.products, state.sales] as const,
      () => setStorageUsage(calculateUsage()),
      {
        equalityFn: (prev, next) => prev[0] === next[0] && prev[1] === next[1],
      }
    );
    return unsubscribe;
  }, []);

  const backupToFile = async () => {
    setError(null);
    setIsBackingUp(true);

    try {
      const state = useStore.getState();
      const payload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        products: state.products,
        sales: state.sales,
      };
      const serialized = JSON.stringify(payload, null, 2);

      const savedToOPFS = await saveBackupToOPFS(serialized);

      if (!savedToOPFS) {
        downloadBackup(serialized);
      }

      const timestamp = new Date().toISOString();
      localStorage.setItem(BACKUP_TIMESTAMP_KEY, timestamp);
      setLastBackup(new Date(timestamp));
    } catch (err) {
      console.error('No se pudo generar el respaldo:', err);
      setError('No pudimos generar el respaldo. Inténtalo de nuevo.');
    } finally {
      setIsBackingUp(false);
    }
  };

  const restoreFromFile = async (file: File) => {
    setError(null);
    setIsRestoring(true);

    try {
      const content = await file.text();
      const parsed = JSON.parse(content);

      applyBackup(parsed);
    } catch (err) {
      console.error('No se pudo restaurar el respaldo:', err);
      setError('El archivo no es un respaldo válido de FeriaValle.');
    } finally {
      setIsRestoring(false);
    }
  };

  const restoreAutomatic = async () => {
    setError(null);
    setIsRestoring(true);

    try {
      const file = await readBackupFromOPFS();
      if (!file) {
        throw new Error('no backup found');
      }

      const parsed = JSON.parse(await file.text());
      applyBackup(parsed);
    } catch (err) {
      console.error('No se pudo restaurar el respaldo local:', err);
      setError('No encontramos un respaldo guardado en este dispositivo.');
    } finally {
      setIsRestoring(false);
    }
  };

  const clearError = () => setError(null);

  const applyBackup = (parsed: any) => {
    if (!parsed || !Array.isArray(parsed.products) || !Array.isArray(parsed.sales)) {
      throw new Error('invalid backup file');
    }

    importData({
      products: parsed.products,
      sales: parsed.sales,
    });

    const timestamp = parsed.exportedAt || new Date().toISOString();
    localStorage.setItem(BACKUP_TIMESTAMP_KEY, timestamp);
    setLastBackup(new Date(timestamp));
  };

  return {
    backupToFile,
    restoreFromFile,
    restoreAutomatic,
    storageUsage,
    lastBackup,
    isBackingUp,
    isRestoring,
    error,
    clearError,
  };
};

const supportsOPFS = typeof navigator !== 'undefined' && !!navigator.storage && !!navigator.storage.getDirectory;

const saveBackupToOPFS = async (content: string) => {
  if (!supportsOPFS) return false;

  try {
    const root = await navigator.storage.getDirectory!();
    const dir = await root.getDirectoryHandle(BACKUP_DIRECTORY, { create: true });
    const fileHandle = await dir.getFileHandle(BACKUP_FILENAME, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
    return true;
  } catch (error) {
    console.warn('No se pudo guardar el respaldo en almacenamiento local seguro:', error);
    return false;
  }
};

const readBackupFromOPFS = async () => {
  if (!supportsOPFS) return null;

  try {
    const root = await navigator.storage.getDirectory!();
    const dir = await root.getDirectoryHandle(BACKUP_DIRECTORY);
    const fileHandle = await dir.getFileHandle(BACKUP_FILENAME);
    return fileHandle.getFile();
  } catch {
    return null;
  }
};

const downloadBackup = (content: string) => {
  const blob = new Blob([content], {
    type: 'application/json',
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `feriavalle-respaldo-${format(new Date(), 'yyyyMMdd-HHmm')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
