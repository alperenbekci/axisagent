import Chat from '@/components/Chat';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-950 relative overflow-hidden pt-16">
        {/* Gelişmiş gradient ve blur efektleri */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#23f7de]/5 via-transparent to-transparent opacity-80" />
        
        {/* Dinamik blur efektleri */}
        <div 
          className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#23f7de]/5 rounded-full blur-[160px] animate-pulse" 
          style={{ animationDuration: '8s' }} 
        />
        <div 
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#23f7de]/3 rounded-full blur-[130px] animate-pulse"
          style={{ animationDuration: '10s' }} 
        />
        
        <div className="relative">
          <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-400 mb-4">
                Chat with MultiversX AI
              </h1>
              <p className="text-neutral-400 max-w-2xl mx-auto">
                Get instant answers about MultiversX blockchain, smart contracts, and ecosystem.
              </p>
            </div>

            {/* Chat component */}
            <div className="max-w-4xl mx-auto">
              <Chat />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
