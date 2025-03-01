import Chat from '@/components/Chat';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24 bg-neutral-950">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-4 text-neutral-100">MultiversX AI Chat</h1>
        <p className="text-center mb-8 text-neutral-400">Analyze your blockchain data with artificial intelligence</p>
        <Chat />
      </div>
    </main>
  );
}
