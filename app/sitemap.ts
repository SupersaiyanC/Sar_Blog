import { MetadataRoute } from 'next';
import { getAllPosts, getAllCategories } from '@/lib/posts';

export const dynamic = 'force-static';

const BASE_URL = 'https://flourandflaneuse.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const categories = getAllCategories();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/category/${category.toLowerCase()}/`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [
    { url: `${BASE_URL}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/about/`, changeFrequency: 'monthly', priority: 0.7 },
    ...categoryEntries,
    ...postEntries,
  ];
}
