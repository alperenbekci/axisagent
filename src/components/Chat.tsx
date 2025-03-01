'use client';

import { useState } from 'react';
import { IoSend } from "react-icons/io5";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-neutral-900 rounded-xl shadow-2xl border border-neutral-800">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800">
        <h2 className="text-neutral-200 font-medium">MultiversX AI Assistant</h2>
        <p className="text-neutral-400 text-sm">Ask about your blockchain data</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-neutral-500 text-center">
              <p className="mb-2">👋 Welcome!</p>
              <p className="text-sm">Feel free to ask anything about MultiversX</p>
            </div>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex flex-col max-w-[80%] rounded-xl p-3 ${
                message.role === 'user'
                  ? 'bg-neutral-700 text-neutral-100'
                  : 'bg-neutral-800 text-neutral-100'
              } shadow-lg`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              {message.timestamp && (
                <div className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-neutral-400' : 'text-neutral-400'
                }`}>
                  {message.timestamp}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-neutral-800 text-neutral-100 rounded-xl p-3 shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-neutral-800 p-4 bg-neutral-900">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-neutral-800 text-neutral-100 rounded-xl border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent placeholder-neutral-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-neutral-700 text-neutral-100 rounded-xl hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-600 disabled:opacity-50 transition-all duration-200 flex items-center justify-center"
          >
            <IoSend className={`w-5 h-5 ${isLoading ? 'opacity-50' : ''}`} />
          </button>
        </form>
      </div>
    </div>
  );
} 