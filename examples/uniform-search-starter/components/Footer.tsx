import Link from "next/link";
import Logo from "./Logo";

const SimpleFooter: React.FC = () => (
  <footer className="border-t border-gray-200 bg-white">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <Link href="/">
        <Logo width={100} />
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/products" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          Products
        </Link>
        <Link href="/articles" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          Articles
        </Link>
      </div>
    </div>
    <div className="mx-auto max-w-6xl border-t border-gray-100 px-6 py-4">
      <p className="text-xs text-gray-400">Powered by Uniform Search. Copyright 2026</p>
    </div>
  </footer>
);

export default SimpleFooter;
