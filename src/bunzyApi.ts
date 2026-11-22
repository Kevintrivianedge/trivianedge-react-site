export interface BunzyEnv {
  BUNZY_BLOG_API_KEY?: string;
  BUNZY_BLOG_API_URL?: string;
}

interface Author {
  name: string;
  avatarUrl?: string;
  link?: string;
}

export interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  readingMinutes: number;
  thumbnailUrl?: string;
  author: Author;
  publishedAt: string;
  updatedAt: string;
}

export interface Post extends PostSummary {
  markdown: string;
  language: string;
  keyTakeaways: string[];
  faq: { question: string; answer: string }[];
  labels: { keyTakeaways: string; faq: string };
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    ogImage?: string;
    focusKeyword?: string;
    jsonLd: Record<string, unknown>;
  };
}

interface PostPage {
  data: PostSummary[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

interface Tag {
  tag: string;
  count: number;
}

export function createBunzyApi(env: BunzyEnv) {
  const origin = env.BUNZY_BLOG_API_URL ?? 'https://app.bunzy.io';

  async function request(path: string) {
    return fetch(new URL(`/api/v1/${path}`, origin), {
      headers: {
        Authorization: `Bearer ${env.BUNZY_BLOG_API_KEY}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(10_000),
    });
  }

  async function readJson<T>(response: Response): Promise<T> {
    if (!response.ok) throw new Error(`Bunzy returned HTTP ${response.status}`);
    return await response.json() as T;
  }

  return {
    async getPosts(page: number, limit: number, tag?: string) {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (tag) params.set('tag', tag);
      return readJson<PostPage>(await request(`posts?${params}`));
    },
    async getPost(slug: string) {
      const response = await request(`posts/${encodeURIComponent(slug)}`);
      if (response.status === 404) return undefined;
      return readJson<Post>(response);
    },
    async getTags() {
      return readJson<Tag[]>(await request('tags'));
    },
  };
}
