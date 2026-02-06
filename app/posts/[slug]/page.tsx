import { getAllPosts, getPostBySlug } from '@/lib/posts';
import Image from 'next/image';
import { format } from 'date-fns';
import Gallery from '@/components/Gallery';
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
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const formattedDate = format(new Date(post.date), 'MMMM dd, yyyy');

  return (
    <article>
      {/* Hero Image */}
      <div className="relative w-full h-[400px] md:h-[600px]">
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sand-900/60 to-transparent" />
      </div>

      {/* Post Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="mb-6">
            <Link
              href={`/category/${post.category.toLowerCase()}`}
              className="inline-block px-4 py-2 bg-terracotta-500 text-white text-sm font-medium rounded-full hover:bg-terracotta-600 transition-colors"
            >
              {post.category}
            </Link>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif text-sand-900 mb-6">
            {post.title}
          </h1>

          <div className="flex items-center text-sand-600 mb-8 pb-8 border-b border-sand-200">
            <time className="text-lg">{formattedDate}</time>
          </div>

          {/* Post Content */}
          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: post.htmlContent }}
          />

          {/* Gallery */}
          {post.gallery && post.gallery.length > 0 && (
            <div className="mt-12">
              <h2 className="text-3xl font-serif text-sand-900 mb-6">Gallery</h2>
              <Gallery images={post.gallery} />
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-sand-200">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-sand-200 text-sand-700 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
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
