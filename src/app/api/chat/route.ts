import { NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { DynamicTool } from '@langchain/core/tools';
import { queryVectorStore } from '@/utils/rag';

// MultiversX API araçlarını oluştur
const getAccountDetails = new DynamicTool({
  name: 'get_account_details',
  description: 'Use this tool to get account details. Requires an address parameter.',
  async func(address: string) {
    const response = await fetch(`https://api.multiversx.com/accounts/${address}`);
    const data = await response.json();
    return JSON.stringify(data);
  },
});

const getTokenDetails = new DynamicTool({
  name: 'get_token_details',
  description: 'Use this tool to get token details. Requires a token identifier.',
  async func(identifier: string) {
    const response = await fetch(`https://api.multiversx.com/tokens/${identifier}`);
    const data = await response.json();
    return JSON.stringify(data);
  },
});

const getNftDetails = new DynamicTool({
  name: 'get_nft_details',
  description: 'Use this tool to get NFT details. Requires an NFT identifier.',
  async func(identifier: string) {
    const response = await fetch(`https://api.multiversx.com/nfts/${identifier}`);
    const data = await response.json();
    return JSON.stringify(data);
  },
});

const getNetworkStats = new DynamicTool({
  name: 'get_network_stats',
  description: 'Use this tool to get MultiversX network statistics.',
  async func() {
    const response = await fetch('https://api.multiversx.com/stats');
    const data = await response.json();
    return JSON.stringify(data);
  },
});

const getWebsiteInfo = new DynamicTool({
  name: 'get_website_info',
  description: 'Use this tool to get information from MultiversX website about features, technology, or general information.',
  async func(query: string) {
    const results = await queryVectorStore(query);
    return JSON.stringify({ context: results });
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
        getWebsiteInfo
      ],
      model,
      {
        agentType: 'openai-functions',
        verbose: true,
      }
    );

    // Agent'ı çalıştır
    const result = await executor.invoke({
      input: `You are a helpful MultiversX blockchain assistant. Please answer the following question using the available tools. If the question is about MultiversX features, technology, or general information, use the get_website_info tool to get relevant context. Question: ${message}`,
    });

    return NextResponse.json({ response: result.output });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
} 