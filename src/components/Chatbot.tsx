'use client';

import { useState } from 'react';
import { Bot, X, Sparkles, Send } from 'lucide-react';
import { Button } from './ui/Button';

export default function Chatbot({ blogContext = '' }: { blogContext?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Hi! Ask me anything about this article.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          text: `Context: ${blogContext}\n\nQuestion: ${userMessage}`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.result }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Network error occurred.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 p-4 bg-white/10 backdrop-blur-2xl border border-white/20 text-white rounded-full shadow-[0_0_30px_-5px_rgba(217,70,239,0.5)] hover:shadow-[0_0_40px_0_rgba(6,182,212,0.6)] transition-all duration-500 hover:scale-110 z-50 group animate-float ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <Bot size={28} className="text-white group-hover:text-ds-cyan transition-colors duration-500" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ds-cyan opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-ds-cyan"></span>
        </span>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-8 right-8 w-[360px] sm:w-[400px] glass-panel rounded-[32px] flex flex-col z-50 transition-all duration-500 origin-bottom-right overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 pointer-events-none translate-y-4'}`}
        style={{ height: '550px', maxHeight: '85vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-ds-purple/20 to-ds-cyan/20 border-b border-white/10 backdrop-blur-3xl">
          <div className="flex items-center gap-3 text-white font-extrabold tracking-wide">
            <div className="w-10 h-10 rounded-full bg-gradient-premium flex items-center justify-center shadow-lg">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <div className="text-base">Nexus AI</div>
              <div className="text-[10px] text-ds-cyan font-semibold uppercase tracking-widest">Assistant</div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/20 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#050816]/90 backdrop-blur-3xl scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-[24px] px-5 py-3.5 text-sm font-medium leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-ds-cyan text-[#050816] rounded-br-sm shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                    : 'bg-white/10 text-white rounded-bl-sm border border-white/5'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 text-white rounded-[24px] rounded-bl-sm px-5 py-4 border border-white/5 flex gap-2 items-center">
                <span className="w-2 h-2 bg-ds-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-ds-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-ds-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 bg-[#050816]/90 border-t border-white/10 backdrop-blur-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="w-full bg-[#0C1224] border border-white/10 rounded-full pl-5 pr-12 py-3.5 text-sm text-white focus:outline-none focus:border-ds-cyan focus:ring-1 focus:ring-ds-cyan transition-all shadow-inner placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 w-10 h-10 rounded-full bg-gradient-premium flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              <Send size={16} className="ml-1" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
