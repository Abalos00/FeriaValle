import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, AlertTriangle, Receipt } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Product } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProductForm } from './ProductForm';
import { formatCurrency } from '../../utils';

export const ProductList: React.FC = () => {
  const { products, deleteProduct } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      deleteProduct(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(undefined);
  };

  const lowStockProducts = products.filter(p => p.stock <= 5);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Inventario</h3>
          <Button
            icon={Plus}
            onClick={() => setShowForm(true)}
          >
            Nuevo Producto
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-2">
              <Package className="h-6 w-6 text-primary-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            <p className="text-sm text-gray-600">Productos</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-lg mx-auto mb-2">
              <Package className="h-6 w-6 text-success-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            <p className="text-sm text-gray-600">Valor Total</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-warning-100 rounded-lg mx-auto mb-2">
              <AlertTriangle className="h-6 w-6 text-warning-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{lowStockProducts.length}</p>
            <p className="text-sm text-gray-600">Stock Bajo</p>
          </div>
        </div>
      </Card>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-warning-200 bg-warning-50">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-warning-600" />
            <h4 className="font-medium text-warning-800">Productos con Stock Bajo</h4>
          </div>
          <div className="space-y-2">
            {lowStockProducts.map(product => (
              <div key={product.id} className="flex justify-between items-center text-sm">
                <span className="text-warning-700">{product.name}</span>
                <span className="font-medium text-warning-800">{product.stock} unidades</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Products List */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos</h3>
        
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No tienes productos registrados</p>
            <p className="text-sm">¡Agrega tu primer producto para comenzar!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{product.name}</h4>
                    {product.category && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                    )}
                   {product.useHonorarios && (
                     <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full ml-1">
                       <Receipt className="w-3 h-3 inline mr-1" />
                       Honorarios
                     </span>
                   )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Edit}
                      onClick={() => handleEdit(product)}
                      className="!p-2"
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDelete(product.id)}
                      className="!p-2"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precio:</span>
                    <span className="font-medium">{formatCurrency(product.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Costo:</span>
                    <span>{formatCurrency(product.cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className={`font-medium ${product.stock <= 5 ? 'text-warning-600' : 'text-success-600'}`}>
                      {product.stock} unidades
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ganancia:</span>
                    {product.useHonorarios ? (
                      <div className="text-right">
                        <div className="font-medium text-success-600">
                          {formatCurrency(product.price - product.cost - (product.price * 0.145))}
                        </div>
                        <div className="text-xs text-gray-500">
                          (después de honorarios)
                        </div>
                      </div>
                    ) : (
                      <span className="font-medium text-success-600">
                        {formatCurrency(product.price - product.cost)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <ProductForm
        product={editingProduct}
        isOpen={showForm}
        onClose={handleCloseForm}
      />
    </div>
  );
};