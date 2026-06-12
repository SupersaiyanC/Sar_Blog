'use client';

import { useEffect, useState } from 'react';

interface Comment {
  id: string;
  name: string;
  message: string;
  date: string;
  isAdmin?: boolean;
}

export default function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch(`/api/comments?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => setComments(data.comments || []))
      .catch(() => {});
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name, message, website }),
      });
      const data = await res.json();

      if (res.ok) {
        setComments(data.comments || []);
        setMessage('');
        setStatus('idle');
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="mt-12 pt-8 border-t border-mist-200">
      <h2 className="text-3xl font-serif text-mist-900 mb-6">Comments & Notes</h2>

      {comments.length === 0 ? (
        <p className="text-mist-600 mb-8">Be the first to leave a note!</p>
      ) : (
        <ul className="space-y-4 mb-8">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className={`rounded-xl p-4 ${
                comment.isAdmin ? 'bg-sea-salt-50 border border-sea-salt-200' : 'bg-mist-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 flex-wrap">
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
              <p className="text-mist-700 whitespace-pre-wrap">{comment.message}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          maxLength={60}
          className="w-full px-4 py-2 rounded-lg border border-mist-200 text-mist-900 placeholder-mist-400 focus:outline-none focus:border-sea-salt-400 focus:ring-2 focus:ring-sea-salt-100 text-sm transition-colors"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Leave a comment, question, or note..."
          required
          maxLength={1000}
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-mist-200 text-mist-900 placeholder-mist-400 focus:outline-none focus:border-sea-salt-400 focus:ring-2 focus:ring-sea-salt-100 text-sm transition-colors"
        />
        {/* Honeypot field — hidden from real visitors, bots tend to fill it in */}
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <button type="submit" disabled={status === 'loading'} className="btn-primary disabled:opacity-60">
          {status === 'loading' ? 'Posting…' : 'Post Comment'}
        </button>
        {status === 'error' && <p className="text-red-500 text-sm">{errorMsg}</p>}
      </form>
    </div>
  );
}
