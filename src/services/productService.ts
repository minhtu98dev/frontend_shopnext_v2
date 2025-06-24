import type { Product } from '@/types/product';
import { useAuthStore } from '@/store/authStore';

const getApiUrl = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiUrl) {
        throw new Error("Lỗi cấu hình: Vui lòng thiết lập NEXT_PUBLIC_API_BASE_URL trong file .env.local");
    }
    return apiUrl;
}

// ... (các hàm getProducts, getProductById giữ nguyên) ...
export async function getProducts(category?: string, keyword?: string): Promise<Product[]> {
    const apiUrl = `${getApiUrl()}/products`;
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (category) params.append('category', category);
    const queryString = params.toString();
    const finalUrl = queryString ? `${apiUrl}?${queryString}` : apiUrl;
    try {
        const res = await fetch(finalUrl, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Không thể lấy danh sách sản phẩm.`);
        const data = await res.json();
        return data.products || [];
    } catch (error) {
        console.error('API Error (getProducts):', error);
        throw new Error('Đã có lỗi xảy ra khi tải sản phẩm.');
    }
}

export async function getProductById(id: string): Promise<Product | null> {
    const apiUrl = `${getApiUrl()}/products/${id}`;
    try {
        const res = await fetch(apiUrl);
        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error(`Không thể lấy dữ liệu sản phẩm.`);
        }
        return await res.json();
    } catch (error) {
        console.error(`API Error (getProductById: ${id}):`, error);
        throw new Error(`Đã có lỗi xảy ra khi tải chi tiết sản phẩm.`);
    }
}


// --- HÀM MỚI ---

/**
 * Dữ liệu cần thiết để tạo một review mới.
 */
interface ReviewPayload {
  rating: number;
  comment: string;
}

/**
 * Gửi một review mới cho sản phẩm.
 * Yêu cầu người dùng phải đăng nhập.
 * @param productId - ID của sản phẩm cần review.
 * @param reviewData - Dữ liệu của review (rating, comment).
 * @returns Promise chứa message thành công từ server.
 */
export async function createProductReview(productId: string, reviewData: ReviewPayload): Promise<{ message: string }> {
  const apiUrl = `${getApiUrl()}/products/${productId}/reviews`;
  
  const { token } = useAuthStore.getState();

  if (!token) {
    throw new Error('Bạn cần đăng nhập để đánh giá sản phẩm.');
  }

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Không thể gửi đánh giá.');
    }

    return data;
  } catch (error) {
    console.error(`API Error (createProductReview cho ${productId}):`, error);
    throw error;
  }
}
