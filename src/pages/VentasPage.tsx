import React from 'react';
import { SaleForm } from '../components/sales/SaleForm';
import { SalesList } from '../components/sales/SalesList';
import { Card } from '../components/ui/Card';

export const VentasPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-r from-primary-500/15 to-transparent border-0 text-gray-900">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary-600">Panel diario</p>
            <h2 className="text-2xl font-semibold text-gray-900">Registra y visualiza tus ventas</h2>
            <p className="text-sm text-gray-600">
              Ingresa nuevas operaciones y revisa el resumen del día en un mismo lugar.
            </p>
          </div>
          <div className="bg-white rounded-2xl px-4 py-3 shadow-inner text-sm text-gray-600">
            Consejo: haz un respaldo al terminar tu jornada para evitar pérdidas.
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SaleForm />
        <SalesList />
      </div>
    </div>
  );
};
