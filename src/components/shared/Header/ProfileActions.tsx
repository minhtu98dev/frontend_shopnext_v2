import { useState, useRef } from "react";
import Link from "next/link";
import { User, LogIn } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "@/hooks/useClickOutside"; // Chỉnh lại đường dẫn nếu cần

type User = {
  name: string;
  email: string;
};

type ProfileActionsProps = {
  user: User | null;
  onLogout: () => void;
};

export default function ProfileActions({
  user,
  onLogout,
}: ProfileActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  useClickOutside(profileRef, () => setIsOpen(false));

  if (!user) {
    return (
      <Link
        href="/login"
        className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
        title="Đăng nhập"
      >
        <LogIn className="h-5 w-5" />
      </Link>
    );
  }

  return (
    <div ref={profileRef} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
        title={`Chào, ${user.name}`}
      >
        <User className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50"
          >
            <div className="p-2">
              <div className="px-3 py-2 border-b">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <nav className="mt-1">
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                >
                  Xem thông tin
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-red-500 rounded-md hover:bg-red-50"
                >
                  Đăng xuất
                </button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
