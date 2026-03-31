import React from 'react';
import { ArrowRight, User } from 'lucide-react';
import { BlogPost } from '../types';

const BlogCard: React.FC<{ post: BlogPost; onClick: (id: string) => void; index: number }> = ({ post, onClick, index }) => (
  <button
    type="button"
    onClick={() => onClick(post.id)}
    className="reveal glass group w-full text-left p-8 rounded-[2.5rem] border-border hover-neon-glow overflow-hidden relative"
    style={{ transitionDelay: `${index * 200}ms` }}
  >
    <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-br ${post.imageGradient} opacity-20 group-hover:opacity-40 transition-opacity`} />
    <div className="relative z-10 pt-20">
      <div className="flex items-center gap-3 mb-4">
        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
          {post.category}
        </span>
        <span className="text-[10px] text-muted font-mono tracking-widest">{post.readTime}</span>
      </div>
      <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors text-text">{post.title}</h3>
      <p className="text-muted text-sm leading-relaxed mb-6 line-clamp-2">{post.excerpt}</p>
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center">
            <User className="w-4 h-4 text-muted" />
          </div>
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{post.author}</span>
        </div>
        <ArrowRight className="w-5 h-5 text-muted group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  </button>
);

export default BlogCard;
