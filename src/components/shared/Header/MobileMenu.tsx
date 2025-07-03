"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { X, Home, LayoutGrid, Info, Mail, LogOut } from "lucide-react";

import Logo from "./Logo";

type User = { name: string };
type MobileMenuProps = {
  user: User | null;
  onLogout: () => void;
  closeMenu: () => void;
};

const navLinks = [
  { href: "/", label: "Home", icon: <Home size={20} /> },
  { href: "/product", label: "Product", icon: <LayoutGrid size={20} /> },
  { href: "/about", label: "About", icon: <Info size={20} /> },
  { href: "/contact", label: "Contact", icon: <Mail size={20} /> },
];

export default function MobileMenu({
  user,
  onLogout,
  closeMenu,
}: MobileMenuProps) {
  return (
    <>
      {/* Lớp nền mờ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={closeMenu}
        className="fixed inset-0 bg-black/60 z-40"
      />

      {/* Panel Menu */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-full max-w-xs bg-white shadow-xl z-50 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header của Menu */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <Logo />
          <button
            onClick={closeMenu}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* --- PHẦN NỘI DUNG ĐƯỢC THÊM LẠI --- */}
        <nav className="flex-grow p-4 flex flex-col">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-4 px-4 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={closeMenu}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* --- PHẦN FOOTER ĐƯỢC THÊM LẠI --- */}
        <div className="p-4 border-t border-gray-200">
          {user ? (
            <div className="space-y-4">
              <Link
                href="/profile"
                className="flex items-center gap-3"
                onClick={closeMenu}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">Xem hồ sơ</p>
                </div>
              </Link>
              <button
                onClick={() => {
                  onLogout();
                  closeMenu();
                }}
                className="w-full flex items-center gap-4 px-4 py-3 text-base font-medium text-red-500 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut size={20} />
                <span>Đăng xuất</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-4 px-4 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={closeMenu}
            >
              <LogOut size={20} />
              <span>Đăng nhập / Đăng ký</span>
            </Link>
          )}
        </div>
      </motion.div>
    </>
  );
}
