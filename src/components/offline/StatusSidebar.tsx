import React, { useRef } from 'react';
import { Wifi, WifiOff, UploadCloud, DownloadCloud, AlertTriangle, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStore } from '../../store/useStore';
import { useBackupManager } from '../../hooks/useBackupManager';
import { Button } from '../ui/Button';

interface StatusSidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const StatusSidebar: React.FC<StatusSidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const isOffline = useStore((state) => state.isOffline);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    backupToFile,
    restoreFromFile,
    storageUsage,
    lastBackup,
    isBackingUp,
    isRestoring,
    error,
    clearError,
    restoreAutomatic,
  } = useBackupManager();

  const StatusIcon = isOffline ? WifiOff : Wifi;

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      restoreFromFile(file);
      event.target.value = '';
    }
  };

  const Content = () => (
    <div className="space-y-5">
      <div className="flex items-start space-x-4">
        <div
          className={`p-3 rounded-2xl ${
            isOffline ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
          }`}
        >
          <StatusIcon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-semibold">
            {isOffline ? 'Modo sin conexión activo' : 'Modo en línea'}
          </p>
          <p className="text-xs text-gray-500">
            {isOffline
              ? 'Continúa registrando ventas sin internet; sincroniza cuando vuelvas a estar online.'
              : 'Momento perfecto para generar o restaurar un respaldo.'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {lastBackup
              ? `Último respaldo ${formatDistanceToNow(lastBackup, {
                  locale: es,
                  addSuffix: true,
                })}`
              : 'Aún no generas un respaldo local.'}
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Almacenamiento local utilizado</span>
          <span>
            {storageUsage.label} • {storageUsage.percent}%
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              storageUsage.percent > 85 ? 'bg-rose-400' : 'bg-gradient-to-r from-primary-400 to-primary-600'
            }`}
            style={{ width: `${storageUsage.percent}%` }}
          />
        </div>
        {storageUsage.percent > 85 && (
          <p className="text-xs text-rose-500 mt-1">
            Libera espacio exportando datos o eliminando registros que ya no necesitas.
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          icon={UploadCloud}
          onClick={backupToFile}
          loading={isBackingUp}
        >
          Respaldo
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={DownloadCloud}
          onClick={restoreAutomatic}
          loading={isRestoring}
        >
          Restaurar
        </Button>
        <button
          type="button"
          className="text-xs text-gray-500 underline hover:text-gray-800"
          onClick={() => fileInputRef.current?.click()}
        >
          Importar archivo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-full max-w-xs">
        <div className="rounded-[28px] border border-gray-100 bg-white/95 px-6 py-5 text-gray-900 shadow-[0_18px_60px_rgba(15,23,42,0.12)] sticky top-32">
          <Content />
        </div>
      </aside>

      <div
        className={`lg:hidden fixed inset-0 z-50 transition ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={onCloseMobile} />
        <div
          className={`absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-[0_25px_80px_rgba(0,0,0,0.25)] p-6 flex flex-col gap-4 transform transition-transform duration-300 ${
            isMobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">Estado y respaldos</p>
            <button
              className="w-9 h-9 rounded-full border border-gray-200 text-gray-500 flex items-center justify-center hover:text-gray-900"
              onClick={onCloseMobile}
              aria-label="Cerrar panel de estado"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <Content />
        </div>
      </div>

      {error && (
        <div className="bg-danger-50 border-y border-danger-100 mt-4 lg:mt-6">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-danger-700 text-sm">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-danger-600 font-semibold text-xs uppercase tracking-wide"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
