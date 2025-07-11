import { useState } from "react";
import type { BlogPost } from "~/modules/types";

export default function Editor({
  selectedPost,
  selectedPostContent,
  setSelectedPostContent,
}: {
  selectedPost: BlogPost;
  selectedPostContent: string;
  setSelectedPostContent: (content: string) => void;
}) {
  const defaultContent = `---
title: ${selectedPost.title}
created_at: ${selectedPost.created_at || new Date().toISOString()}
updated_at: ${selectedPost.updated_at || new Date().toISOString()}
---\n\n`;

  return (
    <>
      {/* Editor */}
      <div className="flex flex-col px-2 w-full lg:max-h-full max-h-96 min-h-96">
        {selectedPost && (
          <>
            <h1 className="text-2xl font-bold py-4 text-center">Editor</h1>
            <textarea
              className="w-full rounded-md flex-1 bg-white h-full lg:min-h-[calc(100vh-210px)]"
              value={selectedPostContent || defaultContent}
              onChange={(e) => {
                setSelectedPostContent(e.target.value);
              }}
            />
          </>
        )}
      </div>
    </>
  );
}
