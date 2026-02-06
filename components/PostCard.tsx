import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/posts';
import { format } from 'date-fns';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const formattedDate = format(new Date(post.date), 'MMMM dd, yyyy');

  if (featured) {
    return (
      <Link href={`/posts/${post.slug}`} className="group">
        <article className="card relative overflow-hidden h-[500px] md:h-[600px]">
          <div className="absolute inset-0">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sand-900/90 via-sand-900/40 to-transparent" />
          </div>

          <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
            <div className="mb-4">
              <span className="inline-block px-4 py-1 bg-terracotta-500 text-white text-sm font-medium rounded-full">
                {post.category}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-4 group-hover:text-terracotta-200 transition-colors">
              {post.title}
            </h2>
            <p className="text-sand-100 text-lg mb-4 line-clamp-2">
              {post.excerpt}
            </p>
            <time className="text-sand-300 text-sm">{formattedDate}</time>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/posts/${post.slug}`} className="group">
      <article className="card">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="p-6">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-sand-200 text-sand-700 text-xs font-medium rounded-full">
              {post.category}
            </span>
          </div>

          <h3 className="text-2xl font-serif text-sand-900 mb-3 group-hover:text-terracotta-600 transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-sand-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <time className="text-sand-500 text-sm">{formattedDate}</time>
            <span className="text-terracotta-600 text-sm font-medium group-hover:underline">
              Read More →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
