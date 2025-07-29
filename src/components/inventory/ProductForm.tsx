import React, { useState } from 'react';
import { Plus, Edit, Receipt } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Product } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { formatCurrency, parseCurrency } from '../../utils';

interface ProductFormProps {
  product?: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addProduct, updateProduct } = useStore();
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    cost: product?.cost || 0,
    stock: product?.stock || 0,
    category: product?.category || '',
   useHonorarios: product?.useHonorarios || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const honorarios = formData.useHonorarios ? calculateHonorarios(formData.price) : 0;
  const gananciaNeta = formData.price - formData.cost - honorarios;

  if (gananciaNeta <= 0) {
    alert("El precio debe ser mayor que el costo + honorarios.");
    return;
  }

  if (formData.stock < 0) {
    alert("El stock no puede ser negativo.");
    return;
  }

  if (product) {
    updateProduct(product.id, formData);
  } else {
    addProduct(formData);
  }

  onClose();

  // Reset form only if creating a new product
  if (!product) {
    setFormData({
      name: '',
      price: 0,
      cost: 0,
      stock: 0,
      category: '',
      useHonorarios: false,
    });
  }
};

  const handlePriceChange = (value: string, field: 'price' | 'cost') => {
    const numericValue = parseCurrency(value);
    setFormData({ ...formData, [field]: numericValue });
  };

  const calculateHonorarios = (price: number) => {
    return price * 0.145; // 14.5%
  };

  const finalProfit = formData.useHonorarios 
    ? formData.price - formData.cost - calculateHonorarios(formData.price)
    : formData.price - formData.cost;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Editar Producto' : 'Nuevo Producto'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre del Producto"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Collar artesanal"
          fullWidth
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Precio de Venta"
            type="number"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            placeholder="0"
            fullWidth
            required
          />

          <Input
            label="Costo del Producto"
            type="number"
            min="0"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
            placeholder="0"
            fullWidth
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Stock Inicial"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
            fullWidth
            required
          />

          <Input
            label="Categoría (opcional)"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Ej: Accesorios"
            fullWidth
          />
        </div>

        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <input
            type="checkbox"
            id="useHonorarios"
            checked={formData.useHonorarios}
            onChange={(e) => setFormData({ ...formData, useHonorarios: e.target.checked })}
            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="useHonorarios" className="flex items-center space-x-2 text-sm font-medium text-blue-800">
            <Receipt className="w-4 h-4" />
            <span>Uso boletas de honorarios (14.5% descuento)</span>
          </label>
        </div>
        {formData.price > 0 && formData.cost > 0 && (
          <div className="bg-success-50 rounded-lg p-4 space-y-2">
            <div className="text-sm text-success-700">
              <span className="font-medium">Precio de venta:</span> {formatCurrency(formData.price)}
            </div>
            <div className="text-sm text-success-700">
              <span className="font-medium">Costo del producto:</span> {formatCurrency(formData.cost)}
            </div>
            {formData.useHonorarios && (
              <div className="text-sm text-warning-700">
                <span className="font-medium">Honorarios (14.5%):</span> {formatCurrency(calculateHonorarios(formData.price))}
              </div>
            )}
            <div className="text-sm text-success-700 pt-2 border-t border-success-200">
              <span className="font-medium">Ganancia neta por unidad:</span>{' '}
              <span className="text-lg font-bold">{formatCurrency(finalProfit)}</span>
              <span className="text-xs ml-1">
                ({Math.round((finalProfit / formData.price) * 100)}% margen neto)
              </span>
            </div>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} fullWidth>
            Cancelar
          </Button>
          <Button
            type="submit"
            icon={product ? Edit : Plus}
            fullWidth
          >
            {product ? 'Actualizar' : 'Crear'} Producto
          </Button>
        </div>
      </form>
    </Modal>
  );
};