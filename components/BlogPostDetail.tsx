import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BLOG_POSTS } from '../constants';
import SEOHead from './SEOHead';
import BlogMeta from './BlogMeta';
import { articleSchema, breadcrumbSchema, faqSchema, SEO_CONFIG } from '../utils/seo';
import { calculateReadingTime } from '../utils/readingTime';

// Lightweight markdown renderer: ## headings, "- " bullet lists, **bold**,
// *italic* and [links](url). Internal links (starting with "/") use the router.
function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g).map((tok, ti) => {
    if (tok.startsWith('**') && tok.endsWith('**')) {
      return <strong key={ti} className="text-text font-bold">{tok.slice(2, -2)}</strong>;
    }
    if (tok.startsWith('*') && tok.endsWith('*')) {
      return <em key={ti}>{tok.slice(1, -1)}</em>;
    }
    const linkMatch = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const cls = 'text-cyan-700 dark:text-cyan-400 underline hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors';
      return linkMatch[2].startsWith('/') ? (
        <Link key={ti} to={linkMatch[2]} className={cls}>{linkMatch[1]}</Link>
      ) : (
        <a key={ti} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className={cls}>{linkMatch[1]}</a>
      );
    }
    return tok;
  });
}

function renderMarkdown(text: string): React.ReactNode[] {
  return text.split('\n\n').map((para, pi) => {
    if (para.startsWith('## ')) {
      return <h2 key={pi} className="text-2xl md:text-3xl font-bold text-text pt-6">{para.slice(3)}</h2>;
    }
    if (para.startsWith('# ')) {
      return <h2 key={pi} className="text-3xl font-bold text-text pt-6">{para.slice(2)}</h2>;
    }
    if (para.startsWith('- ')) {
      return (
        <ul key={pi} className="list-disc pl-6 space-y-2 marker:text-cyan-700 dark:marker:text-cyan-400">
          {para.split('\n').map((li, i) => <li key={i}>{renderInline(li.replace(/^- /, ''))}</li>)}
        </ul>
      );
    }
    return <p key={pi}>{renderInline(para)}</p>;
  });
}

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
            <span className="text-xs font-bold uppercase tracking-widest">Back to the blog</span>
          </button>
        </div>
      </div>
    );
  }

  const postUrl = `${SEO_CONFIG.siteUrl}/blog/${post.slug ?? post.id}`;

  return (
    <>
      <SEOHead
        title={post.metaTitle ?? post.title}
        description={(post as any).metaDescription ?? post.excerpt}
        keywords={(post as any).metaKeywords?.join(', ')}
        ogType="article"
        ogImage={(post as any).imageUrl ?? SEO_CONFIG.defaultOgImage}
        schema={[
          articleSchema({
            title: post.title,
            description: (post as any).metaDescription ?? post.excerpt,
            url: postUrl,
            datePublished: (post as any).datePublished ?? post.date,
            dateModified: (post as any).dateModified ?? (post as any).datePublished ?? post.date,
            author: post.author,
            image: (post as any).imageUrl,
          }),
          breadcrumbSchema([
            { name: 'Home', url: SEO_CONFIG.siteUrl },
            { name: 'Blog', url: `${SEO_CONFIG.siteUrl}/blog` },
            { name: post.title, url: postUrl },
          ]),
          ...(post.faqs?.length ? [faqSchema(post.faqs)] : []),
        ]}
      />
    <article aria-label={post.title} className="py-16 md:py-32 px-4 md:px-6 min-h-screen relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-500/5 to-transparent -z-10" />
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => { navigate('/blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-2 text-muted hover:text-cyan-400 transition-colors mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to the blog</span>
        </button>

        <BlogMeta
          date={post.date}
          readTime={post.readTime}
          author={post.author}
          category={post.category}
          datePublished={post.datePublished}
        />

        <div className="reveal">
          <h1 className="text-4xl md:text-6xl font-bold mb-12 mt-12 leading-tight text-text">{post.title}</h1>

          <div className="text-muted leading-relaxed space-y-6 text-xl">
            {renderMarkdown(post.content)}
          </div>

          {post.faqs?.length ? (
            <section aria-labelledby="post-faq" className="mt-20 border-t border-border pt-12">
              <h2 id="post-faq" className="text-2xl md:text-3xl font-bold text-text mb-8">Frequently asked questions</h2>
              <div className="space-y-8">
                {post.faqs.map(f => (
                  <div key={f.question}>
                    <h3 className="text-lg md:text-xl font-semibold text-text mb-2">{f.question}</h3>
                    <p className="text-muted leading-relaxed text-lg">{f.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <div className="mt-24 p-12 glass border-border rounded-[3rem] text-center">
            <h3 className="text-2xl font-bold mb-6 text-text">Want the same kind of operating clarity?</h3>
            <p className="text-muted mb-10 max-w-md mx-auto">Tell us what you are trying to build and we will show you the simplest path to get there.</p>
            <a 
              href="mailto:kevin.v@trivianedge.com"
              className="inline-block px-10 py-5 rounded-2xl font-bold text-lg premium-button"
            >
              Discuss your strategy
            </a>
          </div>
        </div>
      </div>
    </article>
    </>
  );
};

export default BlogPostDetail;
