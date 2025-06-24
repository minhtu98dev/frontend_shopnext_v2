// src/app/order-success/page.tsx
import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto text-center py-20">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Đặt hàng thành công!
      </h1>
      <p className="mb-6">
        Cảm ơn bạn đã mua sắm. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có
        thể.
      </p>
      <Link href="/product">
        <span className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
          Tiếp tục mua sắm
        </span>
      </Link>
    </div>
  );
}
