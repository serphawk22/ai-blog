import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { Blog } from '@prisma/client';

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

  return (
    <div className="min-h-screen relative bg-slate-950 text-white selection:bg-fuchsia-300 selection:text-fuchsia-900 overflow-hidden z-0">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[120px] animate-pulse-glow -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] animate-pulse-glow -z-10" style={{ animationDelay: '1.5s' }}></div>
      
      <main className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <header className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400">
              Nexus AI Blog
            </h1>
            <p className="mt-2 text-slate-300 text-lg">Explore the latest thoughts, powered by AI.</p>
          </div>
          <Link href="/admin" className="px-6 py-3 rounded-full font-bold text-sm transition-all bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-xl flex items-center gap-2 shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-0.5">
            Admin Area
          </Link>
        </header>

        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
            <h2 className="text-2xl font-medium text-slate-300">No blogs published yet</h2>
            <p className="text-slate-400 mt-2">Check back later or add one via the admin area.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog: Blog) => (
              <Link key={blog.id} href={`/blogs/${blog.id}`} className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 transition-all duration-500 hover:border-fuchsia-500/50 hover:shadow-[0_0_40px_-10px_rgba(217,70,239,0.3)] hover:-translate-y-2 backdrop-blur-sm">
                {blog.imageUrl && (
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <Image 
                      src={blog.imageUrl} 
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-fuchsia-400 mb-3">
                    <span>{blog.readTime} MIN READ</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white leading-tight group-hover:text-fuchsia-300 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-3">
                    {blog.content.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
