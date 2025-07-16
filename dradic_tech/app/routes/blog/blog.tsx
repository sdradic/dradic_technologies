import { PostsList } from "~/components/PostList";

export default function Blog() {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-semibold text-center mt-12">Blog</h1>
      <p className="text-center mt-4 text-gray-500 dark:text-gray-400">
        This is a collection of all the posts I have written.
      </p>
      <div className="flex flex-col mt-4 bg-gray-100 dark:bg-dark-400 rounded-xl p-4 divide-y divide-gray-200 dark:divide-gray-700">
        <PostsList />
      </div>
    </div>
  );
}
