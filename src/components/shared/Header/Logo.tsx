import Link from "next/link";
import { Store } from "lucide-react";

type LogoProps = {
  onClick?: () => void;
};

export default function Logo({ onClick }: LogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex items-center gap-2 text-xl font-bold text-gray-800"
    >
      <Store className="text-gray-800" />
      <span>ShopNext</span>
    </Link>
  );
}
