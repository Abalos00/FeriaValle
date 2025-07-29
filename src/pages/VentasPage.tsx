import React from 'react';
import { SaleForm } from '../components/sales/SaleForm';
import { SalesList } from '../components/sales/SalesList';

export const VentasPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <SaleForm />
        </div>
        <div>
          <SalesList />
        </div>
      </div>
    </div>
  );
};