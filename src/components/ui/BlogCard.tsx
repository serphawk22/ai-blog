import Link from 'next/link'
import Image from 'next/image'
import { Blog } from '@prisma/client'

export function BlogCard({ blog }: { blog: Blog }) {
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <Link href={`/blogs/${blog.id}`} className="group flex flex-col gap-5">
      {/* 4x5 Aspect Ratio Image container for the brutalist grid */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#1A1A1A] border border-[#333333] transition-colors group-hover:border-[#FDFBF7]">
        {blog.imageUrl ? (
          <Image 
            src={blog.imageUrl} 
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-all duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#333333] font-bold text-4xl">
            NEXUS
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#888888] tracking-widest uppercase">
          <span className="text-black bg-[#FDFBF7] px-2 py-1">{blog.category || 'TECH'}</span>
          <span>{formattedDate}</span>
        </div>
        
        <h3 className="text-2xl font-bold leading-tight group-hover:underline decoration-2 underline-offset-4">
          {blog.title}
        </h3>
        
        <p className="text-[#888888] text-sm line-clamp-3 leading-relaxed">
          {blog.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
        </p>
      </div>
    </Link>
  )
}
