import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-mist-50 shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Flour & Flâneuse"
              width={180}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          <div className="flex items-center space-x-6 md:space-x-8">
            <Link
              href="/"
              className="text-mist-700 hover:text-terracotta-warm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/category/travel"
              className="text-mist-700 hover:text-terracotta-warm font-medium transition-colors"
            >
              Travel
            </Link>
            <Link
              href="/category/baking"
              className="text-mist-700 hover:text-terracotta-warm font-medium transition-colors"
            >
              Baking
            </Link>
            <Link
              href="/about"
              className="text-mist-700 hover:text-terracotta-warm font-medium transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
