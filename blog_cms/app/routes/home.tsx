import { useEffect, useState } from "react";
import { PostsList } from "~/components/PostList";
import { SearchBar } from "~/components/SearchBar";
import { fetchBlogPosts } from "~/modules/apis";
import type { BlogPost } from "~/modules/types";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load posts on initial mount only
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchBlogPosts();
        setPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, []); // Empty dependency array means this only runs once on mount

  // Handle search filtering
  useEffect(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (trimmedQuery === "") {
      // If search is empty, show all posts
      setFilteredPosts(posts);
    } else {
      // Filter posts based on search query
      const filtered = posts.filter((post) =>
        post.title.toLowerCase().includes(trimmedQuery)
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]); // Run when either search query or posts change

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4">
      {/* Recent Posts */}
      <div className="flex flex-col mt-6 justify-center text-left mx-4">
        <h1 className="text-4xl font-semibold text-center my-12">
          Blog <span className="text-primary-500">CMS</span>
        </h1>
        <div className="flex flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
          <h1 className="font-semibold text-gray-600 dark:text-gray-400">
            All Posts
          </h1>
          <button
            onClick={() => navigate("/new-post")}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors cursor-pointer"
          >
            New Post
          </button>
        </div>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <ul className="flex flex-col mt-4 dark:bg-dark-400 bg-gray-100 rounded-xl p-4 divide-y divide-gray-200 dark:divide-gray-700">
          <PostsList posts={filteredPosts} isLoading={isLoading} />
        </ul>
      </div>
    </div>
  );
}
