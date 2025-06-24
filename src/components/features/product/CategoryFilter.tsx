"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface CategoryFilterProps {
  categories: string[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  // Dùng hook để lấy query params từ URL hiện tại
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const getLinkClassName = (category: string | null) => {
    const isActive =
      currentCategory === category || (category === null && !currentCategory);
    return isActive
      ? "bg-blue-600 text-white"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300";
  };

  return (
    <div className="mb-8 flex flex-wrap justify-center gap-2">
      <Link href="/product">
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${getLinkClassName(
            null
          )}`}
        >
          Tất cả
        </span>
      </Link>
      {categories.map((category) => (
        <Link href={`/product?category=${category}`} key={category}>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${getLinkClassName(
              category
            )}`}
          >
            {category}
          </span>
        </Link>
      ))}
    </div>
  );
}
