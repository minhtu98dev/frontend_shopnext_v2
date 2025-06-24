import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/types/product';

// --- Định nghĩa các kiểu dữ liệu ---

// Một sản phẩm trong giỏ hàng
export interface CartItem extends Product {
  quantity: number;
}

// Địa chỉ giao hàng
export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  phoneNumber: string;
}

// Toàn bộ trạng thái của store
interface CartState {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  // Các hành động (actions)
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  saveShippingAddress: (address: ShippingAddress) => void;
  savePaymentMethod: (method: string) => void;
  clearCart: () => void;
}


// --- Tạo Store duy nhất ---

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // --- Các giá trị trạng thái ban đầu ---
      items: [],
      shippingAddress: { fullName: '', address: '', city: '', phoneNumber: '' },
      paymentMethod: 'cash',

      // --- Các hành động (actions) ---
      
      addToCart: (product, quantity) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item._id === product._id);

        if (existingItem) {
          set((state) => ({
            items: state.items.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...product, quantity }],
          }));
        }
      },

      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        }));
      },
      
      updateQuantity: (productId, quantity) => {
        set(state => ({
            items: state.items.map(item => 
                item._id === productId ? { ...item, quantity } : item
            ).filter(item => item.quantity > 0) // Tự động xóa nếu số lượng <= 0
        }));
      },

      saveShippingAddress: (address) => {
        set({ shippingAddress: address });
      },

      savePaymentMethod: (method) => {
        set({ paymentMethod: method });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'cart-storage', // Tên key trong localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);