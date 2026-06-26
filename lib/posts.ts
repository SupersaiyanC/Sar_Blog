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

// Normalize a filename into a URL-safe ASCII slug.
// Strips diacritics (â → a, é → e) so accented filenames from the CMS still
// produce valid, linkable URLs.
function normalizeSlug(fileName: string): string {
  return fileName
    .replace(/\.md$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip combining diacritical marks
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')    // replace remaining non-ASCII with hyphens
    .replace(/-+/g, '-')             // collapse consecutive hyphens
    .replace(/^-|-$/g, '');          // trim leading/trailing hyphens
}

export interface RecipeData {
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  ingredients?: string[];
  instructions?: string[];
  cuisine?: string;
  recipeCategory?: string;
}

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
  isRecipe?: boolean;
  recipe?: RecipeData;
}

// Parses friendly time strings ("20 mins", "1 hour 30 min") into a total
// number of minutes, for Recipe JSON-LD. Returns 0 if no recognizable
// hours/minutes value is found.
export function parseDurationToMinutes(input?: string): number {
  if (!input) return 0;

  const hoursMatch = input.match(/(\d+)\s*(?:hours?|hrs?|h\b)/i);
  const minutesMatch = input.match(/(\d+)\s*(?:minutes?|mins?|m\b)/i);

  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

  return hours * 60 + minutes;
}

// Converts a total number of minutes into an ISO-8601 duration ("PT1H30M")
// for Recipe JSON-LD. Returns undefined for 0 so we never emit invalid markup.
export function minutesToISO8601(totalMinutes: number): string | undefined {
  if (totalMinutes <= 0) return undefined;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let result = 'PT';
  if (hours > 0) result += `${hours}H`;
  if (minutes > 0) result += `${minutes}M`;
  return result;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = normalizeSlug(fileName);
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
        isRecipe: data.isRecipe || false,
        recipe: data.recipe,
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

  // Find the actual file whose normalized slug matches — handles accented filenames from the CMS
  const fileNames = fs.readdirSync(postsDirectory);
  const matchingFile = fileNames.find(
    (fileName) => fileName.endsWith('.md') && normalizeSlug(fileName) === slug
  );

  if (!matchingFile) {
    throw new Error(`Post not found: ${slug}`);
  }

  const fullPath = path.join(postsDirectory, matchingFile);

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
    isRecipe: data.isRecipe || false,
    recipe: data.recipe,
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
      homeAbout: '',
      aboutPage: '',
      profileImage: '',
      aboutPageImage: '',
      social: {}
    };
  }

  const fileContents = fs.readFileSync(settingsPath, 'utf8');
  const parsed = JSON.parse(fileContents);

  return {
    ...parsed,
    homeAbout: parsed.homeAbout ?? parsed.about ?? '',
    aboutPage: parsed.aboutPage ?? parsed.about ?? '',
    profileImage: parsed.profileImage ?? '',
    aboutPageImage: parsed.aboutPageImage ?? '',
  };
}
