import Link from "next/link";
import { ShoppingCart } from "lucide-react";

type CartIconProps = {
  itemCount: number;
};

export default function CartIcon({ itemCount }: CartIconProps) {
  return (
    <Link
      href="/cart"
      className="relative p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
      title="Giỏ hàng"
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
