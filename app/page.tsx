import { getAllPosts, getFeaturedPosts, getSiteSettings } from '@/lib/posts';
import PostCard from '@/components/PostCard';

export default function Home() {
  const settings = getSiteSettings();
  const featuredPosts = getFeaturedPosts();
  const allPosts = getAllPosts();
  const recentPosts = allPosts.slice(0, 6);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-sand-100 to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-serif text-sand-900 mb-6">
            {settings.title}
          </h1>
          <p className="text-xl md:text-2xl text-sand-600 max-w-3xl mx-auto leading-relaxed">
            {settings.description}
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h2 className="text-3xl md:text-4xl font-serif text-sand-900 mb-8">
            Featured Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredPosts.slice(0, 2).map((post) => (
              <PostCard key={post.slug} post={post} featured />
            ))}
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-serif text-sand-900 mb-8">
          Recent Posts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-terracotta-500 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-serif mb-6">
            Join Me On This Journey
          </h2>
          <p className="text-lg md:text-xl text-terracotta-50 mb-8 leading-relaxed">
            Follow along for travel inspiration, delicious recipes, and stories from around the world.
          </p>
          {settings.social?.instagram && (
            <a
              href={`https://instagram.com/${settings.social.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-terracotta-600 px-8 py-4 rounded-full font-medium hover:bg-sand-50 transition-colors shadow-lg"
            >
              Follow on Instagram
            </a>
          )}
        </div>
      </section>
    </>
  );
}
