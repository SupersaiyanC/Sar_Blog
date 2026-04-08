import type { Metadata } from 'next';
import Image from 'next/image';
import { getSiteSettings } from '@/lib/posts';
import { marked } from 'marked';

export function generateMetadata(): Metadata {
  const settings = getSiteSettings();
  const description = settings.homeAbout || settings.aboutPage || settings.description || '';
  const imageUrl = settings.aboutPageImage?.startsWith('http')
    ? settings.aboutPageImage
    : settings.aboutPageImage
    ? `https://flourandflaneuse.com${settings.aboutPageImage}`
    : 'https://flourandflaneuse.com/emblem.png';

  return {
    title: 'About',
    description,
    openGraph: {
      title: `About | ${settings.title}`,
      description,
      url: 'https://flourandflaneuse.com/about',
      images: [{ url: imageUrl }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `About | ${settings.title}`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function About() {
  const settings = getSiteSettings();
  const aboutHtml = await marked(settings.aboutPage || settings.homeAbout || '');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <h1 className="text-4xl md:text-6xl font-serif text-mist-900 mb-8 text-center">
        About
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        {settings.aboutPageImage && (
          <div className="relative mb-8 h-72 overflow-hidden rounded-2xl md:mb-10 md:h-96">
            <Image
              src={settings.aboutPageImage}
              alt={settings.author ? `${settings.author} on the About page` : 'About page image'}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: aboutHtml }}
        />

        {settings.social && (
          <div className="mt-12 pt-8 border-t border-mist-200">
            <h2 className="text-2xl font-serif text-mist-900 mb-6">Connect With Me</h2>
            <div className="flex flex-wrap gap-4">
              {settings.social.instagram && (
                <a
                  href={`https://instagram.com/${settings.social.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Instagram
                </a>
              )}
              {settings.social.pinterest && (
                <a
                  href={`https://pinterest.com/${settings.social.pinterest}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Pinterest
                </a>
              )}
              {settings.social.email && (
                <a
                  href={`mailto:${settings.social.email}`}
                  className="bg-mist-600 hover:bg-mist-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
                >
                  Email Me
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
