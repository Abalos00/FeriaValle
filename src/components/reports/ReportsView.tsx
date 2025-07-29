import React, { useState, useMemo } from 'react';
import { Download, TrendingUp, DollarSign, Package } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { formatCurrency, formatDate, exportToPDF, exportToCSV } from '../../utils';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

export const ReportsView: React.FC = () => {
  const { sales } = useStore();
  const [dateFilter, setDateFilter] = useState('thisMonth');
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  const filteredSales = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (dateFilter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case 'thisWeek': {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        startDate = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
        endDate = new Date();
        break;
      }
      case 'thisMonth':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'lastMonth': {
        const lastMonth = subMonths(now, 1);
        startDate = startOfMonth(lastMonth);
        endDate = endOfMonth(lastMonth);
        break;
      }
      case 'custom': {
        const [year, month] = selectedMonth.split('-');
        const customDate = new Date(parseInt(year), parseInt(month) - 1);
        startDate = startOfMonth(customDate);
        endDate = endOfMonth(customDate);
        break;
      }
      default:
        startDate = new Date(0);
        endDate = new Date();
    }

    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= startDate && saleDate <= endDate;
    });
  }, [sales, dateFilter, selectedMonth]);

  const stats = useMemo(() => {
    const totalSales = filteredSales.length;
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const totalProfit = filteredSales.reduce((sum, sale) => sum + sale.profit, 0);
    const totalUnits = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);
    const avgSale = totalSales > 0 ? totalRevenue / totalSales : 0;

    // Product sales analysis
    const productSales = filteredSales.reduce((acc, sale) => {
      if (!acc[sale.productId]) {
        acc[sale.productId] = {
          name: sale.productName,
          quantity: 0,
          revenue: 0,
          profit: 0,
        };
      }
      acc[sale.productId].quantity += sale.quantity;
      acc[sale.productId].revenue += sale.totalPrice;
      acc[sale.productId].profit += sale.profit;
      return acc;
    }, {} as Record<string, { name: string; quantity: number; revenue: number; profit: number }>);

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalSales,
      totalRevenue,
      totalProfit,
      totalUnits,
      avgSale,
      topProducts,
    };
  }, [filteredSales]);

  const handleExportPDF = () => {
    exportToPDF('reports-content', `reporte-ventas-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const handleExportCSV = () => {
    exportToCSV(filteredSales, `ventas-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  };

  const filterOptions = [
    { value: 'today', label: 'Hoy' },
    { value: 'thisWeek', label: 'Esta Semana' },
    { value: 'thisMonth', label: 'Este Mes' },
    { value: 'lastMonth', label: 'Mes Pasado' },
    { value: 'custom', label: 'Personalizado' },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">Reportes de Ventas</h3>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Select
              options={filterOptions}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="min-w-40"
            />
            
            {dateFilter === 'custom' && (
              <Input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            )}
            
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={handleExportPDF}
              >
                PDF
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={handleExportCSV}
              >
                CSV
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Report Content */}
      <div id="reports-content" className="space-y-6">
        {/* Key Metrics */}
        <Card>
          <h4 className="text-md font-semibold text-gray-900 mb-4">Métricas Principales</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-primary-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSales}</p>
              <p className="text-sm text-gray-600">Ventas</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-lg mx-auto mb-2">
                <DollarSign className="h-6 w-6 text-success-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-sm text-gray-600">Ingresos</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-warning-100 rounded-lg mx-auto mb-2">
                <DollarSign className="h-6 w-6 text-warning-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalProfit)}</p>
              <p className="text-sm text-gray-600">Ganancia</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUnits}</p>
              <p className="text-sm text-gray-600">Unidades</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Venta Promedio</p>
              <p className="text-xl font-semibold text-gray-900">{formatCurrency(stats.avgSale)}</p>
            </div>
          </div>
        </Card>

        {/* Top Products */}
        <Card>
          <h4 className="text-md font-semibold text-gray-900 mb-4">Productos Más Vendidos</h4>
          {stats.topProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay datos para mostrar</p>
          ) : (
            <div className="space-y-3">
              {stats.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full text-sm font-semibold text-primary-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.quantity} unidades vendidas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                    <p className="text-sm text-success-600">{formatCurrency(product.profit)} ganancia</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Sales */}
        <Card>
          <h4 className="text-md font-semibold text-gray-900 mb-4">Ventas Recientes</h4>
          {filteredSales.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay ventas en el período seleccionado</p>
          ) : (
            <div className="space-y-2">
              {filteredSales.slice(0, 10).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{sale.productName}</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(new Date(sale.date))} • {sale.quantity} unidades • {sale.paymentMethod}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(sale.totalPrice)}</p>
                    <p className="text-sm text-success-600">+{formatCurrency(sale.profit)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};