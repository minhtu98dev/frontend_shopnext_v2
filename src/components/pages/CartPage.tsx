"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import CartItemRow from "../features/cart/CartItemRow";
import CartSummary from "../features/cart/CartSummary";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items } = useCartStore();

  // Xử lý hydration để đảm bảo dữ liệu client khớp với server
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (!isClient) {
    return <p className="text-center p-8">Đang tải giỏ hàng...</p>; // Hoặc một skeleton loader
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl mb-4">Giỏ hàng của bạn đang trống.</p>
          <Link href="/product">
            <span className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
              Tiếp tục mua sắm
            </span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột danh sách sản phẩm */}
          <div className="lg:col-span-2">
            {/* Header của bảng */}
            <div className="hidden md:flex items-center gap-4 border-b pb-2 font-semibold text-gray-600">
              <div className="flex-1">Sản phẩm</div>
              <div className="w-28 text-center">Đơn giá</div>
              <div className="w-28 text-center">Số lượng</div>
              <div className="w-28 text-center">Thành tiền</div>
              <div className="w-16 text-center">Xóa</div>
            </div>
            {items.map((item) => (
              <CartItemRow key={item._id} item={item} />
            ))}
          </div>

          {/* Cột tóm tắt đơn hàng */}
          <div className="lg:col-span-1">
            <CartSummary subtotal={subtotal} />
          </div>
        </div>
      )}
    </div>
  );
}
