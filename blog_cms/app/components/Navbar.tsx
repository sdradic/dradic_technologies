import type { BlogPost } from "~/modules/types";
import {
  ChevronLeftIcon,
  LogoutIcon,
  MenuIcon,
  SaveIcon,
  TrashIcon,
} from "./Icons";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { useNavigate } from "react-router";
import { updateBlogPost, deleteBlogPost } from "~/modules/apis";

interface NavbarProps {
  selectedPost: BlogPost | null;
  setSelectedPost: (post: BlogPost | null) => void;
  selectedPostContent: string;
  isCreatingPost: boolean;
  setIsCreatingPost: (post: boolean) => void;
}

export default function Navbar({
  selectedPost,
  setSelectedPost,
  selectedPostContent,
  isCreatingPost,
  setIsCreatingPost,
}: NavbarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const { isGuest, logout, handleGuestLogin } = useAuth();
  const navigate = useNavigate();

  // Update tempTitle when selectedPost changes
  useEffect(() => {
    if (selectedPost) {
      setTempTitle(selectedPost.title || "");
    }
  }, [selectedPost]);

  const handlePostCreation = async (post: BlogPost) => {
    const localStoredBlogMetadata = localStorage.getItem(
      "localStoredBlogMetadata"
    );
    const localStoredBlogMetadataParsed = JSON.parse(
      localStoredBlogMetadata || "[]"
    );

    if (
      !localStoredBlogMetadataParsed.some(
        (storedPost: BlogPost) => storedPost.slug === post.slug
      )
    ) {
      localStoredBlogMetadataParsed.push(post);
    }
  };
  const handlePostUpdate = async (post: BlogPost, content: string) => {
    setIsLoading(true);
    const updatedPost = {
      ...post,
      title: tempTitle,
      content: content,
    };
    toast.promise(updateBlogPost(updatedPost), {
      loading: isCreatingPost ? "Creating post..." : "Updating post...",
      success: () => {
        handlePostCreation(post);
        setIsMobileMenuOpen(false); // Close mobile menu after action
        setTempTitle("");
        setSelectedPost(null);
        setIsCreatingPost(false);
        return isCreatingPost
          ? "Post created successfully"
          : "Post updated successfully";
      },
      error: "Failed to update post",
    });
    setIsLoading(false);
  };

  const handlePostDelete = async (post: BlogPost) => {
    setIsLoading(true);
    toast.promise(deleteBlogPost(post.slug), {
      loading: "Deleting post...",
      success: () => {
        setSelectedPost(null);
        setIsMobileMenuOpen(false); // Close mobile menu after action
        return "Post deleted successfully";
      },
      error: "Failed to delete post",
    });
    setIsLoading(false);
  };

  const handleGuest = () => {
    handleGuestLogin(false);
    navigate("/login");
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      if (isGuest) {
        handleGuest();
        toast.success("Logged out successfully");
        return;
      }
      await logout();
      setIsMobileMenuOpen(false);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempTitle(e.target.value);
  };

  return (
    <div className="flex flex-row w-full border-b border-gray-300 justify-between relative bg-white">
      <div className="flex flex-row items-center w-full h-full py-4 px-6 justify-between">
        {/* Back Button */}
        <div className="flex flex-row items-center gap-4 w-full lg:pl-6">
          {selectedPost && (
            <button
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 cursor-pointer rounded-full"
              onClick={() => {
                setSelectedPost(null);
                setIsMobileMenuOpen(false);
              }}
            >
              <ChevronLeftIcon className="w-6 h-6 stroke-gray-500" />
            </button>
          )}
          {/* Title */}
          {!selectedPost ? (
            <div className="flex flex-row items-center gap-4 size-42 h-full justify-center">
              <img src="dradic_tech_logo_w_title.png" alt="Dradic CMS" />
            </div>
          ) : (
            <input
              type="text"
              value={tempTitle}
              placeholder="Untitled post"
              onChange={handleTitleChange}
              disabled={isGuest}
            />
          )}
        </div>
        {/* Logout Button */}
        <div className="flex flex-row items-center gap-4 lg:pr-4 group">
          {!selectedPost && (
            <button
              className={`flex flex-row w-full gap-2 items-center text-left px-4 py-2 text-sm text-red-600 rounded-xl group-hover:text-red-800 group-hover:bg-red-50 cursor-pointer ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => {
                handleLogout();
              }}
            >
              <LogoutIcon className="w-6 h-6 group-hover:stroke-red-800 group-hover:fill-red-800 stroke-red-600 fill-red-600" />
              Logout
            </button>
          )}
        </div>
      </div>

      {selectedPost && !isGuest && (
        <>
          {/* Desktop Save and Delete Buttons */}
          <div className="hidden lg:flex flex-row gap-2 w-full items-center py-4 justify-end px-16">
            <>
              <button
                className={`btn-secondary w-1/2 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  handlePostDelete(selectedPost);
                }}
                disabled={isLoading}
              >
                Delete
              </button>
              <button
                className={`btn-primary w-1/2 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  handlePostUpdate(selectedPost, selectedPostContent);
                }}
                disabled={isLoading}
              >
                Save
              </button>
            </>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center px-6">
            <button
              className={`w-10 h-10 flex items-center justify-center cursor-pointer rounded-full hover:bg-gray-200 transition-colors duration-300 ease-in-out ${
                isMobileMenuOpen ? "bg-gray-200" : ""
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <MenuIcon className="w-8 h-8 stroke-gray-500" />
            </button>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && isGuest === false && (
              <div className="absolute top-full right-6 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                <div className="py-2">
                  <button
                    className={`flex flex-row w-full gap-2 items-center text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => {
                      handlePostUpdate(selectedPost, selectedPostContent);
                    }}
                    disabled={isLoading}
                  >
                    <SaveIcon className="w-5 h-5 stroke-gray-500" />
                    Save Post
                  </button>
                  <button
                    className={`flex flex-row w-full gap-2 items-center text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => {
                      handlePostDelete(selectedPost);
                    }}
                    disabled={isLoading}
                  >
                    <TrashIcon className="w-5 h-5 stroke-gray-500 " />
                    Delete Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Backdrop to close mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
