import { useEffect, useState } from "react";
import type { BlogPost } from "~/modules/types";
import { renderMarkdownToHtml } from "~/modules/utils";
import { FullScreenIcon, XIcon } from "./Icons";
import { useAuth } from "~/contexts/AuthContext";

export default function MarkdownPreview({
  selectedPost,
  selectedPostContent,
}: {
  selectedPost: BlogPost;
  selectedPostContent: string;
}) {
  const [parsedHtml, setParsedHtml] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isGuest } = useAuth();

  // Parse markdown whenever selectedPostContent changes
  useEffect(() => {
    const parseMarkdown = async () => {
      if (!selectedPostContent) {
        setParsedHtml("");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Use the utility function to render markdown to HTML
        const html = await renderMarkdownToHtml(selectedPostContent);
        setParsedHtml(html);
      } catch (error) {
        console.error("Failed to parse markdown:", error);
        setError(`Failed to parse markdown content: ${error}`);
        setParsedHtml(`<pre>${selectedPostContent}</pre>`);
      } finally {
        setIsLoading(false);
      }
    };

    parseMarkdown();
  }, [selectedPostContent]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleModalClose();
    }
  };

  const PreviewContent = () => (
    <>
      {error && (
        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2 text-sm">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="w-full flex-1 flex items-center justify-center">
          <div className="text-gray-500">Parsing markdown...</div>
        </div>
      ) : (
        <div
          className="w-full border border-gray-300 rounded-md bg-white p-4 overflow-auto markdown-content flex-1"
          dangerouslySetInnerHTML={{
            __html: parsedHtml || `<p>No content to preview</p>`,
          }}
        />
      )}
    </>
  );

  return (
    <>
      {/* Markdown Preview */}
      <div className="flex flex-col items-center px-2 w-full max-h-96 min-h-96 lg:max-h-[calc(100vh-145px)]">
        {selectedPost && (
          <>
            <div className="flex items-center justify-evenly w-full py-4 sm:flex-row text-center gap-2 flex-col">
              <h1 className="text-2xl font-bold">Markdown Preview</h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1 bg-primary-400 rounded-md hover:bg-primary-600 transition-colors text-sm cursor-pointer"
                title="View in full screen"
              >
                <FullScreenIcon className="w-4 h-4 stroke-white" />
                Full Screen
              </button>
            </div>
            <div className="flex flex-col items-center w-full gap-2 flex-1 overflow-y-auto overflow-x-hidden">
              <PreviewContent />
            </div>
          </>
        )}
      </div>

      {/* Full Screen Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleModalBackdropClick}
        >
          <div className="bg-white rounded-lg w-full h-full max-w-none flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">
                {selectedPost.title} - Preview
              </h2>
              <button
                onClick={handleModalClose}
                className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                title="Close full screen"
              >
                <XIcon className="w-5 h-5 stroke-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex flex-col flex-1 p-4 overflow-hidden">
              <PreviewContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
