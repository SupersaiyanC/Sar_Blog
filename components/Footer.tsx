import { getSiteSettings } from '@/lib/posts';

export default function Footer() {
  const settings = getSiteSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sage-800 text-sand-50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif mb-4">{settings.title}</h3>
            <p className="text-sand-200 text-sm leading-relaxed">
              {settings.description}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-serif mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sand-200">
              <li>
                <a href="/" className="hover:text-terracotta-300 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/category/travel" className="hover:text-terracotta-300 transition-colors">
                  Travel
                </a>
              </li>
              <li>
                <a href="/category/baking" className="hover:text-terracotta-300 transition-colors">
                  Baking
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-terracotta-300 transition-colors">
                  About
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif mb-4">Connect</h4>
            <div className="space-y-2 text-sand-200">
              {settings.social?.instagram && (
                <div>
                  <a
                    href={`https://instagram.com/${settings.social.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-terracotta-300 transition-colors"
                  >
                    Instagram
                  </a>
                </div>
              )}
              {settings.social?.pinterest && (
                <div>
                  <a
                    href={`https://pinterest.com/${settings.social.pinterest}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-terracotta-300 transition-colors"
                  >
                    Pinterest
                  </a>
                </div>
              )}
              {settings.social?.email && (
                <div>
                  <a
                    href={`mailto:${settings.social.email}`}
                    className="hover:text-terracotta-300 transition-colors"
                  >
                    Email
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-sage-700 mt-8 pt-8 text-center text-sand-300 text-sm">
          <p>© {currentYear} {settings.title}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
