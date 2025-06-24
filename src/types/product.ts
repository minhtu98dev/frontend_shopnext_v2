/**
 * Định nghĩa cấu trúc cho một đối tượng đánh giá (review)
 * Tương ứng với mảng 'reviews' trong model Product.
 */
export interface Review {
    _id: string;
    name: string;
    rating: number;
    comment: string;
    user: string; // ID của người dùng đã viết review
    createdAt: string; // Có thể dùng kiểu Date nếu cần xử lý thời gian phức tạp
  }
  
  /**
   * Định nghĩa cấu trúc đầy đủ cho một đối tượng sản phẩm (product)
   * Phản ánh chính xác model Product từ API backend.
   */
  export interface Product {
    _id: string; // ID độc nhất do MongoDB tạo ra
    name: string;
    image: string; // URL của ảnh đại diện chính
    images: string[]; // Mảng chứa các URL của các ảnh phụ
    brand: string;
    category: string;
    description: string;
    price: number;
    countInStock: number;
    rating: number; // Điểm đánh giá trung bình
    numReviews: number; // Tổng số lượng đánh giá
    reviews: Review[]; // Mảng chứa tất cả các đối tượng đánh giá chi tiết
    createdAt?: string; // Thời gian sản phẩm được tạo (tùy chọn)
    updatedAt?: string; // Thời gian sản phẩm được cập nhật (tùy chọn)
  }