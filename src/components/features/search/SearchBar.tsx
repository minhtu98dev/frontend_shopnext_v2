"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Ngăn form tải lại trang
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) {
      // Nếu có từ khóa, chuyển hướng đến trang product với query
      router.push(`/product?keyword=${trimmedKeyword}`);
    } else {
      // Nếu không có, về trang product gốc
      router.push("/product");
    }
  };

  return (
    <form onSubmit={handleSearchSubmit}>
      <div className="flex">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          className="border border-gray-300 rounded-l-md px-3 py-1.5 w-48 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1.5 rounded-r-md hover:bg-blue-700 text-sm"
        >
          Tìm
        </button>
      </div>
    </form>
  );
}
