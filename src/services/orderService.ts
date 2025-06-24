import type { ShippingAddress } from "@/store/cartStore";
import type { Order } from '@/types/order';
import { useAuthStore } from '@/store/authStore';

/**
 * Lấy và xác thực URL API cơ sở từ biến môi trường.
 * @returns URL API cơ sở.
 * @throws Error nếu biến môi trường chưa được thiết lập.
 */
const getApiUrl = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiUrl) {
        throw new Error("Lỗi cấu hình: Vui lòng thiết lập NEXT_PUBLIC_API_BASE_URL trong file .env.local");
    }
    return apiUrl;
}

/**
 * Interface mô tả một item trong đơn hàng khi gửi lên API để tạo mới.
 */
interface OrderItemPayload {
    name: string;
    quantity: number;
    image: string;
    price: number;
    product: string; // ID của sản phẩm gốc
}
  
/**
 * Interface mô tả toàn bộ dữ liệu cần thiết để tạo một đơn hàng mới.
 */
interface OrderPayload {
    items: OrderItemPayload[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalAmount: number;
    user?: string;          // ID của user nếu đã đăng nhập
    guestDetails?: {        // Thông tin khách nếu chưa đăng nhập
        email: string;
        fullName: string;
    };
}
  
/**
 * Gửi yêu cầu tạo một đơn hàng mới lên server.
 * @param orderData - Dữ liệu của đơn hàng cần tạo.
 * @returns Một Promise chứa đối tượng Order đầy đủ sau khi được tạo thành công.
 */
export async function createOrder(orderData: OrderPayload): Promise<Order> {
    const apiUrl = `${getApiUrl()}/orders`;
    const { token } = useAuthStore.getState();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    // Nếu có token (người dùng đã đăng nhập), thêm vào header Authorization
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(orderData),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Lỗi không xác định từ server.' }));
            throw new Error(errorData.message || 'Không thể tạo đơn hàng.');
        }

        return await res.json();
    } catch (error) {
        console.error('API Error (createOrder):', error);
        throw error;
    }
}

/**
 * Lấy thông tin chi tiết của một đơn hàng bằng ID.
 * Yêu cầu người dùng phải đăng nhập.
 * @param id - ID của đơn hàng cần lấy.
 * @returns Một Promise chứa đối tượng Order hoặc null nếu không tìm thấy.
 */
export async function getOrderById(id: string): Promise<Order | null> {
    const apiUrl = `${getApiUrl()}/orders/${id}`; // <-- Sử dụng getApiUrl() cho nhất quán
    const { token } = useAuthStore.getState();

    if (!token) {
        throw new Error("Bạn cần đăng nhập để xem chi tiết đơn hàng.");
    }

    try {
        const res = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`, // <-- SỬA LỖI QUAN TRỌNG: Thêm token xác thực
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            if (res.status === 401 || res.status === 403) throw new Error('Bạn không có quyền xem đơn hàng này.');
            throw new Error('Không thể lấy thông tin đơn hàng.');
        }
        
        return await res.json();
    } catch (error) {
        console.error(`API Error (getOrderById: ${id}):`, error);
        throw error;
    }
}

/**
 * Lấy danh sách các đơn hàng của người dùng đang đăng nhập.
 * @returns Promise chứa một mảng các đơn hàng.
 */
export async function getMyOrders(): Promise<Order[]> {
    const apiUrl = `${getApiUrl()}/orders/myorders`;
    const { token } = useAuthStore.getState();

    if (!token) {
        throw new Error('Bạn cần đăng nhập để xem đơn hàng.');
    }

    try {
        const res = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error('Không thể lấy lịch sử đơn hàng.');
        }
        return await res.json();
    } catch (error) {
        console.error('API Error (getMyOrders):', error);
        throw error;
    }
}