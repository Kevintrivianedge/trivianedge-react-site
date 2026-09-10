import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';

interface BlogMetaProps {
  date: string;
  readTime: string;
  author: string;
  category: string;
  datePublished?: string;
  compact?: boolean;
}

const BlogMeta: React.FC<BlogMetaProps> = ({
  date,
  readTime,
  author,
  category,
  datePublished,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <time dateTime={datePublished || date}>{date}</time>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{readTime}</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-bold uppercase tracking-widest text-cyan-400">
          {category}
        </span>
      </div>
    );
  }

  return (
    <div className="reveal">
      {/* Date, Time, Category Row */}
      <div className="flex flex-wrap items-center gap-6 mb-8 gap-y-3">
        <div className="flex items-center gap-2 text-[10px] text-muted font-mono tracking-widest uppercase">
          <Calendar className="w-4 h-4" />
          <time dateTime={datePublished || date}>{date}</time>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted font-mono tracking-widest uppercase">
          <Clock className="w-4 h-4" />
          <span>{readTime}</span>
        </div>
        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
          {category}
        </span>
      </div>

      {/* Author Box */}
      <div className="flex items-center gap-4 p-6 glass border-border rounded-3xl w-fit mb-8">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center p-0.5">
          <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
            <User className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
        <div>
          <p className="text-[10px] text-muted font-mono uppercase tracking-widest">Authored By</p>
          <p className="text-text font-bold">{author}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogMeta;
