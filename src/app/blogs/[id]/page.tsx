import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, Share2, Bookmark, Heart, Eye, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Chatbot from '@/components/Chatbot';
import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/Button';

async function getBlog(id: string) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id }
    });
    return blog;
  } catch {
    return null;
  }
}

export default async function BlogDetail({ params }: { params: { id: string } }) {
  const blog = await getBlog(params.id);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen relative bg-ds-background text-white selection:bg-ds-purple/30 selection:text-white pb-32 overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="fixed top-[10%] left-[-10%] w-[500px] h-[500px] bg-ds-cyan/10 rounded-full blur-[150px] animate-float -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-ds-purple/10 rounded-full blur-[150px] animate-float-slow -z-10 pointer-events-none" style={{ animationDelay: '1s' }}></div>

      {/* Premium Header Image */}
      {blog.imageUrl && (
        <div className="relative w-full h-[50vh] md:h-[70vh] mb-16 md:mb-32">
          <Image 
            src={blog.imageUrl} 
            alt={blog.title} 
            fill 
            className="object-cover" 
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ds-background via-ds-background/60 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full px-6 translate-y-1/2">
            <div className="max-w-4xl mx-auto glass-panel p-8 md:p-12 rounded-[40px] border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-3xl animate-slide-up">
              <Link href="/" className="inline-flex items-center gap-2 text-ds-cyan hover:text-white transition-colors mb-6 font-bold uppercase tracking-[0.15em] text-xs group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>Back to Home</span>
              </Link>
              
              <div className="flex items-center gap-2 mb-4">
                 <span className="px-3 py-1 bg-ds-purple text-white text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(157,78,221,0.5)]">AI Research</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-10 leading-[1.1] text-white">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-400">
                <div className="flex items-center gap-3 group">
                  <div className="w-12 h-12 rounded-full bg-gradient-premium flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(157,78,221,0.5)] group-hover:scale-110 transition-transform">
                    A
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-base">Alex Mercer</span>
                    <span className="text-xs text-ds-cyan">Senior AI Researcher</span>
                  </div>
                </div>
                <div className="w-px h-10 bg-white/10 hidden md:block"></div>
                <div className="flex items-center gap-2 bg-white/5 px-5 py-2.5 rounded-full border border-white/10 shadow-inner">
                  <Calendar size={16} className="text-ds-purple" />
                  <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-5 py-2.5 rounded-full border border-white/10 shadow-inner">
                  <Clock size={16} className="text-ds-cyan" />
                  <span>{blog.readTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 relative z-10 pt-32 md:pt-24 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center justify-between mb-16 py-6 border-y border-white/10">
          <div className="flex gap-6">
            <button className="flex items-center gap-2 text-slate-400 hover:text-ds-pink transition-colors font-bold text-lg group">
              <Heart size={24} className="group-hover:fill-ds-pink transition-colors" /> <span>1.2k</span>
            </button>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-lg">
              <Eye size={24} className="text-ds-cyan" /> <span>4.5k views</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors shadow-lg hover:shadow-ds-cyan/20 hover:scale-110">
              <Bookmark size={20} />
            </button>
            <button className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors shadow-lg hover:shadow-ds-purple/20 hover:scale-110">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        <article className="prose prose-invert prose-fuchsia max-w-none prose-lg md:prose-xl leading-relaxed tracking-wide text-slate-300 font-medium prose-headings:font-extrabold prose-headings:text-white prose-a:text-ds-cyan prose-img:rounded-[32px] prose-img:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] prose-img:border prose-img:border-white/10 prose-strong:text-white prose-blockquote:border-ds-purple prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </article>
      </main>

      <Chatbot blogContext={`Title: ${blog.title}\n\nContent:\n${blog.content}`} />
    </div>
  );
}
