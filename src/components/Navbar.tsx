import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/50 backdrop-blur-lg border-b border-[#23f7de]/10">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center h-20">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/logo.png"
              alt="MultiversX AI Logo"
              width={120}
              height={120}
              className="rounded-xl"
              priority
            />
          </Link>
        </div>
      </div>
    </nav>
  );
} 