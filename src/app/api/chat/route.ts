import { NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { DynamicTool } from '@langchain/core/tools';

// MultiversX API araçlarını oluştur
const getAccountDetails = new DynamicTool({
  name: 'get_account_details',
  description: 'Bir hesabın detaylarını almak için kullanılır. Hesap bakiyesi, token\'ları ve diğer bilgileri içerir. Örnek adres formatı: erd1... Kullanım: Hesap bakiyesi, token bilgileri veya genel hesap durumu sorgulandığında kullanılır.',
  async func(address: string) {
    const response = await fetch(`https://api.multiversx.com/accounts/${address}`);
    const data = await response.json();
    return JSON.stringify(data);
  },
});

const getTokenDetails = new DynamicTool({
  name: 'get_token_details',
  description: 'Bir token\'ın detaylarını almak için kullanılır. Token fiyatı, toplam arz, piyasa değeri gibi bilgileri içerir. Token identifier\'ı gereklidir (örn: WEGLD-bd4d79). Kullanım: Token fiyatı, arzı veya genel token bilgileri sorgulandığında kullanılır.',
  async func(identifier: string) {
    const response = await fetch(`https://api.multiversx.com/tokens/${identifier}`);
    const data = await response.json();
    return JSON.stringify(data);
  },
});

const getNftDetails = new DynamicTool({
  name: 'get_nft_details',
  description: 'Bir NFT\'nin detaylarını almak için kullanılır. NFT\'nin özellikleri, metadata\'sı ve diğer bilgileri içerir. NFT identifier\'ı gereklidir. Kullanım: NFT özellikleri, sahibi veya değeri sorgulandığında kullanılır.',
  async func(identifier: string) {
    const response = await fetch(`https://api.multiversx.com/nfts/${identifier}`);
    const data = await response.json();
    return JSON.stringify(data);
  },
});

const getNetworkStats = new DynamicTool({
  name: 'get_network_stats',
  description: 'MultiversX ağının güncel istatistiklerini almak için kullanılır. İşlem sayısı, aktif hesaplar, toplam stake miktarı gibi bilgileri içerir. Kullanım: Ağ durumu, istatistikleri veya performansı sorgulandığında kullanılır.',
  async func() {
    const response = await fetch('https://api.multiversx.com/stats');
    const data = await response.json();
    return JSON.stringify(data);
  },
});

const getEconomics = new DynamicTool({
  name: 'get_economics',
  description: 'MultiversX ağının ekonomik verilerini almak için kullanılır. Toplam arz, dolaşımdaki arz, stake edilmiş miktar gibi bilgileri içerir. Kullanım: Ekonomik veriler, toplam arz veya stake bilgileri sorgulandığında kullanılır.',
  async func() {
    const response = await fetch('https://api.multiversx.com/economics');
    const data = await response.json();
    return JSON.stringify(data);
  },
});

const getAccountTokens = new DynamicTool({
  name: 'get_account_tokens',
  description: 'Bir hesabın sahip olduğu tüm token\'ları listeler. Token bakiyeleri ve değerleri gibi bilgileri içerir. Adres parametresi gereklidir. Kullanım: Bir hesabın token varlıkları sorgulandığında kullanılır.',
  async func(address: string) {
    const response = await fetch(`https://api.multiversx.com/accounts/${address}/tokens`);
    const data = await response.json();
    return JSON.stringify(data);
  },
});

const getAccountNfts = new DynamicTool({
  name: 'get_account_nfts',
  description: 'Bir hesabın sahip olduğu tüm NFT\'leri listeler. NFT detayları ve koleksiyon bilgilerini içerir. Adres parametresi gereklidir. Kullanım: Bir hesabın NFT varlıkları sorgulandığında kullanılır.',
  async func(address: string) {
    const response = await fetch(`https://api.multiversx.com/accounts/${address}/nfts`);
    const data = await response.json();
    return JSON.stringify(data);
  },
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // OpenAI modelini başlat
    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4',
      temperature: 0,
    });

    // Agent'ı oluştur
    const executor = await initializeAgentExecutorWithOptions(
      [
        getAccountDetails,
        getTokenDetails,
        getNftDetails,
        getNetworkStats,
        getEconomics,
        getAccountTokens,
        getAccountNfts
      ],
      model,
      {
        agentType: 'openai-functions',
        verbose: true,
      }
    );

    // Agent'ı çalıştır ve yanıtı formatla
    const result = await executor.invoke({
      input: `Lütfen aşağıdaki soruyu yanıtla ve yanıtı Türkçe, anlaşılır ve doğal bir dille ver. Teknik detayları sadece gerekli olduğunda kullan: ${message}`,
    });

    return NextResponse.json({ response: result.output });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'İşlem sırasında bir hata oluştu.' },
      { status: 500 }
    );
  }
} 