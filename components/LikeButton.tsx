'use client';

import { useEffect, useState } from 'react';

export default function LikeButton({ slug, initialCount }: { slug: string; initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(`liked_${slug}`) === 'true');
  }, [slug]);

  async function handleClick() {
    if (liked) return;

    setLiked(true);
    setCount((c) => c + 1);
    localStorage.setItem(`liked_${slug}`, 'true');

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (typeof data.count === 'number') {
        setCount(data.count);
      }
    } catch {
      // Keep the optimistic local update even if the request fails
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={liked}
      aria-pressed={liked}
      className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-300 ${
        liked
          ? 'bg-sea-salt-100 text-sea-salt-700'
          : 'bg-white text-mist-700 hover:bg-sea-salt-50 hover:text-sea-salt-600'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={1.75}
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      <span>{liked ? 'Loved' : 'Love this'}</span>
      <span className="text-mist-500">·</span>
      <span>{count}</span>
    </button>
  );
}
