"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";

import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import SearchBar from "../../features/search/SearchBar";
import ProfileActions from "./ProfileActions";
import CartIcon from "./CartIcon";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const cartItems = useCartStore((state) => state.items);

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

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left Side */}
            <div className="flex items-center gap-8">
              <Logo />
              <DesktopNav />
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <SearchBar />
              </div>
              <div className="hidden md:flex items-center gap-2">
                {isClient && (
                  <ProfileActions user={user} onLogout={handleLogout} />
                )}
                <CartIcon itemCount={totalCartItems} />
              </div>

              {/* Mobile Actions */}
              <div className="md:hidden flex items-center">
                <CartIcon itemCount={totalCartItems} />
                <button className="p-2" onClick={() => setIsMenuOpen(true)}>
                  {/* Nút này chỉ mở, không cần hiển thị X */}
                  <Menu />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- PHẦN SỬA LỖI QUAN TRỌNG --- */}
      {/* Đặt AnimatePresence và MobileMenu ở đây, bên ngoài thẻ <header> */}
      <AnimatePresence>
        {isMenuOpen && (
          <MobileMenu
            user={user}
            onLogout={handleLogout}
            closeMenu={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
