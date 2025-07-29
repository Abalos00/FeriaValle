export interface Product {
  id: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  category?: string;
  useHonorarios?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  profit: number;
  date: Date;
  paymentMethod: 'efectivo' | 'transferencia' | 'tarjeta';
  notes?: string;
}

export interface DailySummary {
  date: string;
  totalSales: number;
  totalProfit: number;
  totalUnits: number;
  salesCount: number;
}

export interface AppState {
  products: Product[];
  sales: Sale[];
  currentView: 'ventas' | 'inventario' | 'reportes' | 'ayuda';
  isOffline: boolean;
  showWelcome: boolean;
}