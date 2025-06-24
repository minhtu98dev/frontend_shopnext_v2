"use client";

import React from "react";
import ProductCard from "@/components/features/product/ProductCard";
import type { Product } from "@/types/product"; // <-- 1. Đảm bảo đã import Product type

// <-- 2. ĐỊNH NGHĨA PROPS CHO COMPONENT
interface ProductPageProps {
  products: Product[];
}

// <-- 3. ÁP DỤNG PROPS VÀO HÀM COMPONENT
export default function ProductPage({ products }: ProductPageProps) {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Tất cả sản phẩm</h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">
          Không tìm thấy sản phẩm nào.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
