import React from 'react';
import { Trash2, Clock, DollarSign } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { formatCurrency, formatDateTime, isToday } from '../../utils';

export const SalesList: React.FC = () => {
  const { sales, deleteSale } = useStore();

  const todaySales = sales.filter(sale => isToday(new Date(sale.date)));
  const totalToday = todaySales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const profitToday = todaySales.reduce((sum, sale) => sum + sale.profit, 0);

  const handleDeleteSale = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta venta?')) {
      deleteSale(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Today's Summary */}
      <Card className="bg-white">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Día</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center rounded-2xl bg-primary-50/80 p-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl mx-auto mb-2 shadow-inner">
              <Clock className="h-6 w-6 text-primary-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{todaySales.length}</p>
            <p className="text-sm text-gray-600">Ventas</p>
          </div>
          <div className="text-center rounded-2xl bg-success-50/80 p-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl mx-auto mb-2 shadow-inner">
              <DollarSign className="h-6 w-6 text-success-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalToday)}</p>
            <p className="text-sm text-gray-600">Ingresos</p>
          </div>
          <div className="text-center rounded-2xl bg-warning-50/80 p-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl mx-auto mb-2 shadow-inner">
              <DollarSign className="h-6 w-6 text-warning-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(profitToday)}</p>
            <p className="text-sm text-gray-600">Ganancia</p>
          </div>
        </div>
      </Card>

      {/* Sales List */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas de Hoy</h3>
        
        {todaySales.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p className="font-medium">No hay ventas registradas hoy</p>
            <p className="text-sm">Registra tu primera venta arriba</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todaySales.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/80 border border-white shadow-sm"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900">{sale.productName}</h4>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(sale.totalPrice)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
                    <span>Cantidad: {sale.quantity}</span>
                    <span>Método: {sale.paymentMethod}</span>
                    <span className="text-success-600">Ganancia: {formatCurrency(sale.profit)}</span>
                    <span>{formatDateTime(new Date(sale.date))}</span>
                  </div>
                  {sale.notes && (
                    <p className="text-sm text-gray-500 mt-1 italic">{sale.notes}</p>
                  )}
                </div>
                
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={() => handleDeleteSale(sale.id)}
                  className="ml-3 !p-2"
                />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
