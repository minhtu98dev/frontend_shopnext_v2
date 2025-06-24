"use client"; // <-- BẮT BUỘC: Chuyển thành Client Component

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore"; // <-- Import cart store

// ... (Component StarRating không thay đổi) ...
const StarRating = ({
  rating,
  numReviews,
}: {
  rating: number;
  numReviews: number;
}) => (
  <div className="flex items-center">
    <span className="text-yellow-500">⭐</span>
    <span className="ml-1 text-sm text-gray-600">
      {rating.toFixed(1)} ({numReviews} đánh giá)
    </span>
  </div>
);

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.countInStock === 0;

  // Lấy hành động addToCart từ store
  const addToCart = useCartStore((state) => state.addToCart);

  // Hàm xử lý khi click nút
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Ngăn thẻ Link cha bị kích hoạt, tránh chuyển trang
    e.preventDefault();

    // Gọi hành động từ store, thêm 1 sản phẩm
    addToCart(product, 1);
  };

  return (
    <Link href={`/product/${product._id}`} className="block h-full group">
      <div className="border rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col h-full relative">
        {/* ... (Các phần khác không thay đổi) ... */}
        <div className="relative w-full aspect-square rounded-t-lg overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col flex-grow mt-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            {product.brand}
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mt-1">
            {product.name}
          </h3>
          <div className="my-2">
            <StarRating
              rating={product.rating}
              numReviews={product.numReviews}
            />
          </div>
          <div className="flex-grow mt-2">
            <span className="text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full text-blue-600 bg-blue-200">
              {product.category}
            </span>
          </div>
          <p className="text-xl font-bold text-red-600 mt-auto pt-4">
            {formatPrice(product.price)}
          </p>
        </div>

        {/* THAY ĐỔI NÚT BẤM */}
        <button
          disabled={isOutOfStock}
          onClick={handleAddToCart} // <-- Gắn hàm xử lý sự kiện
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isOutOfStock ? "Đã hết hàng" : "Thêm vào giỏ"}
        </button>
      </div>
    </Link>
  );
}
