import { getAllPosts, getAllCategories } from '@/lib/posts';
import PostCard from '@/components/PostCard';

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category: category.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  return {
    title: `${categoryName} Posts`,
    description: `Browse all ${categoryName.toLowerCase()} posts`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const allPosts = getAllPosts();
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  const categoryPosts = allPosts.filter(
    (post) => post.category.toLowerCase() === category.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-serif text-sand-900 mb-4">
          {categoryName}
        </h1>
        <p className="text-xl text-sand-600">
          {categoryPosts.length} {categoryPosts.length === 1 ? 'post' : 'posts'}
        </p>
      </div>

      {categoryPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-sand-600">No posts yet in this category.</p>
        </div>
      )}
    </div>
  );
}
