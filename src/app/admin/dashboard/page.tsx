'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, PenTool, Image as ImageIcon, Clock, CheckCircle, AlertCircle, LayoutDashboard, FileText, BarChart3, Settings, Bell, Search, UploadCloud, Eye, Hash, Tag, Save, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

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
    <div className="min-h-screen flex bg-[#02040A] text-white selection:bg-ds-cyan/30 selection:text-white font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-[#050816] hidden lg:flex flex-col relative z-20">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center shadow-[0_0_15px_rgba(157,78,221,0.5)]">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Nexus Admin</span>
        </div>
        
        <div className="flex-1 py-8 px-4 flex flex-col gap-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">Menu</div>
          <button className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 text-white font-semibold border border-white/10 shadow-inner">
            <FileText size={18} className="text-ds-cyan" /> New Post
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-medium">
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-medium">
            <BarChart3 size={18} /> Analytics
          </button>
          
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest px-4 mt-8 mb-2">System</div>
          <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-medium">
            <Settings size={18} /> Settings
          </button>
        </div>

        <div className="p-6 border-t border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-ds-purple to-ds-cyan flex items-center justify-center font-bold text-sm text-white">
            AM
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold">Alex Mercer</span>
            <span className="text-xs text-slate-400">Admin</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Background Blobs */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-ds-cyan/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-[-20%] left-[10%] w-[600px] h-[600px] bg-ds-purple/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>

        {/* Topbar */}
        <header className="h-20 border-b border-white/5 bg-[#050816]/80 backdrop-blur-xl flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4 w-96 relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ds-cyan transition-colors" />
            <input type="text" placeholder="Search posts, analytics..." className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ds-cyan focus:bg-white/10 transition-all shadow-inner" />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-ds-pink rounded-full"></span>
            </button>
            <Button size="sm" variant="ghost" onClick={() => router.push('/')}>View Site</Button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">Create Post</h1>
                <p className="text-slate-400 text-lg">Write and publish your next great idea.</p>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-2xl mb-8 flex items-center gap-3 animate-fade-in ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]'}`}>
                {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <span className="font-semibold">{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-8">
              
              {/* Left Column: Editor */}
              <div className="flex-1 flex flex-col gap-6">
                
                <div className="glass-panel p-8 rounded-[32px]">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><PenTool size={20} className="text-ds-cyan" /> Post Details</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Title</label>
                      <Input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="The Future of Artificial Intelligence"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Cover Image URL</label>
                        <Input
                          type="url"
                          icon={ImageIcon}
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Read Time (Mins)</label>
                        <Input
                          type="number"
                          required
                          min="1"
                          icon={Clock}
                          value={readTime}
                          onChange={(e) => setReadTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-panel rounded-[32px] overflow-hidden flex flex-col min-h-[600px]">
                  <div className="flex justify-between items-center p-4 bg-white/5 border-b border-white/10">
                    <div className="flex gap-2">
                      <button type="button" className="px-4 py-2 rounded-xl bg-ds-cyan/20 text-ds-cyan text-sm font-bold border border-ds-cyan/30">Write</button>
                      <button type="button" className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-sm font-bold transition-colors">Preview</button>
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleParaphrase}
                      disabled={isParaphrasing || !content.trim()}
                      className="text-xs px-4 py-2 bg-ds-purple/20 text-ds-purple border border-ds-purple/50 rounded-xl hover:bg-ds-purple/30 transition-colors flex items-center gap-2 disabled:opacity-50 font-bold"
                    >
                      {isParaphrasing ? (
                        <><Sparkles size={14} className="animate-spin"/> Refining...</>
                      ) : (
                        <><Sparkles size={14} /> AI Enhance</>
                      )}
                    </button>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                    <textarea
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full h-full min-h-[400px] bg-transparent p-8 text-white focus:outline-none resize-none font-mono text-sm leading-relaxed placeholder:text-slate-600"
                      placeholder="Start writing in Markdown..."
                    />
                    
                    <div className="hidden lg:block bg-black/20 p-8 overflow-y-auto prose prose-invert prose-fuchsia max-w-none">
                      {content ? <ReactMarkdown>{content}</ReactMarkdown> : <p className="text-slate-500 italic">Preview will appear here...</p>}
                    </div>
                  </div>
                </div>

              </div>
              
              {/* Right Column: Settings & Publish */}
              <div className="w-full xl:w-80 flex flex-col gap-6">
                
                <div className="glass-panel p-6 rounded-[32px]">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Send size={18} className="text-ds-pink" /> Publish</h3>
                  <div className="space-y-4 mb-6 text-sm text-slate-300">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-500">Status:</span>
                      <span className="font-semibold text-ds-cyan">Draft</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-500">Visibility:</span>
                      <span className="font-semibold text-white">Public</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">SEO Score:</span>
                      <span className="font-semibold text-green-400">92/100</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Button type="button" variant="secondary" className="w-full flex items-center justify-center gap-2">
                      <Save size={16} /> Save Draft
                    </Button>
                    <Button type="submit" variant="primary" className="w-full py-4 text-lg" disabled={isSubmitting}>
                      {isSubmitting ? 'Publishing...' : 'Publish Post'}
                    </Button>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-[32px]">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Tag size={18} className="text-ds-purple" /> Meta Data</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Tags</label>
                      <div className="flex items-center gap-2 bg-[#0C1224]/50 border border-white/10 rounded-xl px-3 py-2">
                        <Hash size={14} className="text-ds-cyan" />
                        <input type="text" placeholder="Add a tag..." className="bg-transparent border-none outline-none text-sm w-full text-white" />
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-white/5 rounded-lg border border-white/10 text-slate-300 flex items-center gap-1">
                          AI <button type="button" className="hover:text-white">&times;</button>
                        </span>
                        <span className="text-xs px-2 py-1 bg-white/5 rounded-lg border border-white/10 text-slate-300 flex items-center gap-1">
                          Tech <button type="button" className="hover:text-white">&times;</button>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
