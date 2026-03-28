import Link from "next/link";
import Logo from "./Logo";

const Header: React.FC = () => (
  <header className="border-b border-gray-200 bg-white">
    <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <Link href="/">
        <Logo width={140} />
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
          Products
        </Link>
        <Link href="/articles" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
          Articles
        </Link>
      </div>
    </nav>
  </header>
);

export default Header;
