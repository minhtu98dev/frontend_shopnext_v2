"use client";

import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface CartSummaryProps {
  subtotal: number;
}

export default function CartSummary({ subtotal }: CartSummaryProps) {
  const shippingFee = subtotal > 0 ? 30000 : 0; // Ví dụ: miễn phí ship nếu giỏ hàng trống
  const total = subtotal + shippingFee;

  return (
    <div className="border rounded-lg p-6 bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Tạm tính</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Phí vận chuyển</span>
          <span>{formatPrice(shippingFee)}</span>
        </div>
        <div className="border-t my-4"></div>
        <div className="flex justify-between font-bold text-lg">
          <span>Tổng cộng</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      <Link href="/checkout">
        <span className="block w-full mt-6 bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700">
          Tiến hành thanh toán
        </span>
      </Link>
    </div>
  );
}
