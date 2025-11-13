import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Sale, AppState } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface StoreActions {
  // Products
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Sales
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
  deleteSale: (id: string) => void;
  
  // Navigation
  setCurrentView: (view: AppState['currentView']) => void;
  
  // Welcome
  setShowWelcome: (show: boolean) => void;
  
  // Offline status
  setOfflineStatus: (isOffline: boolean) => void;

  // Data management
  importData: (data: { products: Product[]; sales: Sale[] }) => void;
  
  // Utils
  getProductById: (id: string) => Product | undefined;
  getDailySales: (date: Date) => Sale[];
  getMonthlySales: (month: number, year: number) => Sale[];
}

// UUID fallback for environments without crypto
const generateId = () => {
  try {
    return uuidv4();
  } catch {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
};

export const useStore = create<AppState & StoreActions>()(
  persist(
    (set, get) => ({
      // Initial state
      products: [],
      sales: [],
      currentView: 'ventas',
      isOffline: false,
      showWelcome: true,

      // Products actions
      addProduct: (productData) => set((state) => ({
        products: [...state.products, {
          ...productData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }]
      })),

      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map(product =>
          product.id === id 
            ? { ...product, ...updates, updatedAt: new Date() }
            : product
        )
      })),

      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(product => product.id !== id)
      })),

      // Sales actions
      addSale: (saleData) => set((state) => {
        const product = state.products.find(p => p.id === saleData.productId);
        if (!product) return state;

        const newSale: Sale = {
          ...saleData,
          id: generateId(),
          date: new Date(),
        };

        // Update product stock
        const updatedProducts = state.products.map(p =>
          p.id === saleData.productId
            ? { ...p, stock: Math.max(0, p.stock - saleData.quantity) }
            : p
        );

        return {
          sales: [...state.sales, newSale],
          products: updatedProducts,
        };
      }),

      deleteSale: (id) => set((state) => ({
        sales: state.sales.filter(sale => sale.id !== id)
      })),

      // Navigation
      setCurrentView: (view) => set({ currentView: view }),

      // Welcome
      setShowWelcome: (show) => set({ showWelcome: show }),

      // Offline status
      setOfflineStatus: (isOffline) => set({ isOffline }),

      // Data management
      importData: (data) => set(() => ({
        products: data.products.map(product => ({
          ...product,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt),
        })),
        sales: data.sales.map(sale => ({
          ...sale,
          date: new Date(sale.date),
        })),
      })),

      // Utils
      getProductById: (id) => {
        const state = get();
        return state.products.find(product => product.id === id);
      },

      getDailySales: (date) => {
        const state = get();
        const targetDate = date.toDateString();
        return state.sales.filter(sale => 
          new Date(sale.date).toDateString() === targetDate
        );
      },

      getMonthlySales: (month, year) => {
        const state = get();
        return state.sales.filter(sale => {
          const saleDate = new Date(sale.date);
          return saleDate.getMonth() === month && saleDate.getFullYear() === year;
        });
      },
    }),
    {
      name: 'feriavalle-storage',
      version: 1,
    }
  )
);
