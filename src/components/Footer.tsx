import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[#23f7de]/10 bg-neutral-950/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo ve açıklama */}
          <div className="space-y-3">
            <h3 className="text-[#23f7de] font-semibold">MultiversX AI</h3>
            <p className="text-neutral-400 text-sm">
              Explore the blockchain with AI-powered insights and real-time information.
            </p>
          </div>

          {/* Hızlı linkler */}
          <div>
            <h4 className="text-[#23f7de] font-medium mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="https://axis-one.vercel.app/" className="text-neutral-400 hover:text-[#23f7de] transition-colors text-sm">
                  Home
                </Link>
              </li>
              
              <li>
                <Link href="https://docs.multiversx.com" target="_blank" className="text-neutral-400 hover:text-[#23f7de] transition-colors text-sm">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="text-[#23f7de] font-medium mb-3">Open Source</h4>
            <ul className="space-y-2">
              <li>
                <Link href="https://github.com/alperenbekci/axisagent" target="_blank" className="text-neutral-400 hover:text-[#23f7de] transition-colors text-sm">
                  GitHub
                </Link>
              </li>
             
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#23f7de]/10">
          <p className="text-center text-neutral-400 text-sm">
            © {new Date().getFullYear()} MultiversX AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 