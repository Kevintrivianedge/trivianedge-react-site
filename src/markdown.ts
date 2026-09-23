// Markdown for Agents: content negotiation + HTML→Markdown conversion.
// Requests carrying `Accept: text/markdown` get a Markdown rendering of the
// prerendered page (scripts/prerender.mjs) instead of the Tailwind-heavy HTML;
// browsers keep getting HTML. See
// https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/

/** True when the client prefers text/markdown over text/html (q-values honoured). */
export function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  let markdownQ = 0;
  let htmlQ = 0;
  for (const part of accept.split(',')) {
    const [type, ...params] = part.trim().toLowerCase().split(';');
    const qParam = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
    const q = qParam ? Number.parseFloat(qParam.slice(2)) : 1;
    if (Number.isNaN(q)) continue;
    if (type.trim() === 'text/markdown') markdownQ = Math.max(markdownQ, q);
    if (type.trim() === 'text/html') htmlQ = Math.max(htmlQ, q);
  }
  return markdownQ > 0 && markdownQ >= htmlQ;
}

// Chrome and non-content elements whose text is noise to an agent.
const SKIP_TAGS = new Set([
  'script', 'style', 'noscript', 'template', 'svg', 'nav', 'footer', 'header',
  'button', 'form', 'iframe', 'canvas', 'video', 'audio', 'select', 'dialog',
]);
const BLOCK_TAGS = new Set([
  'p', 'div', 'section', 'article', 'aside', 'figure', 'figcaption', 'dl', 'dt', 'dd',
  'ul', 'ol', 'table',
]);

// Void elements have no end tag, so onEndTag() must not be registered on them.
const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr',
]);

const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–',
  hellip: '…', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', copy: '©', reg: '®', trade: '™',
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? Number.parseInt(code.slice(2), 16) : Number.parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : match;
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

/**
 * Convert a prerendered HTML page to Markdown. Only the <main> landmark is
 * rendered (nav/footer chrome is dropped); title and meta description go into
 * YAML front matter.
 */
export async function htmlToMarkdown(response: Response, pageUrl: string): Promise<string> {
  const out: string[] = [];
  let title = '';
  let description = '';
  let inTitle = false;
  let mainDepth = 0;
  let skipDepth = 0;
  let preDepth = 0;
  const listStack: { ordered: boolean; index: number }[] = [];
  const tableRows: number[] = []; // row count per open table
  let rowCells = 0;

  const active = () => mainDepth > 0 && skipDepth === 0;
  const emit = (s: string) => { if (active()) out.push(s); };
  const absolute = (href: string) => {
    try { return new URL(href, pageUrl).toString(); } catch { return href; }
  };

  const rewriter = new HTMLRewriter()
    .on('title', {
      element(el) { inTitle = true; el.onEndTag(() => { inTitle = false; }); },
    })
    .on('meta[name="description"]', {
      element(el) { description = decodeEntities(el.getAttribute('content') ?? ''); },
    })
    .on('main', {
      element(el) { mainDepth++; el.onEndTag(() => { mainDepth--; }); },
    })
    .on('*', {
      element(el) {
        const tag = el.tagName.toLowerCase();
        const hasEndTag = !VOID_TAGS.has(tag);
        const hidden = el.getAttribute('aria-hidden') === 'true' || el.hasAttribute('hidden');
        if (SKIP_TAGS.has(tag) || hidden) {
          if (hasEndTag) { skipDepth++; el.onEndTag(() => { skipDepth--; }); }
          return;
        }
        if (!active()) return;

        const onEnd = (s: string) => { if (hasEndTag) el.onEndTag(() => emit(s)); };
        const heading = /^h([1-6])$/.exec(tag);
        if (heading) {
          emit(`\n\n${'#'.repeat(Number(heading[1]))} `);
          onEnd('\n\n');
        } else if (tag === 'ul' || tag === 'ol') {
          listStack.push({ ordered: tag === 'ol', index: 0 });
          emit('\n\n');
          el.onEndTag(() => { listStack.pop(); emit('\n\n'); });
        } else if (tag === 'li') {
          const list = listStack[listStack.length - 1];
          const indent = '  '.repeat(Math.max(0, listStack.length - 1));
          emit(`\n${indent}${list?.ordered ? `${++list.index}.` : '-'} `);
        } else if (tag === 'table') {
          tableRows.push(0);
          emit('\n\n');
          el.onEndTag(() => { tableRows.pop(); emit('\n\n'); });
        } else if (tag === 'tr') {
          rowCells = 0;
          emit('\n|');
          el.onEndTag(() => {
            const i = tableRows.length - 1;
            if (i >= 0 && tableRows[i]++ === 0) emit(`\n|${' --- |'.repeat(Math.max(rowCells, 1))}`);
          });
        } else if (tag === 'td' || tag === 'th') {
          rowCells++;
          emit(' ');
          onEnd(' |');
        } else if (BLOCK_TAGS.has(tag)) {
          emit('\n\n');
          onEnd('\n\n');
        } else if (tag === 'blockquote') {
          emit('\n\n> ');
          onEnd('\n\n');
        } else if (tag === 'pre') {
          preDepth++;
          emit('\n\n```\n');
          el.onEndTag(() => { preDepth--; emit('\n```\n\n'); });
        } else if (tag === 'code' && preDepth === 0) {
          emit('`');
          onEnd('`');
        } else if (tag === 'strong' || tag === 'b') {
          emit('**');
          onEnd('**');
        } else if (tag === 'em') {
          emit('_');
          onEnd('_');
        } else if (tag === 'br') {
          emit('\n');
        } else if (tag === 'hr') {
          emit('\n\n---\n\n');
        } else if (tag === 'a') {
          const href = el.getAttribute('href');
          if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
            emit('[');
            onEnd(`](${absolute(href)})`);
          }
        } else if (tag === 'img') {
          const alt = el.getAttribute('alt')?.trim();
          const src = el.getAttribute('src');
          if (alt && src) emit(`![${decodeEntities(alt)}](${absolute(src)})`);
        }
      },
    })
    .onDocument({
      text(chunk) {
        if (inTitle) { title += chunk.text; return; }
        if (!active()) return;
        const text = decodeEntities(chunk.text);
        emit(preDepth > 0 ? text : text.replace(/\s+/g, ' '));
      },
    });

  await rewriter.transform(response).arrayBuffer();

  const body = out.join('')
    .replace(/\[\s*\]\([^)]*\)/g, '') // links with no text (icon-only)
    .replace(/\*\*\s*\*\*|__|``/g, '') // empty emphasis/code
    .replace(/\)\[/g, ') [')
    .replace(/\[\s+/g, '[').replace(/\s+\]\(/g, '](')
    .split('\n').map((line) => (/^\s+(-|\d+\.) /.test(line) ? line : line.trimStart()).trimEnd()).join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const yaml = (s: string) => JSON.stringify(decodeEntities(s).trim());
  const frontMatter = ['---', `title: ${yaml(title)}`];
  if (description) frontMatter.push(`description: ${yaml(description)}`);
  frontMatter.push(`url: ${pageUrl}`, '---');
  return `${frontMatter.join('\n')}\n\n${body}\n`;
}

/**
 * Wrap an HTML page response: returns Markdown when the request negotiated it,
 * otherwise the original response. Either way adds `Vary: Accept` so shared
 * caches keep the two representations apart.
 */
export async function negotiateMarkdown(request: Request, response: Response): Promise<Response> {
  const isHtml = (response.headers.get('Content-Type') ?? '').includes('text/html');
  if (!isHtml) return response;

  const headers = new Headers(response.headers);
  headers.append('Vary', 'Accept');
  if (!prefersMarkdown(request.headers.get('Accept')) || (request.method !== 'GET' && request.method !== 'HEAD')) {
    return new Response(response.body, { status: response.status, headers });
  }

  const url = new URL(request.url);
  const markdown = await htmlToMarkdown(response, `${url.origin}${url.pathname}`);
  headers.set('Content-Type', 'text/markdown; charset=utf-8');
  // Rough token estimate (~4 chars/token), matching Cloudflare's header.
  headers.set('x-markdown-tokens', String(Math.ceil(markdown.length / 4)));
  headers.delete('Content-Length');
  headers.delete('Content-Security-Policy');
  headers.delete('ETag');
  return new Response(request.method === 'HEAD' ? null : markdown, { status: response.status, headers });
}
