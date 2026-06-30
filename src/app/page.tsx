import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { Blog } from '@prisma/client';
import { Search, ChevronRight, Sparkles, TrendingUp, Mail } from 'lucide-react';
import { BlogCard } from '@/components/ui/BlogCard';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

async function getBlogs() {
  try {
    const blogs = await prisma.blog.findMany({ orderBy: { createdAt: 'desc' } });
    return blogs;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default async function Home() {
  const blogs = await getBlogs();
  const featuredBlog = blogs[0];
  const latestBlogs = blogs.slice(1);

  return (
    <div className="min-h-screen relative bg-ds-background text-white selection:bg-ds-purple/30 selection:text-white overflow-x-hidden font-sans">
      {/* Background Blobs */}
      <div className="fixed top-[-10%] left-[20%] w-[600px] h-[600px] bg-ds-purple/10 rounded-full blur-[150px] animate-float -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-ds-cyan/10 rounded-full blur-[150px] animate-float-slow -z-10 pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 animate-fade-in">
        <div className="max-w-7xl mx-auto glass-panel rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center shadow-[0_0_20px_rgba(157,78,221,0.5)] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] transition-all duration-500">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">Nexus AI</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <Link href="/" className="text-white drop-shadow-md">Home</Link>
            <Link href="#" className="hover:text-white transition-colors duration-300">Articles</Link>
            <Link href="#" className="hover:text-white transition-colors duration-300">Categories</Link>
            <Link href="#" className="hover:text-white transition-colors duration-300">About</Link>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden lg:flex relative group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-ds-cyan transition-colors duration-300" />
              <input type="text" placeholder="Search articles..." className="w-56 bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ds-cyan focus:bg-white/10 transition-all duration-300 placeholder:text-slate-500 focus:w-72 shadow-inner" />
            </div>
            <Link href="/admin">
              <Button size="sm" variant="glass">Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-40 pb-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <section className="text-center max-w-4xl mx-auto mb-32 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-xs font-bold text-ds-cyan mb-10 uppercase tracking-[0.2em] border border-ds-cyan/30 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
              <Sparkles size={14} /> The Future of Intelligence
            </div>
            <h1 className="text-6xl md:text-[5.5rem] font-extrabold tracking-tighter mb-8 leading-[1.1]">
              Explore the <br />
              <span className="text-gradient">AI Frontier.</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Dive into thought-provoking essays, cutting-edge tutorials, and the latest news shaping the artificial intelligence landscape.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Button size="lg" variant="primary">Start Reading</Button>
              <Button size="lg" variant="secondary">Subscribe Newsletter</Button>
            </div>
          </section>

          {/* Featured Article */}
          {featuredBlog && (
            <section className="mb-32 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-10">
                <div className="p-2.5 rounded-xl bg-ds-purple/20 text-ds-purple border border-ds-purple/30 shadow-[0_0_20px_rgba(157,78,221,0.2)]">
                  <TrendingUp size={20} />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Featured Story</h2>
              </div>
              
              <Link href={`/blogs/${featuredBlog.id}`} className="group relative block rounded-[40px] p-1 bg-gradient-to-br from-white/10 to-transparent hover:from-ds-purple/40 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(157,78,221,0.3)] hover:-translate-y-2">
                <div className="relative h-[450px] md:h-[600px] rounded-[36px] overflow-hidden bg-[#0C1224] border border-white/5">
                  {featuredBlog.imageUrl && (
                    <Image 
                      src={featuredBlog.imageUrl} 
                      alt={featuredBlog.title}
                      fill
                      className="object-cover transition-transform duration-[1.5s] group-hover:scale-105 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/60 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 w-full p-8 md:p-14 z-10 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div className="max-w-3xl">
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-ds-purple text-white text-xs font-bold uppercase tracking-widest rounded-full mb-5 shadow-[0_0_20px_rgba(157,78,221,0.5)]">
                        <Sparkles size={12}/> Must Read
                      </span>
                      <h3 className="text-4xl md:text-6xl font-bold mb-5 leading-[1.1] tracking-tight group-hover:text-ds-cyan transition-colors duration-500">{featuredBlog.title}</h3>
                      <p className="text-slate-300 text-lg md:text-xl line-clamp-2 md:line-clamp-3 mb-8 font-medium leading-relaxed">
                        {featuredBlog.content.replace(/<[^>]*>?/gm, '').substring(0, 200)}...
                      </p>
                      <div className="flex items-center gap-4 text-sm font-semibold text-slate-400">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-premium flex items-center justify-center text-white text-xs">
                            A
                          </div>
                          <span className="text-white">Alex Mercer</span>
                        </div>
                        <span>•</span>
                        <span>{new Date(featuredBlog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                        <span>•</span>
                        <span className="text-ds-cyan">{featuredBlog.readTime} min read</span>
                      </div>
                    </div>
                    
                    <div className="hidden md:flex w-16 h-16 rounded-full glass-panel text-white items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-ds-cyan group-hover:text-[#050816] group-hover:border-ds-cyan transition-all duration-500 shadow-2xl">
                      <ChevronRight size={28} />
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Latest Articles */}
          <section className="mb-40">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-bold tracking-tight">Latest Articles</h2>
              <Link href="#" className="text-sm font-bold text-ds-cyan hover:text-white transition-colors duration-300 flex items-center gap-1 group">
                View all <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {latestBlogs.length === 0 ? (
              <div className="text-center py-32 glass-panel rounded-[40px] border border-white/5">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-slate-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No articles found</h3>
                <p className="text-slate-400">Check back soon for new content.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {latestBlogs.map(blog => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            )}
          </section>

          {/* Newsletter Section */}
          <section className="relative rounded-[48px] overflow-hidden p-1 bg-gradient-to-br from-ds-cyan/40 via-ds-purple/40 to-ds-pink/40 shadow-[0_0_100px_-20px_rgba(157,78,221,0.4)] hover:shadow-[0_0_120px_-10px_rgba(0,229,255,0.5)] transition-shadow duration-700">
            <div className="absolute inset-0 bg-[#050816]/90 backdrop-blur-3xl rounded-[44px]"></div>
            <div className="relative rounded-[44px] p-16 md:p-32 text-center flex flex-col items-center border border-white/10 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-ds-pink/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-ds-cyan/20 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/3"></div>
              
              <div className="w-20 h-20 rounded-3xl bg-gradient-premium flex items-center justify-center mb-10 shadow-[0_20px_40px_rgba(157,78,221,0.5)] z-10">
                <Mail size={36} className="text-white" />
              </div>
              <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight z-10 leading-[1.1]">Stay ahead of <br /> the curve.</h2>
              <p className="text-slate-300 text-xl md:text-2xl mb-12 max-w-2xl leading-relaxed z-10 font-medium">
                Get the latest AI insights, tutorials, and news delivered straight to your inbox every week. No spam, just pure signal.
              </p>
              <div className="w-full max-w-lg flex flex-col sm:flex-row gap-4 z-10">
                <input type="email" placeholder="hello@nexus.ai" className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-ds-cyan focus:bg-white/10 transition-all shadow-inner" />
                <Button size="lg" variant="primary" className="py-4">Subscribe Now</Button>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#02040A] pt-20 pb-10 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight">Nexus AI</span>
            </div>
            <div className="flex gap-8 text-sm font-semibold text-slate-400">
              <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
              <Link href="#" className="hover:text-white transition-colors">Discord</Link>
              <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-sm font-medium">
            <div>
              © {new Date().getFullYear()} Nexus AI Startup. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
