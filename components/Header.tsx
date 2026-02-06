import Link from 'next/link';
import { getSiteSettings } from '@/lib/posts';

export default function Header() {
  const settings = getSiteSettings();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl md:text-3xl font-serif text-terracotta-600 hover:text-terracotta-700 transition-colors">
              {settings.title}
            </h1>
          </Link>

          <div className="flex items-center space-x-6 md:space-x-8">
            <Link
              href="/"
              className="text-sand-700 hover:text-terracotta-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/category/travel"
              className="text-sand-700 hover:text-terracotta-600 font-medium transition-colors"
            >
              Travel
            </Link>
            <Link
              href="/category/baking"
              className="text-sand-700 hover:text-terracotta-600 font-medium transition-colors"
            >
              Baking
            </Link>
            <Link
              href="/about"
              className="text-sand-700 hover:text-terracotta-600 font-medium transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
