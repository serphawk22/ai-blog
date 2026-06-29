import Link from 'next/link';
import prisma from '@/lib/prisma';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-sans selection:bg-fuchsia-300 selection:text-fuchsia-900">
      <main className="max-w-6xl mx-auto px-6 py-16">
        <header className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400">
              Nexus AI Blog
            </h1>
            <p className="mt-2 text-slate-300 text-lg">Explore the latest thoughts, powered by AI.</p>
          </div>
          <Link href="/admin" className="px-5 py-2.5 rounded-full font-medium text-sm transition-all bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md flex items-center gap-2">
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
            {blogs.map((blog) => (
              <Link key={blog.id} href={`/blogs/${blog.id}`} className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 transition-all hover:border-fuchsia-500/50 hover:shadow-[0_0_30px_-5px_rgba(217,70,239,0.3)] hover:-translate-y-1">
                {blog.imageUrl && (
                  <div className="aspect-[16/10] overflow-hidden">
                    <img 
                      src={blog.imageUrl} 
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
