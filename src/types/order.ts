import type { ShippingAddress } from '@/store/cartStore';

// Kiểu dữ liệu cho một sản phẩm trong đơn hàng
export interface OrderItem {
  _id: string;
  name: string;
  quantity: number;
  image: string;
  price: number;
  product: string; // ID của sản phẩm gốc
}

// Kiểu dữ liệu cho thông tin khách (nếu là guest checkout)
export interface GuestDetails {
  email: string;
  fullName: string;
}

// Kiểu dữ liệu cho kết quả thanh toán
export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}

// Kiểu dữ liệu đầy đủ cho một đối tượng Đơn hàng
export interface Order {
  _id: string;
  user: string | null;
  guestDetails: GuestDetails | null;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: PaymentResult; // Có thể không có ban đầu
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  isDelivered: boolean;
  deliveredAt?: string | null;
  createdAt: string;
  updatedAt: string;
}