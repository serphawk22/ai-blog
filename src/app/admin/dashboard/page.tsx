'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

const CATEGORIES = ["Tech", "AI", "Hardware", "SEO", "Business", "Sales"];

export default function AdminDashboard() {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [readTime, setReadTime] = useState('5');
  const [category, setCategory] = useState('Tech');
  const [content, setContent] = useState('');
  const [isParaphrasing, setIsParaphrasing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const router = useRouter();

  const handleParaphrase = async () => {
    if (!content.trim()) return;
    setIsParaphrasing(true);
    
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'paraphrase', text: content }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setContent(data.result);
      } else {
        alert('Error paraphrasing: ' + data.error);
      }
    } catch {
      alert('Failed to paraphrase');
    } finally {
      setIsParaphrasing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, imageUrl, readTime, content, category }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Blog published successfully.' });
        setTitle('');
        setImageUrl('');
        setContent('');
        setReadTime('5');
        setTimeout(() => router.push('/'), 1500);
      } else {
        setMessage({ type: 'error', text: 'Failed to publish. Are you authenticated?' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-[#FDFBF7] font-sans selection:bg-[#FDFBF7] selection:text-black">
      
      <header className="px-6 py-8 border-b border-[#333333] flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-2xl tracking-tighter">NEXUS.</Link>
          <span className="text-sm font-bold tracking-widest text-[#888888]">ADMIN PORTAL</span>
        </div>
        <Link href="/" className="text-sm border border-[#333333] px-4 py-2 hover:bg-[#FDFBF7] hover:text-black transition-colors font-bold">
          EXIT
        </Link>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left: Form */}
        <div className="w-full lg:w-1/3 border-r border-[#333333] p-6 lg:p-10 overflow-y-auto flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">NEW POST</h1>
            <p className="text-[#888888] text-sm">Publish directly to the grid.</p>
          </div>

          {message && (
            <div className={`p-4 border font-bold text-sm ${message.type === 'success' ? 'bg-[#FDFBF7] text-black' : 'border-red-500 text-red-500'}`}>
              {message.text}
            </div>
          )}

          <form id="blog-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold tracking-widest text-[#888888]">TITLE</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black border-b border-[#333333] px-0 py-3 text-[#FDFBF7] focus:outline-none focus:border-[#FDFBF7] transition-colors text-xl font-bold placeholder:text-[#333333]"
                placeholder="Post Title..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold tracking-widest text-[#888888]">IMAGE</label>
              <div className="flex gap-4 items-center">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 bg-black border-b border-[#333333] px-0 py-3 text-[#FDFBF7] focus:outline-none focus:border-[#FDFBF7] transition-colors font-mono text-sm placeholder:text-[#333333]"
                  placeholder="https://... OR"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImageUrl(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full max-w-[120px] text-xs file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-[#FDFBF7] file:text-black hover:file:bg-[#dddddd] cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold tracking-widest text-[#888888]">CATEGORY</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black border-b border-[#333333] px-0 py-3 text-[#FDFBF7] focus:outline-none focus:border-[#FDFBF7] transition-colors text-sm font-bold"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold tracking-widest text-[#888888]">READ TIME</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  className="w-full bg-black border-b border-[#333333] px-0 py-3 text-[#FDFBF7] focus:outline-none focus:border-[#FDFBF7] transition-colors text-sm font-bold"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <button
                type="button"
                onClick={handleParaphrase}
                disabled={isParaphrasing || !content.trim()}
                className="w-full py-4 border border-[#333333] text-sm font-bold tracking-widest hover:bg-[#1A1A1A] transition-colors disabled:opacity-50"
              >
                {isParaphrasing ? 'REFINING...' : 'AI PARAPHRASE'}
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#FDFBF7] text-black text-sm font-bold tracking-widest hover:bg-[#dddddd] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'PUBLISHING...' : 'PUBLISH POST'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Split Editor/Preview */}
        <div className="w-full lg:w-2/3 flex flex-col lg:flex-row h-[600px] lg:h-auto border-t lg:border-t-0 border-[#333333]">
          <div className="w-full lg:w-1/2 h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-[#333333] flex flex-col">
            <div className="p-4 border-b border-[#333333] text-xs font-bold tracking-widest text-[#888888]">MARKDOWN</div>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 w-full bg-black p-6 text-[#FDFBF7] focus:outline-none resize-none font-mono text-sm leading-relaxed placeholder:text-[#333333]"
              placeholder="Start writing..."
              form="blog-form"
            />
          </div>
          
          <div className="w-full lg:w-1/2 h-1/2 lg:h-full bg-[#0a0a0a] flex flex-col">
            <div className="p-4 border-b border-[#333333] text-xs font-bold tracking-widest text-[#888888]">LIVE PREVIEW</div>
            <div className="flex-1 p-8 overflow-y-auto prose prose-invert max-w-none prose-headings:font-bold prose-a:text-white prose-a:underline prose-img:border prose-img:border-[#333333]">
              {content ? <ReactMarkdown>{content}</ReactMarkdown> : <p className="text-[#333333] font-mono text-sm">Preview will appear here.</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
