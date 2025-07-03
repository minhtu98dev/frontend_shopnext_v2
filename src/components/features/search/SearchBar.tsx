"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function SearchBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

  const inputRef = useRef(null);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) {
      router.push(`/product?keyword=${trimmedKeyword}`);
    } else {
      router.push("/product");
    }
    setIsOpen(false);
    setKeyword("");
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <div className="relative flex items-center h-10">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-1/2 -translate-y-1/2 right-full mr-2"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center h-10"
            >
              <input
                ref={inputRef}
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-40  sm:w-56 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-gray-500"
              />

              {/* --- THAY ĐỔI: Thêm hiệu ứng trễ cho nút 'X' --- */}
              <motion.button
                // Thêm hiệu ứng xuất hiện
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                // Thêm độ trễ 0.2 giây
                transition={{ delay: 0.2, duration: 0.2 }}
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-2 text-gray-400 hover:text-gray-700"
                title="Đóng"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 text-gray-600 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors z-10 ${
          isOpen ? "bg-gray-200" : ""
        }`}
        title="Tìm kiếm"
      >
        <Search className="h-5 w-5" />
      </button>
    </div>
  );
}
