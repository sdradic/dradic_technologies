import { useState } from "react";
import { XIcon } from "./Icons";

interface MarkdownPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
}

export const MarkdownPasteModal = ({
  isOpen,
  onClose,
  onSave,
}: MarkdownPasteModalProps) => {
  const [markdownContent, setMarkdownContent] = useState("");

  const handleSave = () => {
    if (markdownContent.trim()) {
      onSave(markdownContent.trim());
      setMarkdownContent("");
      onClose();
    }
  };

  const handleCancel = () => {
    setMarkdownContent("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            handleCancel();
          }
        }}
        tabIndex={-1}
        role="presentation"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-6">
        <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between py-6 px-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Paste Markdown Content
            </h2>
            <button
              onClick={handleCancel}
              className="rounded-lg transition-colors cursor-pointer"
            >
              <XIcon className="size-6 stroke-slate-500 dark:stroke-slate-400 hover:stroke-brand-500 dark:hover:stroke-brand-400" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="mb-4">
              <label
                htmlFor="markdown-content"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Paste your markdown content below:
              </label>
              <textarea
                id="markdown-content"
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                className="w-full h-64 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 font-mono text-sm resize-none"
                placeholder="Paste your markdown content here..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleCancel}
              className="px-6 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!markdownContent.trim()}
              className="px-6 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 transition-colors font-medium disabled:cursor-not-allowed cursor-pointer"
            >
              Save & Insert
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
