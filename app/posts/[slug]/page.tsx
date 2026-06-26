import { getAllPosts, getPostBySlug, getSiteSettings, minutesToISO8601, parseDurationToMinutes } from '@/lib/posts';
import { getLikeCount } from '@/lib/likes';
import Image from 'next/image';
import { format } from 'date-fns';
import Gallery from '@/components/Gallery';
import RecipeCard from '@/components/RecipeCard';
import LikeButton from '@/components/LikeButton';
import Comments from '@/components/Comments';
import Link from 'next/link';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const imageUrl = post.featuredImage?.startsWith('http')
    ? post.featuredImage
    : `https://flourandflaneuse.com${post.featuredImage}`;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://flourandflaneuse.com/posts/${slug}`,
      images: [{ url: imageUrl }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const formattedDate = format(new Date(post.date), 'MMMM dd, yyyy');
  const likeCount = await getLikeCount(post.slug);

  let recipeJsonLd: Record<string, unknown> | null = null;
  if (post.isRecipe && post.recipe) {
    const settings = getSiteSettings();
    const imageUrl = post.featuredImage?.startsWith('http')
      ? post.featuredImage
      : `https://flourandflaneuse.com${post.featuredImage}`;
    const prepMinutes = parseDurationToMinutes(post.recipe.prepTime);
    const cookMinutes = parseDurationToMinutes(post.recipe.cookTime);

    const postUrl = `https://flourandflaneuse.com/posts/${slug}`;
    recipeJsonLd = {
      '@context': 'https://schema.org/',
      '@type': 'Recipe',
      name: post.title,
      image: [imageUrl],
      author: { '@type': 'Person', name: settings.author },
      datePublished: post.date,
      description: post.excerpt,
      url: postUrl,
      ...(post.recipe.cuisine && { recipeCuisine: post.recipe.cuisine }),
      ...(post.recipe.recipeCategory && { recipeCategory: post.recipe.recipeCategory }),
      ...(post.tags?.length && { keywords: post.tags.join(', ') }),
      ...(minutesToISO8601(prepMinutes) && { prepTime: minutesToISO8601(prepMinutes) }),
      ...(minutesToISO8601(cookMinutes) && { cookTime: minutesToISO8601(cookMinutes) }),
      ...(minutesToISO8601(prepMinutes + cookMinutes) && {
        totalTime: minutesToISO8601(prepMinutes + cookMinutes),
      }),
      ...(post.recipe.servings && { recipeYield: post.recipe.servings }),
      ...(post.recipe.ingredients?.length && { recipeIngredient: post.recipe.ingredients }),
      ...(post.recipe.instructions?.length && {
        recipeInstructions: post.recipe.instructions.map((step, i) => ({
          '@type': 'HowToStep',
          name: step,
          text: step,
          url: `${postUrl}#step-${i + 1}`,
        })),
      }),
      ...(likeCount >= 1 && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5',
          ratingCount: likeCount,
        },
      }),
    };
  }

  return (
    <article>
      {recipeJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeJsonLd) }}
        />
      )}
      {/* Hero Image */}
      <div className="relative w-full h-[400px] md:h-[600px]">
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mist-900/60 to-transparent" />
      </div>

      {/* Post Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <Link
              href={`/category/${post.category.toLowerCase()}`}
              className="inline-block px-4 py-2 bg-sea-salt-400 text-white text-sm font-medium rounded-full hover:bg-sea-salt-500 transition-colors"
            >
              {post.category}
            </Link>
            {post.isRecipe && post.recipe && (
              <a
                href="#recipe"
                className="inline-block px-4 py-2 bg-alpine-sage-400 text-white text-sm font-medium rounded-full hover:bg-alpine-sage-500 transition-colors"
              >
                Jump to Recipe ↓
              </a>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl font-serif text-mist-900 mb-6">
            {post.title}
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-4 text-mist-700 mb-8 pb-8 border-b border-mist-200">
            <time className="text-lg">{formattedDate}</time>
            <LikeButton slug={post.slug} initialCount={likeCount} />
          </div>

          {/* Post Content */}
          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: post.htmlContent }}
          />

          {/* Recipe Card */}
          {post.isRecipe && post.recipe && <RecipeCard recipe={post.recipe} />}

          {/* Gallery */}
          {post.gallery && post.gallery.length > 0 && (
            <div className="mt-12">
              <h2 className="text-3xl font-serif text-mist-900 mb-6">Gallery</h2>
              <Gallery images={post.gallery} />
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-mist-200">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-mist-200 text-mist-700 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <Comments slug={post.slug} />
        </div>
      </div>

      {/* Related Posts CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Link
            href={`/category/${post.category.toLowerCase()}`}
            className="inline-block btn-primary"
          >
            More {post.category} Posts
          </Link>
        </div>
      </div>
    </article>
  );
}
