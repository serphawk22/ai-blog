import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Chatbot from '@/components/Chatbot';
import BlogSummary from '@/components/BlogSummary';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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

export default async function BlogDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const blog = await getBlog(resolvedParams.id);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-[#FDFBF7] font-sans selection:bg-[#FDFBF7] selection:text-black">
      <header className="px-6 py-8 border-b border-[#1A1A1A] max-w-[1000px] mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-2xl tracking-tighter hover:opacity-70 transition-opacity">NEXUS.</Link>
        <Link href="/" className="text-xs border border-[#333333] px-4 py-2 hover:bg-[#FDFBF7] hover:text-black transition-colors font-bold tracking-widest">BACK</Link>
      </header>

      <main className="max-w-[1000px] mx-auto px-6 py-12 md:py-24">
        <div className="mb-12 flex flex-col gap-6 border-b border-[#1A1A1A] pb-16">
          <div className="flex items-center gap-4 text-xs font-bold tracking-widest text-[#888888]">
            <span className="text-black bg-[#FDFBF7] px-2 py-1 uppercase">{blog.category || 'TECH'}</span>
            <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}</span>
            <span>{blog.readTime} MIN READ</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
            {blog.title}
          </h1>
        </div>

        {blog.imageUrl && (
          <div className="w-full aspect-video relative mb-16 border border-[#333333] bg-[#1A1A1A]">
            <Image 
              src={blog.imageUrl} 
              alt={blog.title} 
              fill 
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              priority 
            />
          </div>
        )}
        
        <div className="max-w-[800px] mx-auto">
          <BlogSummary content={blog.content} />
          
          <article className="prose prose-invert max-w-none prose-lg md:prose-xl leading-relaxed text-[#cccccc] prose-headings:font-bold prose-headings:text-[#FDFBF7] prose-headings:tracking-tight prose-a:text-[#FDFBF7] prose-a:underline prose-img:border prose-img:border-[#333333] prose-blockquote:border-[#FDFBF7] prose-blockquote:text-[#888888] prose-strong:text-[#FDFBF7]">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </article>
        </div>
      </main>

      <footer className="border-t border-[#1A1A1A] py-12 px-6 mt-20">
        <div className="max-w-[1000px] mx-auto flex justify-between items-center text-xs font-bold tracking-widest text-[#888888]">
          <span>© {new Date().getFullYear()} NEXUS.</span>
          <Link href="/" className="hover:text-[#FDFBF7] transition-colors">HOME</Link>
        </div>
      </footer>

      <Chatbot blogContext={`Title: ${blog.title}\n\nContent:\n${blog.content}`} />
    </div>
  );
}
