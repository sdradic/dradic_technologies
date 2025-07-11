import type { BlogPost } from "~/modules/types";
import Loader from "~/components/Loader";
import { v7 as uuidv7 } from "uuid";
import { useAuth } from "~/contexts/AuthContext";
import { RefreshIcon } from "./Icons";

interface PostsListProps {
  posts: BlogPost[];
  setSelectedPost: (post: BlogPost | null) => void;
  setSelectedPostContent: (content: string) => void;
  isLoading: boolean;
  setIsCreatingPost: (isCreatingPost: boolean) => void;
  onReload: () => Promise<void>;
  isSidebar?: boolean;
}

export default function PostsList({
  posts,
  setSelectedPost,
  setSelectedPostContent,
  isLoading,
  setIsCreatingPost,
  onReload,
  isSidebar = false,
}: PostsListProps) {
  return (
    <>
      <div className="flex justify-between items-center w-full py-4 px-2 flex-col gap-2 md:gap-0 md:flex-row">
        <h1 className="text-xl font-bold">Blog Posts</h1>
        <button
          onClick={onReload}
          disabled={isLoading}
          className="btn-secondary"
          title="Reload posts"
        >
          <RefreshIcon className="w-5 h-5" />
          Reload
        </button>
      </div>
      <div
        className={`flex flex-col rounded-xl items-center border bg-white border-gray-300 ${
          isSidebar ? "mb-0 h-[calc(100vh-200px)]" : "mb-12 h-full"
        } overflow-y-auto w-full pb-4`}
      >
        {/* Blog Posts */}
        <div className="flex flex-col items-center w-full h-full justify-between">
          {!isLoading && (
            <div className="flex flex-col items-center w-full h-full">
              {posts?.map((post: BlogPost) => (
                <ul
                  key={post.slug}
                  className="flex flex-row gap-4 justify-between px-12 py-2 w-full border-b border-gray-300 hover:bg-gray-200"
                >
                  <li
                    className="px-4 rounded-xl text-lg text-center cursor-pointer  w-full hover:bg-gray-200 py-1"
                    onClick={() => {
                      setSelectedPost(post);
                      setSelectedPostContent(post.content);
                    }}
                  >
                    {post.title}
                  </li>
                </ul>
              ))}
            </div>
          )}
          {(isLoading || !posts.length) && (
            <div className="flex flex-col items-center justify-center w-full h-full py-8">
              <Loader showText={true} text="Loading posts..." />
            </div>
          )}

          {useAuth().isGuest === false && (
            <button
              className="btn-primary mt-4 justify-center flex items-center w-full"
              onClick={() => {
                setSelectedPost({
                  slug: uuidv7(),
                  title: "",
                  content: "",
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  image: "",
                });
                setSelectedPostContent("");
                setIsCreatingPost(true);
              }}
            >
              Create New Post
            </button>
          )}
        </div>
      </div>
    </>
  );
}
