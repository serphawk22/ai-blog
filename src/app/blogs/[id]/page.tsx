import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Chatbot from '@/components/Chatbot';
import prisma from '@/lib/prisma';


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

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen relative bg-slate-950 text-white selection:bg-fuchsia-300 selection:text-fuchsia-900 pb-20 overflow-hidden z-0">
      {/* Background Blobs */}
      <div className="fixed top-[20%] left-[-10%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[150px] animate-pulse-glow -z-10"></div>
      <div className="fixed bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[150px] animate-pulse-glow -z-10" style={{ animationDelay: '2s' }}></div>

      <main className="max-w-3xl mx-auto px-6 py-12 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all mb-12 group backdrop-blur-md shadow-lg hover:shadow-fuchsia-500/20">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold tracking-wide">Back to blogs</span>
        </Link>
        
        <article>
          <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{blog.readTime} min read</span>
              </div>
            </div>
          </header>

          {blog.imageUrl && (
            <div className="mb-14 rounded-3xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(217,70,239,0.2)] border border-white/10 relative aspect-video transition-transform hover:scale-[1.02] duration-500">
              <Image 
                src={blog.imageUrl} 
                alt={blog.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          )}

          <div className="prose prose-invert prose-fuchsia max-w-none prose-lg md:prose-xl leading-relaxed tracking-wide text-slate-300">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>
        </article>
      </main>

      <Chatbot blogContext={`Title: ${blog.title}\n\nContent:\n${blog.content}`} />
    </div>
  );
}
