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
        <article className="card relative overflow-hidden h-[520px] md:h-[620px]">
          <div className="absolute inset-0">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-mist-900/90 via-mist-900/40 to-transparent" />
          </div>

          <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
            <div className="mb-4">
              <span className="inline-block px-4 py-1 bg-sea-salt-400 text-white text-sm font-medium rounded-full">
                {post.category}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-4 group-hover:text-sea-salt-200 transition-colors">
              {post.title}
            </h2>
            <p className="text-mist-100 text-lg mb-4 line-clamp-2">
              {post.excerpt}
            </p>
            <time className="text-mist-300 text-sm">{formattedDate}</time>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/posts/${post.slug}`} className="group">
      <article className="card">
        <div className="relative h-80 overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="p-6">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-mist-200 text-mist-700 text-xs font-medium rounded-full">
              {post.category}
            </span>
          </div>

          <h3 className="text-2xl font-serif text-mist-900 mb-3 group-hover:text-terracotta-warm transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-mist-700 mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <time className="text-mist-500 text-sm">{formattedDate}</time>
            <span className="text-sea-salt-600 text-sm font-medium group-hover:text-terracotta-warm transition-colors">
              Read More →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
