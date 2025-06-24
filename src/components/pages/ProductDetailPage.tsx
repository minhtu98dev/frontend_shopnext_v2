"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import ProductReviewForm from "../features/product/ProductReviewForm";

// Component nhỏ để hiển thị sao đánh giá
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
      {rating.toFixed(1)} {numReviews > 0 ? `(${numReviews} đánh giá)` : ""}
    </span>
  </div>
);

interface ProductDetailPageProps {
  product: Product;
}

export default function ProductDetailPage({ product }: ProductDetailPageProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const addToCart = useCartStore((state) => state.addToCart);

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);

  const allImages = [product.image, ...product.images];
  const isOutOfStock = product.countInStock === 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleReviewSubmitted = () => {
    // router.refresh() sẽ làm mới lại dữ liệu server cho trang hiện tại
    // mà không cần tải lại toàn bộ trang, giúp cập nhật danh sách review.
    router.refresh();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Cột bên trái: Hình ảnh sản phẩm */}
        <div>
          <div className="relative aspect-square w-full border rounded-lg overflow-hidden mb-4">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex gap-2">
            {allImages.map((img, index) => (
              <div
                key={index}
                className={`relative w-20 h-20 border rounded cursor-pointer ${
                  selectedImage === img
                    ? "border-blue-500 border-2"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedImage(img)}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  layout="fill"
                  className="object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Cột bên phải: Thông tin và hành động */}
        <div>
          <span className="text-sm text-gray-500 uppercase">
            {product.brand}
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold my-2">
            {product.name}
          </h1>
          <div className="my-3">
            <StarRating
              rating={product.rating}
              numReviews={product.numReviews}
            />
          </div>
          <p className="text-3xl font-bold text-red-600 my-4">
            {formatPrice(product.price)}
          </p>
          <div className="my-4 border-t pt-4">
            <h2 className="font-semibold text-lg mb-2">Mô tả sản phẩm</h2>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>
          <p className="my-4">
            Tình trạng:{" "}
            <span
              className={
                isOutOfStock
                  ? "text-red-500 font-bold ml-2"
                  : "text-green-600 font-bold ml-2"
              }
            >
              {isOutOfStock
                ? "Hết hàng"
                : `Còn lại ${product.countInStock} sản phẩm`}
            </span>
          </p>
          {!isOutOfStock && (
            <div className="flex items-center gap-4 my-6">
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.max(
                      1,
                      Math.min(
                        product.countInStock,
                        parseInt(e.target.value) || 1
                      )
                    )
                  )
                }
                className="w-20 border rounded text-center py-2"
                min="1"
                max={product.countInStock}
              />
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Phần Đánh giá của khách hàng */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Đánh giá của khách hàng</h2>
        {product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review._id} className="border-b pb-4">
                <p className="font-semibold">{review.name}</p>
                <div className="my-1">
                  <StarRating rating={review.rating} numReviews={0} />
                </div>
                <p className="text-gray-600">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>Chưa có đánh giá nào cho sản phẩm này.</p>
        )}
      </div>

      {/* --- PHẦN MỚI: FORM ĐÁNH GIÁ --- */}
      <div className="mt-10">
        {user ? (
          <ProductReviewForm
            productId={product._id}
            onReviewSubmitted={handleReviewSubmitted}
          />
        ) : (
          <div className="text-center p-6 border-2 border-dashed rounded-md bg-gray-50">
            <p className="text-gray-700">
              Bạn cần{" "}
              <Link
                href="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                đăng nhập
              </Link>{" "}
              để viết đánh giá.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
