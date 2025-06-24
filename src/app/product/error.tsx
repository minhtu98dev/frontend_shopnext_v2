"use client"; // <-- THÊM DÒNG NÀY VÀO ĐẦU FILE

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log lỗi ra console của server để debug
    console.error(error);
  }, [error]);

  return (
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold mb-4">Đã có lỗi xảy ra!</h2>
      <p className="text-red-500 mb-6">
        Không thể tải được danh sách sản phẩm. Vui lòng thử lại.
      </p>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        onClick={
          // Cố gắng render lại trang bằng cách gọi lại hàm reset
          () => reset()
        }
      >
        Thử lại
      </button>
    </div>
  );
}
