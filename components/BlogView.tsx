import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { BLOG_POSTS } from '../constants';
import BlogCard from './BlogCard';

const BlogView: React.FC = () => {
  const navigate = useNavigate();

  const handlePostClick = (id: string) => {
    const post = BLOG_POSTS.find(p => p.id === id);
    if (post?.slug) {
      navigate(`/blog/${post.slug}`);
    } else {
      navigate(`/blog/${id}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="blog-list" aria-label="Blog Posts" className="py-16 md:py-32 px-4 md:px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 reveal">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-surface backdrop-blur-md text-[10px] font-bold tracking-[0.2em] uppercase mb-8 text-text">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Intel & Insights
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-text">Insights from the <br className="hidden md:block" /> <span className="text-gradient">Edge of Intelligence.</span></h2>
          <p className="text-muted text-lg max-w-2xl">Exploring the intersection of AI, global talent, and operational excellence.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {BLOG_POSTS.map((post, idx) => (
            <BlogCard key={post.id} post={post} onClick={handlePostClick} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogView;
