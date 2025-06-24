"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import SearchBar from "../features/search/SearchBar";

export default function Header() {
  const router = useRouter();

  // --- PHẦN SỬA ĐỔI ---
  // Lấy state và action từ store một cách tường minh hơn.
  // Cách này tạo ra các subscription riêng biệt đến từng phần của state,
  // giúp component re-render một cách đáng tin cậy hơn khi state đó thay đổi.
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const cartItems = useCartStore((state) => state.items);
  // --------------------

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalCartItems = isClient
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất thành công.");
    router.push("/");
  };

  // Thêm một dòng console.log để bạn có thể debug
  // Mở F12 -> Console để xem giá trị của user sau khi đăng nhập và về trang chủ
  if (isClient) {
    console.log("Current user state in Header:", user);
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="py-3 flex justify-between items-center">
          {/* Phần Logo */}
          <div className="text-2xl font-bold text-blue-600">
            <Link href="/">ShopNext</Link>
          </div>

          {/* Phần Điều hướng chính (giữa) */}
          <div className="hidden md:flex gap-8">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link
              href="/product"
              className="hover:text-blue-600 transition-colors"
            >
              Product
            </Link>
            <Link
              href="/about"
              className="hover:text-blue-600 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Phần Hành động & Trạng thái người dùng (bên phải) */}
          <div className="flex items-center gap-4">
              <SearchBar />
            {/* Logic render có điều kiện không thay đổi */}
            {isClient && user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile">
                  <span className="font-semibold cursor-pointer hover:text-blue-600">
                    Chào, {user.name}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-red-600"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link href="/login" className="font-semibold hover:text-blue-600">
                Đăng nhập
              </Link>
            )}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {totalCartItems}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
