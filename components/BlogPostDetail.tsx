import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { BLOG_POSTS } from '../constants';

const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Search by slug first (preferred), then fall back to id for backwards compatibility
  const post = BLOG_POSTS.find(p => p.slug === slug || p.id === slug);

  if (!post) {
    return (
      <div className="py-32 px-4 md:px-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text mb-4">Post Not Found</h1>
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-muted hover:text-cyan-400 transition-colors mx-auto group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Intelligence Feed</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <article aria-label={post.title} className="py-16 md:py-32 px-4 md:px-6 min-h-screen relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-500/5 to-transparent -z-10" />
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => { navigate('/blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-2 text-muted hover:text-cyan-400 transition-colors mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Intelligence Feed</span>
        </button>

        <div className="reveal">
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-[10px] text-muted font-mono tracking-widest uppercase">
              <Calendar className="w-4 h-4" />
              {post.date}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted font-mono tracking-widest uppercase">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-12 leading-tight text-text">{post.title}</h1>
          
          <div className="flex items-center gap-4 mb-16 p-6 glass border-border rounded-3xl w-fit">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center p-0.5">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <User className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <p className="text-[10px] text-muted font-mono uppercase tracking-widest">Authored By</p>
              <p className="text-text font-bold">{post.author}</p>
            </div>
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <div className="text-muted leading-relaxed space-y-8 text-xl">
              {post.content.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          <div className="mt-24 p-12 glass border-border rounded-[3rem] text-center">
            <h3 className="text-2xl font-bold mb-6 text-text">Inspired by this insight?</h3>
            <p className="text-muted mb-10 max-w-md mx-auto">Learn how we can apply these operational strategies to your specific business scaling needs.</p>
            <a 
              href="mailto:info@trivianedge.com"
              className="inline-block px-10 py-5 bg-btn-bg text-btn-text rounded-2xl font-bold text-lg hover:bg-cyan-400 hover:text-white transition-all shadow-2xl shadow-surface"
            >
              Discuss Your Strategy
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPostDetail;
