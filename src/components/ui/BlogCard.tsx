import Link from 'next/link'
import Image from 'next/image'
import { Clock, Eye, Heart } from 'lucide-react'
import { Blog } from '@prisma/client'

export function BlogCard({ blog }: { blog: Blog }) {
  // Mocking data that doesn't exist in schema yet
  const category = "Artificial Intelligence"
  const author = "Alex Mercer"
  const views = Math.floor(Math.random() * 5000) + 1200
  const likes = Math.floor(Math.random() * 800) + 120
  
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <Link href={`/blogs/${blog.id}`} className="group relative block rounded-3xl p-1 bg-gradient-to-b from-white/5 to-transparent hover:from-ds-cyan/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,229,255,0.2)]">
      {/* Outer glow ring on hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-ds-cyan/30"></div>
      
      <div className="relative h-full bg-[#0C1224] rounded-[22px] overflow-hidden flex flex-col border border-white/5 z-10">
        {/* Cover Image */}
        {blog.imageUrl && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image 
              src={blog.imageUrl} 
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C1224] to-transparent opacity-80"></div>
            
            {/* Floating badges */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-white shadow-lg">
                {category}
              </span>
            </div>
          </div>
        )}

        <div className="flex-1 p-6 flex flex-col relative z-10 -mt-6">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-ds-cyan mb-3">
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{blog.readTime} MIN READ</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-3 text-white leading-tight group-hover:text-ds-cyan transition-colors duration-300">
            {blog.title}
          </h3>
          
          <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
            {blog.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
          </p>
          
          <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-premium flex items-center justify-center text-white font-bold text-[10px]">
                {author.charAt(0)}
              </div>
              <span className="text-slate-300">{author}</span>
              <span className="mx-1">•</span>
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 group-hover:text-ds-pink transition-colors">
                <Heart size={14} />
                <span>{likes}</span>
              </div>
              <div className="flex items-center gap-1 group-hover:text-ds-cyan transition-colors">
                <Eye size={14} />
                <span>{views}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
