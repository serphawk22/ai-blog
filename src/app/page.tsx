import Link from 'next/link';
import prisma from '@/lib/prisma';
import { BlogCard } from '@/components/ui/BlogCard';

export const dynamic = 'force-dynamic';

const CATEGORIES = ["All", "Tech", "AI", "Hardware", "SEO", "Business", "Sales"];

async function getBlogs(category?: string) {
  try {
    const where = category && category !== 'All' ? { category: { equals: category } } : {};
    const blogs = await prisma.blog.findMany({ 
      where,
      orderBy: { createdAt: 'desc' } 
    });
    return blogs;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams?.category || 'All';
  const blogs = await getBlogs(currentCategory);

  return (
    <div className="min-h-screen bg-black text-[#FDFBF7] selection:bg-[#FDFBF7] selection:text-black font-sans">
      
      <header className="px-6 py-12 md:py-20 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <Link href="/" className="text-4xl md:text-6xl font-bold tracking-tighter hover:opacity-70 transition-opacity">
            NEXUS.
          </Link>
          <Link href="/admin" className="text-sm font-semibold border border-[#333333] px-6 py-3 hover:bg-[#FDFBF7] hover:text-black transition-colors rounded-none">
            ADMIN PORTAL
          </Link>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-16 border-b border-[#1A1A1A] pb-8">
          {CATEGORIES.map(cat => (
            <Link 
              key={cat} 
              href={cat === 'All' ? '/' : `/?category=${cat}`}
              className={`text-xs md:text-sm font-bold tracking-widest px-4 py-2 transition-colors ${
                currentCategory === cat 
                  ? 'bg-[#FDFBF7] text-black' 
                  : 'text-[#888888] hover:text-[#FDFBF7] hover:bg-[#1A1A1A]'
              }`}
            >
              {cat.toUpperCase()}
            </Link>
          ))}
        </div>

        {/* 4-Column Grid */}
        {blogs.length === 0 ? (
          <div className="py-20 text-[#888888] text-xl font-medium">No articles found in {currentCategory}.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
            {blogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </header>
      
      <footer className="border-t border-[#1A1A1A] py-12 px-6 mt-20">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center text-sm font-medium text-[#888888]">
          <span>© {new Date().getFullYear()} NEXUS.</span>
          <span>MINIMALIST EDITION</span>
        </div>
      </footer>
    </div>
  );
}
