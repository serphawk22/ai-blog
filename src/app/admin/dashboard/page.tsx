'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, PenTool, Image as ImageIcon, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [readTime, setReadTime] = useState('5');
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
        body: JSON.stringify({ title, imageUrl, readTime, content }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Blog published successfully!' });
        setTitle('');
        setImageUrl('');
        setContent('');
        setReadTime('5');
        setTimeout(() => router.push('/'), 1500);
      } else {
        setMessage({ type: 'error', text: 'Failed to publish blog. Please check if you are authenticated.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 flex justify-between items-end border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-400">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 mt-2">Create a new blog post</p>
          </div>
          <button onClick={() => router.push('/')} className="text-sm text-slate-400 hover:text-white transition-colors">
            View Site
          </button>
        </header>

        {message && (
          <div className={`p-4 rounded-xl mb-8 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-900/20 text-green-400 border border-green-900/50' : 'bg-red-900/20 text-red-400 border border-red-900/50'}`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-slate-900/50 p-8 rounded-3xl border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <PenTool size={16} className="text-cyan-400"/> Blog Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                placeholder="E.g. The Future of AI"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Clock size={16} className="text-fuchsia-400"/> Read Time (mins)
              </label>
              <input
                type="number"
                required
                min="1"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <ImageIcon size={16} className="text-emerald-400"/> Cover Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end mb-2">
              <label className="text-sm font-medium text-slate-300">Content (Markdown supported)</label>
              <button
                type="button"
                onClick={handleParaphrase}
                disabled={isParaphrasing || !content.trim()}
                className="text-xs px-3 py-1.5 bg-fuchsia-900/30 text-fuchsia-300 border border-fuchsia-700/50 rounded-lg hover:bg-fuchsia-900/50 transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                {isParaphrasing ? (
                  <span className="flex items-center gap-1"><Sparkles size={12} className="animate-spin"/> Magic in progress...</span>
                ) : (
                  <span className="flex items-center gap-1"><Sparkles size={12} /> Paraphrase with AI</span>
                )}
              </button>
            </div>
            <textarea
              required
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all resize-none font-mono text-sm"
              placeholder="Write your blog post here..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Blog Post'}
          </button>
        </form>
      </div>
    </div>
  );
}
