import Image from 'next/image';
import Link from 'next/link';
import { getAllPosts, getFeaturedPosts, getSiteSettings } from '@/lib/posts';
import PostCard from '@/components/PostCard';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function Home() {
  const settings = getSiteSettings();
  const featuredPosts = getFeaturedPosts();
  const allPosts = getAllPosts();
  const recentPosts = allPosts.slice(0, 6);
  const homeAbout = settings.homeAbout || settings.aboutPage || '';

  return (
    <>
      {/* Hero Section — soft mist/sea-salt gradient with emblem */}
      <section className="bg-gradient-to-br from-mist-100 via-cream to-sea-salt-50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/emblem.png"
              alt="Flour & Flâneuse emblem"
              width={160}
              height={160}
              className="h-32 w-auto object-contain md:h-40"
              priority
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-mist-900 mb-6">
            {settings.title}
          </h1>
          <p className="text-xl md:text-2xl text-mist-700 max-w-3xl mx-auto leading-relaxed">
            {settings.description}
          </p>
        </div>
      </section>

      {/* About Snippet */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="shrink-0">
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden ring-4 ring-mist-200">
                {settings.profileImage ? (
                  <Image
                    src={settings.profileImage}
                    alt={settings.author || 'Sarita'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-mist-100 to-sea-salt-100 flex items-center justify-center">
                    <Image
                      src="/emblem.png"
                      alt=""
                      width={100}
                      height={100}
                      className="object-contain opacity-50"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="text-center md:text-left">
              <span className="text-sea-salt-500 text-sm font-medium uppercase tracking-widest mb-2 block">
                About Me
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-mist-900 mb-4">
                Hi, I&apos;m Sarita
              </h2>
              {homeAbout && (
                <p className="text-mist-700 text-lg leading-relaxed mb-6">
                  {homeAbout}
                </p>
              )}
              <Link
                href="/about"
                className="text-sea-salt-600 hover:text-terracotta-warm font-medium transition-colors"
              >
                Read more about me →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h2 className="text-3xl md:text-4xl font-serif text-mist-900 mb-10">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-serif text-mist-900 mb-10">
          Recent Posts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* CTA Section */}
      <section className="bg-sea-salt-400 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-serif mb-6">
            Join Me On This Journey
          </h2>
          <p className="text-lg md:text-xl text-mist-50 mb-8 leading-relaxed">
            Follow along for travel inspiration, delicious recipes, and stories from around the world.
          </p>
          {settings.social?.instagram && (
            <a
              href={`https://instagram.com/${settings.social.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-sea-salt-700 px-8 py-4 rounded-full font-medium hover:bg-mist-50 transition-colors shadow-lg"
            >
              Follow on Instagram
            </a>
          )}
        </div>
      </section>
    </>
  );
}
