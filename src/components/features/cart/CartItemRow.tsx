"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore, type CartItem } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeFromCart } = useCartStore();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value) || 0;
    updateQuantity(item._id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item._id);
    toast.error(`Đã xóa ${item.name} khỏi giỏ hàng.`);
  };

  return (
    <div className="flex items-center gap-4 border-b py-4">
      {/* Ảnh và Tên sản phẩm */}
      <div className="flex items-center gap-4 flex-1">
        <Link href={`/product/${item._id}`}>
          <Image
            src={item.image}
            alt={item.name}
            width={80}
            height={80}
            className="rounded-md object-cover"
          />
        </Link>
        <div>
          <Link
            href={`/product/${item._id}`}
            className="font-semibold hover:text-blue-600"
          >
            {item.name}
          </Link>
          <p className="text-sm text-gray-500">{item.brand}</p>
        </div>
      </div>

      {/* Đơn giá */}
      <div className="w-28 text-center">{formatPrice(item.price)}</div>

      {/* Số lượng */}
      <div className="w-28 flex justify-center">
        <input
          type="number"
          min="1"
          max={item.countInStock}
          value={item.quantity}
          onChange={handleQuantityChange}
          className="w-16 text-center border rounded py-1"
        />
      </div>

      {/* Thành tiền */}
      <div className="w-28 text-center font-semibold">
        {formatPrice(item.price * item.quantity)}
      </div>

      {/* Nút xóa */}
      <div className="w-16 text-center">
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 font-bold"
        >
          X
        </button>
      </div>
    </div>
  );
}
