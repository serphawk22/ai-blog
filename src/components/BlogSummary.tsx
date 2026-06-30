'use client';

import { useState } from 'react';

export default function BlogSummary({ content }: { content: string }) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSummarize = async () => {
    if (summary) return;
    setIsLoading(true);
    setError(false);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'summarize',
          context: content,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSummary(data.result);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-12 border border-[#333333] p-6 bg-[#0a0a0a]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold tracking-widest text-[#FDFBF7]">AI SUMMARY</h2>
        {!summary && !isLoading && (
          <button 
            onClick={handleSummarize}
            className="text-xs border border-[#333333] px-4 py-2 hover:bg-[#FDFBF7] hover:text-black transition-colors font-bold tracking-widest"
          >
            GENERATE
          </button>
        )}
      </div>
      
      {isLoading && (
        <div className="text-xs font-bold tracking-widest text-[#888888] animate-pulse">
          ANALYZING TEXT...
        </div>
      )}
      
      {error && (
        <div className="text-xs font-bold tracking-widest text-red-500">
          FAILED TO GENERATE SUMMARY.
        </div>
      )}
      
      {summary && (
        <p className="text-[#cccccc] text-lg leading-relaxed font-serif">
          {summary}
        </p>
      )}
    </div>
  );
}
