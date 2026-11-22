import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import { createBunzyApi, type BunzyEnv, type Post, type PostSummary } from './bunzyApi';

const markdown = new MarkdownIt({ html: false, linkify: true })
  .use(markdownItAttrs, { allowedAttributes: ['id'] });

const pageSize = 12;
export const DEDICATED_TEAM_GUIDE_PATH = '/blog/hire-a-dedicated-development-team-the-complete-guide';

const teamInquiryPath = `/contact?${new URLSearchParams({
  service: 'dedicated-teams',
  source: DEDICATED_TEAM_GUIDE_PATH,
})}#project-brief`;
const teamInquiryLink = `<a class="inquiry-link" href="${escapeText(teamInquiryPath)}">Get a team estimate</a>`;

export function escapeText(text: string) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function webUrl(value?: string) {
  if (!value) return '';
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? escapeText(url.href) : '';
  } catch {
    return '';
  }
}

function postPath(slug: string) {
  return `/blog/${encodeURIComponent(slug)}`;
}

function tagPath(tag: string) {
  return `/blog/tag/${encodeURIComponent(tag)}`;
}

function image(url?: string, loading = 'lazy') {
  const src = webUrl(url);
  return src ? `<img class="cover" src="${src}" alt="" loading="${loading}">` : '';
}

function byline(post: PostSummary) {
  const date = new Date(post.publishedAt);
  const published = Number.isNaN(date.valueOf()) ? '' :
    ` <span aria-hidden="true">·</span> <time datetime="${date.toISOString()}">${date.toISOString().slice(0, 10)}</time>`;
  const author = escapeText(post.author.name);
  const link = webUrl(post.author.link);
  return `<p class="byline">${link ? `<a href="${link}">${author}</a>` : author}${published}</p>`;
}

function documentResponse(title: string, body: string, options: { head?: string; lang?: string; status?: number } = {}) {
  return new Response(`<!doctype html>
<html lang="${escapeText(options.lang || 'en')}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeText(title)}</title>
<link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/bunzy-blog.css">
${options.head ?? ''}</head>
<body><a class="skip" href="#main-content">Skip to content</a>
<header class="site-header"><nav aria-label="Main navigation"><a class="brand" href="/">TrivianEdge</a><a href="/blog">Blog</a><a href="/contact">Contact</a></nav></header>
<main id="main-content">${body}</main>
</body></html>`, {
    status: options.status ?? 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function message(status: number, title: string, description: string) {
  return documentResponse(title, `<h1>${escapeText(title)}</h1><p>${escapeText(description)}</p><a href="/blog">Back to blog</a>`, { status });
}

function renderTeamGuide(source: string) {
  const env = {};
  const tokens = markdown.parse(source, env);
  const pricing = tokens.findIndex((token, index) =>
    token.type === 'heading_open' && token.tag === 'h2' && token.level === 0 &&
    tokens[index + 1]?.content === 'Engagement Models and How Pricing Typically Works',
  );
  const nextSection = tokens.findIndex((token, index) =>
    index > pricing && token.type === 'heading_open' && token.tag === 'h2' && token.level === 0,
  );

  if (pricing === -1 || nextSection === -1) return markdown.renderer.render(tokens, markdown.options, env);
  return markdown.renderer.render(tokens.slice(0, nextSection), markdown.options, env) +
    `<p class="inquiry-inline">Want an estimate for your team? ${teamInquiryLink}</p>` +
    markdown.renderer.render(tokens.slice(nextSection), markdown.options, env);
}

function renderPost(post: Post, siteOrigin: string) {
  const isTeamGuide = postPath(post.slug) === DEDICATED_TEAM_GUIDE_PATH;
  const content = isTeamGuide ? renderTeamGuide(post.markdown) : markdown.render(post.markdown);
  const title = post.seo.metaTitle || post.title;
  const description = escapeText(post.seo.metaDescription || post.excerpt);
  const canonical = escapeText(new URL(postPath(post.slug), siteOrigin).href);
  const ogImage = webUrl(post.seo.ogImage) || webUrl(post.thumbnailUrl);
  const jsonLd = JSON.stringify(post.seo.jsonLd).replaceAll('<', '\\u003c');
  const head = `<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${escapeText(title)}">
<meta property="og:description" content="${description}">
${ogImage ? `<meta property="og:image" content="${ogImage}">` : ''}
<script type="application/ld+json">${jsonLd}</script>`;
  const takeaways = post.keyTakeaways?.length
    ? `<section><h2>${escapeText(post.labels.keyTakeaways)}</h2><ul>${post.keyTakeaways.map(item => `<li>${escapeText(item)}</li>`).join('')}</ul></section>`
    : '';
  const faq = post.faq?.length
    ? `<section><h2>${escapeText(post.labels.faq)}</h2>${post.faq.map(item => `<h3>${escapeText(item.question)}</h3><p>${escapeText(item.answer)}</p>`).join('')}</section>`
    : '';

  return documentResponse(title, `<article class="article">
<a href="/blog">Back to blog</a>
<h1>${escapeText(post.title)}</h1>${byline(post)}
${image(post.thumbnailUrl, 'eager')}
<div class="prose">${content}${takeaways}${faq}</div>
${isTeamGuide ? `<section class="inquiry-panel" aria-label="Get a team estimate">
<h2>Let’s talk about the team you need</h2>
<p>Tell us what you need help with and when you’d like to get started.</p>
${teamInquiryLink}
</section>
<nav aria-label="Related resources"><h2>Related resources</h2><ul><li><a href="/services/dedicated-offshore-teams">Explore dedicated offshore teams</a></li><li><a href="/savings-calculator">Try the savings calculator</a></li></ul></nav>` : ''}
</article>`, { head, lang: post.language });
}

function renderCard(post: PostSummary) {
  return `<article class="card">${image(post.thumbnailUrl)}
<div class="card-text"><h2><a href="${escapeText(postPath(post.slug))}">${escapeText(post.title)}</a></h2>
<p>${escapeText(post.excerpt)}</p>${byline(post)}</div></article>`;
}

function decodeSegment(value: string) {
  try {
    const decoded = decodeURIComponent(value);
    return ['.', '..'].includes(decoded) || /[/\\]/.test(decoded) ? undefined : decoded;
  } catch {
    return undefined;
  }
}

export async function serveBunzyBlog(url: URL, env: BunzyEnv, siteOrigin: string) {
  const api = createBunzyApi(env);
  const segments = url.pathname.split('/').slice(2);
  const notFound = () => message(404, 'Page not found', 'This blog page could not be found.');

  try {
    if (url.pathname === '/blog/sitemap.xml') {
      const urls = new Map<string, string>();
      let page = 1;
      let totalPages: number;
      do {
        const result = await api.getPosts(page++, pageSize);
        totalPages = result.pagination.totalPages;
        for (const post of result.data) {
          const location = escapeText(new URL(postPath(post.slug), siteOrigin).href);
          const updated = new Date(post.updatedAt);
          const lastmod = Number.isNaN(updated.valueOf()) ? '' : `<lastmod>${updated.toISOString()}</lastmod>`;
          urls.set(location, `<url><loc>${location}</loc>${lastmod}</url>`);
        }
      } while (page <= totalPages);
      return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...urls.values()].join('\n')}\n</urlset>`, {
        headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'no-store' },
      });
    }

    if (segments.length === 1) {
      const slug = decodeSegment(segments[0]);
      const post = slug && await api.getPost(slug);
      return post ? renderPost(post, siteOrigin) : notFound();
    }

    const tag = segments[0] === 'tag' && segments.length === 2 ? decodeSegment(segments[1]) : undefined;
    if (segments.length && !tag) return notFound();

    const rawPage = url.searchParams.get('page') ?? '1';
    const page = Number(rawPage);
    if (!/^[1-9]\d*$/.test(rawPage) || !Number.isSafeInteger(page)) return notFound();

    const [{ data, pagination }, tags] = await Promise.all([api.getPosts(page, pageSize, tag), api.getTags()]);
    if (page > Math.max(1, pagination.totalPages)) return notFound();
    const title = tag ? `Blog · ${tag}` : 'Blog';
    const path = tag ? tagPath(tag) : '/blog';
    const pageLink = (target: number) => escapeText(target === 1 ? path : `${path}?page=${target}`);
    const filters = tags.length ? `<nav class="tags" aria-label="Filter by tag">
<a href="/blog"${tag ? '' : ' aria-current="page"'}>All posts</a>
${tags.map(item => `<a href="${escapeText(tagPath(item.tag))}"${tag === item.tag ? ' aria-current="page"' : ''}>${escapeText(item.tag)}</a>`).join('')}
</nav>` : '';
    const pages = pagination.totalPages > 1 ? `<nav class="pages" aria-label="Blog pagination">
${page > 1 ? `<a rel="prev" href="${pageLink(page - 1)}">Previous</a>` : ''}
<span>Page ${page} of ${pagination.totalPages}</span>
${page < pagination.totalPages ? `<a rel="next" href="${pageLink(page + 1)}">Next</a>` : ''}
</nav>` : '';
    const posts = data.length ? `<div class="cards">${data.map(renderCard).join('')}</div>` : '<p>No published articles found.</p>';
    return documentResponse(`${title} | TrivianEdge`, `<h1>${escapeText(title)}</h1>${filters}${posts}${pages}`);
  } catch {
    return message(502, 'Blog temporarily unavailable', 'Please try again in a moment.');
  }
}
