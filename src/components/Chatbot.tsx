'use client';

import { useState } from 'react';
import { Bot, X, Sparkles, Send } from 'lucide-react';

export default function Chatbot({ blogContext }: { blogContext: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: 'summarize' | 'chat', text: string = '') => {
    if (action === 'chat' && !text.trim()) return;

    if (action === 'chat') {
      setMessages((prev) => [...prev, { role: 'user', content: text }]);
      setInput('');
    } else if (action === 'summarize') {
      setMessages([{ role: 'user', content: 'Can you summarize this blog?' }]);
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, text, context: blogContext }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [...prev, { role: 'ai', content: data.result }]);
      } else {
        setMessages((prev) => [...prev, { role: 'ai', content: 'Error: ' + data.error }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', content: 'An unexpected error occurred.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-white rounded-full shadow-lg shadow-fuchsia-900/50 hover:shadow-cyan-900/50 transition-all hover:scale-110 z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <Bot size={28} />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ height: '500px', maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Sparkles size={20} className="text-fuchsia-400" />
            <span>AI Assistant</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
          {messages.length === 0 ? (
            <div className="text-center text-slate-400 mt-10">
              <Bot size={48} className="mx-auto mb-4 text-slate-600" />
              <p className="mb-4 text-sm">Hi! I can help you understand this blog post.</p>
              <button
                onClick={() => handleAction('summarize')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm transition-colors text-white flex items-center gap-2 mx-auto"
              >
                <Sparkles size={16} className="text-fuchsia-400" />
                Summarize Blog
              </button>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-fuchsia-600 text-white rounded-br-sm' : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700'}`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl rounded-bl-sm flex gap-1">
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-3 bg-slate-800 border-t border-slate-700">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAction('chat', input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-fuchsia-600 text-white rounded-full disabled:opacity-50 hover:bg-fuchsia-500 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
