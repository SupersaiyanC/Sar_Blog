import { getSiteSettings } from '@/lib/posts';
import { marked } from 'marked';

export default function About() {
  const settings = getSiteSettings();
  const aboutHtml = marked(settings.about || '');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <h1 className="text-4xl md:text-6xl font-serif text-sand-900 mb-8 text-center">
        About
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <div
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: aboutHtml }}
        />

        {settings.social && (
          <div className="mt-12 pt-8 border-t border-sand-200">
            <h2 className="text-2xl font-serif text-sand-900 mb-6">Connect With Me</h2>
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
                  className="bg-sand-600 hover:bg-sand-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
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
