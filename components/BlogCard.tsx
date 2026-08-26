import React from 'react';
import { ArrowRight, User, FileText, Settings, Cpu, Globe, UserPlus, Users, Wifi, Newspaper } from 'lucide-react';
import { BlogPost } from '../types';

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'Case Study': FileText,
  Operations: Settings,
  'AI & Tech': Cpu,
  'Global Strategy': Globe,
  Hiring: UserPlus,
  Culture: Users,
  'Remote Work': Wifi,
};

const BlogCard: React.FC<{ post: BlogPost; onClick: (id: string) => void; index: number }> = ({ post, onClick, index }) => {
  const CategoryIcon = CATEGORY_ICONS[post.category] ?? Newspaper;

  return (
  <button
    type="button"
    onClick={() => onClick(post.id)}
    className="reveal glass tilt-card group w-full text-left p-8 rounded-[2.5rem] border-border hover-neon-glow overflow-hidden relative"
    style={{ transitionDelay: `${index * 200}ms` }}
  >
    <div
      className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-br ${post.imageGradient} group-hover:opacity-80 transition-opacity`}
      style={{ maskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)' }}
    >
      <CategoryIcon className="absolute -right-3 -top-3 w-24 h-24 text-cyan-950/50 dark:text-white/10" strokeWidth={1.25} />
    </div>
    <div className="relative z-10 pt-20">
      <div className="flex items-center gap-3 mb-4">
        <span className="px-3 py-1 rounded-full bg-surface border border-border text-[10px] font-bold uppercase tracking-widest text-text/70">
          {post.category}
        </span>
        <span className="text-[10px] text-muted font-mono tracking-widest">{post.readTime}</span>
      </div>
      <h3 className="text-2xl font-bold mb-4 group-hover:text-text transition-colors text-text">{post.title}</h3>
      <p className="text-muted text-sm leading-relaxed mb-6 line-clamp-2">{post.excerpt}</p>
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center">
            <User className="w-4 h-4 text-muted" />
          </div>
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{post.author}</span>
        </div>
        <ArrowRight className="w-5 h-5 text-muted group-hover:text-text group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  </button>
  );
};

export default BlogCard;
