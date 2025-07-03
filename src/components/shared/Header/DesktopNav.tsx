import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/product", label: "Product" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function DesktopNav() {
  return (
    <nav className="hidden md:flex items-center gap-6 text-gray-600 font-medium">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="hover:text-gray-800 hover:scale-105 transition-all duration-300"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
