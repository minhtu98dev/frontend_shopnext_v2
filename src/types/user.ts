/**
 * Định nghĩa cấu trúc cho một đối tượng Người dùng (User)
 * Phản ánh model User từ API backend, không bao gồm các trường nhạy cảm như password.
 */
export interface User {
    _id: string;        // ID độc nhất do MongoDB tạo ra
    name: string;       // Tên của người dùng
    email: string;      // Địa chỉ email (duy nhất)
    isAdmin: boolean;   // Cho biết người dùng có phải là Admin hay không
    createdAt?: string;  // Thời gian tài khoản được tạo (có thể là Date)
    updatedAt?: string;  // Thời gian cập nhật lần cuối (có thể là Date)
  }