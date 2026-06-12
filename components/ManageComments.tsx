'use client';

import { useEffect, useState } from 'react';

interface Comment {
  id: string;
  name: string;
  message: string;
  date: string;
  isAdmin?: boolean;
}

interface NetlifyUser {
  email?: string;
  jwt: (forceRefresh?: boolean) => Promise<string>;
}

declare global {
  interface Window {
    netlifyIdentity?: {
      currentUser: () => NetlifyUser | null;
      open: (tab?: 'login' | 'signup') => void;
      on: (event: string, callback: (user?: NetlifyUser) => void) => void;
      logout: () => void;
    };
  }
}

export default function ManageComments() {
  // undefined = still checking, null = logged out
  const [user, setUser] = useState<NetlifyUser | null | undefined>(undefined);
  const [commentsBySlug, setCommentsBySlug] = useState<Record<string, Comment[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, { name: string; message: string }>>({});

  useEffect(() => {
    function attach() {
      const identity = window.netlifyIdentity;
      if (!identity) return false;
      setUser(identity.currentUser());
      identity.on('login', (loggedInUser) => setUser(loggedInUser ?? null));
      identity.on('logout', () => setUser(null));
      return true;
    }

    if (!attach()) {
      const interval = setInterval(() => {
        if (attach()) clearInterval(interval);
      }, 200);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    async function loadComments() {
      setLoading(true);
      setError('');
      try {
        const token = await user!.jwt();
        const res = await fetch('/api/comments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setCommentsBySlug(data.comments || {});
        } else {
          setError(data.error || 'Failed to load comments');
        }
      } catch {
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    }

    loadComments();
  }, [user]);

  async function handleDelete(slug: string, commentId: string) {
    if (!user) return;
    if (!confirm('Delete this comment? This cannot be undone.')) return;

    try {
      const token = await user.jwt();
      const res = await fetch('/api/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slug, commentId }),
      });
      const data = await res.json();
      if (res.ok) {
        setCommentsBySlug((prev) => ({ ...prev, [slug]: data.comments }));
      }
    } catch {
      setError('Failed to delete comment');
    }
  }

  async function handleReply(slug: string) {
    if (!user) return;
    const draft = replyDrafts[slug];
    if (!draft?.message?.trim()) return;

    try {
      const token = await user.jwt();
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          slug,
          name: draft.name?.trim() || 'Sarita',
          message: draft.message.trim(),
          isAdminReply: true,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCommentsBySlug((prev) => ({ ...prev, [slug]: data.comments }));
        setReplyDrafts((prev) => ({ ...prev, [slug]: { name: draft.name || '', message: '' } }));
      }
    } catch {
      setError('Failed to post reply');
    }
  }

  if (user === undefined) {
    return <p className="text-mist-600 text-center py-12">Checking login status…</p>;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-mist-600 mb-4">Log in with your admin account to manage comments.</p>
        <button onClick={() => window.netlifyIdentity?.open('login')} className="btn-primary">
          Log In
        </button>
      </div>
    );
  }

  const slugs = Object.keys(commentsBySlug).filter((slug) => (commentsBySlug[slug]?.length ?? 0) > 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <p className="text-mist-600 text-sm">Logged in as {user.email}</p>
        <button
          onClick={() => window.netlifyIdentity?.logout()}
          className="text-sea-salt-600 text-sm hover:underline"
        >
          Log Out
        </button>
      </div>

      {loading && <p className="text-mist-600">Loading comments…</p>}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {!loading && slugs.length === 0 && <p className="text-mist-600">No comments yet.</p>}

      <div className="space-y-10">
        {slugs.map((slug) => (
          <div key={slug}>
            <h2 className="text-xl font-serif text-mist-900 mb-3">
              <a
                href={`/posts/${slug}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sea-salt-600 underline"
              >
                {slug}
              </a>
            </h2>

            <ul className="space-y-3">
              {commentsBySlug[slug].map((comment) => (
                <li
                  key={comment.id}
                  className={`rounded-xl p-4 ${
                    comment.isAdmin ? 'bg-sea-salt-50 border border-sea-salt-200' : 'bg-mist-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-mist-900">{comment.name}</span>
                      {comment.isAdmin && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-sea-salt-400 text-white">
                          Author reply
                        </span>
                      )}
                      <span className="text-mist-500 text-sm">
                        {new Date(comment.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(slug, comment.id)}
                      className="text-red-500 text-sm hover:underline shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-mist-700 whitespace-pre-wrap">{comment.message}</p>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Your name (e.g. Sarita)"
                value={replyDrafts[slug]?.name || ''}
                onChange={(e) =>
                  setReplyDrafts((prev) => ({
                    ...prev,
                    [slug]: { name: e.target.value, message: prev[slug]?.message || '' },
                  }))
                }
                className="px-3 py-2 rounded-lg border border-mist-200 text-sm focus:outline-none focus:border-sea-salt-400 focus:ring-2 focus:ring-sea-salt-100"
              />
              <input
                type="text"
                placeholder="Reply to this comment..."
                value={replyDrafts[slug]?.message || ''}
                onChange={(e) =>
                  setReplyDrafts((prev) => ({
                    ...prev,
                    [slug]: { name: prev[slug]?.name || '', message: e.target.value },
                  }))
                }
                className="flex-1 px-3 py-2 rounded-lg border border-mist-200 text-sm focus:outline-none focus:border-sea-salt-400 focus:ring-2 focus:ring-sea-salt-100"
              />
              <button
                onClick={() => handleReply(slug)}
                className="px-5 py-2 rounded-full text-sm font-medium bg-alpine-sage-400 hover:bg-alpine-sage-500 text-white transition-colors shrink-0"
              >
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
