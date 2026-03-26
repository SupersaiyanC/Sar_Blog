import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// Strip raw HTML from Markdown at parse time.
// Sarita's content should be pure Markdown — this prevents XSS if the CMS
// account were ever compromised and raw <script> tags injected.
marked.use({
  renderer: {
    html: () => '',
  },
});

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface Post {
  slug: string;
  title: string;
  date: string;
  featuredImage: string;
  excerpt: string;
  category: string;
  featured: boolean;
  content: string;
  gallery?: string[];
  tags?: string[];
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title,
        date: data.date,
        featuredImage: data.featuredImage,
        excerpt: data.excerpt,
        category: data.category,
        featured: data.featured || false,
        content,
        gallery: data.gallery,
        tags: data.tags,
      } as Post;
    });

  return allPostsData.sort((a, b) => {
    if (new Date(a.date) < new Date(b.date)) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostBySlug(slug: string): Promise<Post & { htmlContent: string }> {
  // Guard against path traversal — slugs must only contain safe characters
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(`Invalid post slug: ${slug}`);
  }

  const fullPath = path.join(postsDirectory, `${slug}.md`);

  // Verify the resolved path stays inside postsDirectory
  if (!path.resolve(fullPath).startsWith(path.resolve(postsDirectory))) {
    throw new Error(`Slug escapes posts directory: ${slug}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const htmlContent = await marked(content);

  return {
    slug,
    title: data.title,
    date: data.date,
    featuredImage: data.featuredImage,
    excerpt: data.excerpt,
    category: data.category,
    featured: data.featured || false,
    content,
    htmlContent,
    gallery: data.gallery,
    tags: data.tags,
  };
}

export function getPostsByCategory(category: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.category === category);
}

export function getFeaturedPosts(): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.featured);
}

export function getAllCategories(): string[] {
  const allPosts = getAllPosts();
  const categories = allPosts.map((post) => post.category);
  return Array.from(new Set(categories));
}

export function getSiteSettings() {
  const settingsPath = path.join(process.cwd(), 'content/settings/general.json');

  if (!fs.existsSync(settingsPath)) {
    return {
      title: 'Wanderlust & Whisk',
      description: 'A travel and lifestyle blog',
      author: 'Your Name',
      about: '',
      social: {}
    };
  }

  const fileContents = fs.readFileSync(settingsPath, 'utf8');
  return JSON.parse(fileContents);
}
