import axios from 'axios';
import * as cheerio from 'cheerio';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

let vectorStore: MemoryVectorStore | null = null;

// Web sayfasını çek ve içeriği ayıkla
async function scrapeWebsite(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Gereksiz HTML elementlerini kaldır
    $('script').remove();
    $('style').remove();
    $('nav').remove();
    $('footer').remove();
    
    // Ana içeriği al
    const content = $('body').text();
    return content.replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.error('Error scraping website:', error);
    return '';
  }
}

// İçeriği küçük parçalara böl
async function splitContent(content: string): Promise<Document[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  
  return await splitter.createDocuments([content]);
}

// Vektör veritabanını güncelle
export async function updateVectorStore() {
  const urls = [
    'https://multiversx.com',
    'https://multiversx.com/about',
    'https://multiversx.com/technology',
    // Daha fazla URL eklenebilir
  ];
  
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  let documents: Document[] = [];
  
  for (const url of urls) {
    const content = await scrapeWebsite(url);
    const docs = await splitContent(content);
    documents = [...documents, ...docs.map(doc => ({
      ...doc,
      metadata: { ...doc.metadata, url }
    }))];
  }

  // Memory Vector Store'a kaydet
  vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);
}

// İlgili içeriği getir
export async function queryVectorStore(query: string, k: number = 3): Promise<string[]> {
  if (!vectorStore) {
    await updateVectorStore();
  }

  if (!vectorStore) {
    throw new Error('Vector store not initialized');
  }

  const results = await vectorStore.similaritySearch(query, k);
  return results.map(doc => doc.pageContent);
} 