'use client';

import { useState } from 'react';

export default function Chatbot({ blogContext = '' }: { blogContext?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'ASK ME ABOUT THIS ARTICLE.' },
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
          text: userMessage,
          context: blogContext,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.result }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'ERROR. TRY AGAIN.' }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'NETWORK ERROR.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-[#FDFBF7] text-black font-bold tracking-widest text-xs border border-black hover:bg-[#dddddd] transition-colors z-50 flex items-center justify-center ${isOpen ? 'hidden' : 'flex'}`}
      >
        ASK
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[360px] h-[500px] bg-black border border-[#333333] z-50 flex flex-col shadow-2xl">
          <div className="flex justify-between items-center p-4 border-b border-[#333333]">
            <span className="text-xs font-bold tracking-widest text-[#FDFBF7]">AI ASSISTANT</span>
            <button onClick={() => setIsOpen(false)} className="text-[#888888] hover:text-[#FDFBF7] text-xs font-bold tracking-widest transition-colors">CLOSE</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-[#0a0a0a]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 text-sm font-mono leading-relaxed border ${msg.role === 'user' ? 'bg-[#FDFBF7] text-black border-black' : 'bg-black text-[#FDFBF7] border-[#333333]'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-xs font-bold tracking-widest text-[#888888] animate-pulse">THINKING...</div>
            )}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="border-t border-[#333333] flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="YOUR QUESTION..."
              className="flex-1 bg-black p-4 text-[#FDFBF7] focus:outline-none text-sm font-mono placeholder:text-[#333333]"
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="px-6 bg-[#FDFBF7] text-black text-xs font-bold tracking-widest hover:bg-[#dddddd] disabled:opacity-50 transition-colors">
              SEND
            </button>
          </form>
        </div>
      )}
    </>
  )
}
