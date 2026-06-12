import type { Metadata } from 'next';
import ManageComments from '@/components/ManageComments';

export const metadata: Metadata = {
  title: 'Manage Comments',
  robots: { index: false, follow: false },
};

export default function ManageCommentsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-serif text-mist-900 mb-2 text-center">
        Manage Comments
      </h1>
      <p className="text-mist-600 text-center mb-10">
        Reply to or delete comments left on your posts.
      </p>
      <ManageComments />
    </div>
  );
}
