/**
 * Chuyển đổi một số thành chuỗi tiền tệ định dạng VNĐ.
 * @param price - Số tiền cần định dạng.
 * @returns Chuỗi đã được định dạng (ví dụ: "1.500.000 ₫").
 */
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };
  
  // Trong tương lai, bạn có thể thêm các hàm khác vào đây
  // ví dụ: formatDate, truncateText, ...