import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { BLOG_POSTS } from '../constants';
import BlogCard from './BlogCard';

const POSTS_PER_PAGE = 6;

const BlogView: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return BLOG_POSTS;
    return BLOG_POSTS.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPosts = filteredPosts.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // reset to first page on new search
  };

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
          <p className="text-muted text-lg max-w-2xl mb-8">Exploring the intersection of AI, global talent, and operational excellence.</p>

          {/* Search bar */}
          <div className="relative max-w-md">
            <label htmlFor="blog-search" className="sr-only">Search blog posts</label>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <input
              id="blog-search"
              type="search"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search posts..."
              className="w-full bg-surface border border-border rounded-2xl pl-11 pr-5 py-3 text-sm text-text placeholder-muted focus:outline-none focus:border-cyan-500/40 transition-all"
            />
          </div>
        </div>

        {paginatedPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {paginatedPosts.map((post, idx) => (
              <BlogCard key={post.id} post={post} onClick={handlePostClick} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted">
            <p className="text-xl">No posts found for &ldquo;{searchQuery}&rdquo;.</p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
              className="mt-4 text-cyan-400 text-sm underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav aria-label="Blog pagination" className="mt-16 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-3 rounded-full border border-border bg-surface text-muted hover:text-cyan-400 hover:border-cyan-500/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-mono text-muted">
              Page {safePage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="p-3 rounded-full border border-border bg-surface text-muted hover:text-cyan-400 hover:border-cyan-500/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
};

export default BlogView;
