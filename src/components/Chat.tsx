'use client';

import { useState } from 'react';
import { IoSend } from "react-icons/io5";
import { FiCommand } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import { BsPersonCircle } from "react-icons/bs";

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
    <div className="flex flex-col h-[600px] bg-neutral-900/30 rounded-2xl border border-[#23f7de]/20 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#23f7de]/10 bg-neutral-900/30">
        <div className="flex items-center space-x-2">
          <RiRobot2Line className="w-5 h-5 text-[#23f7de]" />
          <div>
            <h2 className="text-[#23f7de] font-medium">MultiversX AI Assistant</h2>
            <p className="text-neutral-400 text-sm">Powered by advanced language models</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="bg-[#23f7de]/5 p-4 rounded-2xl border border-[#23f7de]/20 backdrop-blur-sm inline-block">
                <FiCommand className="w-8 h-8 text-[#23f7de]" />
              </div>
              <div>
                <p className="text-[#23f7de] font-medium mb-1">Welcome to MultiversX AI Chat</p>
                <p className="text-neutral-400 text-sm">Ask anything about MultiversX blockchain</p>
              </div>
            </div>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#23f7de]/10 border border-[#23f7de]/20">
                <RiRobot2Line className="w-5 h-5 text-[#23f7de]" />
              </div>
            )}
            <div
              className={`flex flex-col max-w-[80%] rounded-2xl p-4 ${
                message.role === 'user'
                  ? 'bg-[#23f7de]/10 text-white ml-auto'
                  : 'bg-neutral-900/50 text-white'
              } border border-[#23f7de]/20 shadow-lg`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              {message.timestamp && (
                <div className="text-xs mt-2 text-neutral-400">
                  {message.timestamp}
                </div>
              )}
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#23f7de]/10 border border-[#23f7de]/20">
                <BsPersonCircle className="w-5 h-5 text-[#23f7de]" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#23f7de]/10 border border-[#23f7de]/20">
              <RiRobot2Line className="w-5 h-5 text-[#23f7de]" />
            </div>
            <div className="bg-neutral-900/50 text-white rounded-2xl p-4 border border-[#23f7de]/20 shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#23f7de] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-[#23f7de] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-[#23f7de] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-[#23f7de]/10 p-4 bg-neutral-900/30">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 bg-neutral-900/50 text-white rounded-xl border border-[#23f7de]/20 focus:outline-none focus:ring-2 focus:ring-[#23f7de]/50 focus:border-transparent placeholder-neutral-400"
            />
            <div className="absolute right-3 top-3 px-1.5 py-0.5 rounded border border-[#23f7de]/20 bg-neutral-900/50 text-neutral-400 text-xs">
              ⌘ + ↵
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-3 bg-[#23f7de] text-neutral-900 font-medium rounded-xl hover:bg-[#23f7de]/90 focus:outline-none focus:ring-2 focus:ring-[#23f7de]/50 disabled:opacity-50 transition-all duration-200 flex items-center justify-center group"
          >
            <IoSend className={`w-5 h-5 ${isLoading ? 'opacity-50' : ''} group-hover:translate-x-0.5 transition-transform`} />
          </button>
        </form>
      </div>
    </div>
  );
} 