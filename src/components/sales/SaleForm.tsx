import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils';

export const SaleForm: React.FC = () => {
  const { products, addSale } = useStore();
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
    paymentMethod: 'efectivo' as const,
    notes: '',
  });

  const selectedProduct = products.find(p => p.id === formData.productId);
  const totalPrice = selectedProduct ? selectedProduct.price * formData.quantity : 0;
  const profit = selectedProduct 
    ? selectedProduct.useHonorarios
      ? (selectedProduct.price - selectedProduct.cost - (selectedProduct.price * 0.145)) * formData.quantity
      : (selectedProduct.price - selectedProduct.cost) * formData.quantity
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) return;
    
    if (selectedProduct.stock < formData.quantity) {
      alert('Stock insuficiente para esta venta');
      return;
    }

    addSale({
      productId: formData.productId,
      productName: selectedProduct.name,
      quantity: formData.quantity,
      unitPrice: selectedProduct.price,
      totalPrice,
      profit,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
    });

    // Reset form
    setFormData({
      productId: '',
      quantity: 1,
      paymentMethod: 'efectivo',
      notes: '',
    });
  };

  const productOptions = [
    { value: '', label: 'Seleccionar producto' },
    ...products.map(product => ({
      value: product.id,
      label: `${product.name} (Stock: ${product.stock}) - ${formatCurrency(product.price)}`
    }))
  ];

  const paymentOptions = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'tarjeta', label: 'Tarjeta' },
  ];

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Nueva Venta</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Producto"
          options={productOptions}
          value={formData.productId}
          onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
          fullWidth
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Cantidad"
            type="number"
            min="1"
            max={selectedProduct?.stock || 1}
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
            fullWidth
            required
          />

          <Select
            label="Método de Pago"
            options={paymentOptions}
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
            fullWidth
          />
        </div>

        <Input
          label="Notas (opcional)"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Detalles adicionales..."
          fullWidth
        />

        {selectedProduct && (
          <div className="rounded-2xl p-4 space-y-3 bg-gradient-to-r from-primary-50 to-white border border-primary-100">
            <div className="flex justify-between text-sm">
              <span>Precio unitario:</span>
              <span className="font-medium">{formatCurrency(selectedProduct.price)}</span>
            </div>
           {selectedProduct.useHonorarios && (
             <div className="flex justify-between text-sm">
               <span>Honorarios (14.5%):</span>
               <span className="text-warning-600">-{formatCurrency(selectedProduct.price * 0.145)}</span>
             </div>
           )}
            <div className="flex justify-between text-sm">
              <span>Total:</span>
              <span className="font-semibold text-lg">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
             <span>{selectedProduct.useHonorarios ? 'Ganancia neta:' : 'Ganancia:'}</span>
              <span className="font-medium text-green-600">{formatCurrency(profit)}</span>
            </div>
          </div>
        )}

        <Button
          type="submit"
          icon={Plus}
          fullWidth
          disabled={!formData.productId || products.length === 0}
        >
          Registrar Venta
        </Button>
      </form>
    </Card>
  );
};
