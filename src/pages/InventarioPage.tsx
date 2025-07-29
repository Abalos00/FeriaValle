import React from 'react';
import { ProductList } from '../components/inventory/ProductList';

export const InventarioPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <ProductList />
    </div>
  );
};