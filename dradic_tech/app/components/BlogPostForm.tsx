import { BLOG_CATEGORIES, type BlogFormData } from "~/modules/utils";

interface BlogPostFormProps {
  formData: BlogFormData;
  onFormDataChange: (data: BlogFormData) => void;
  disabled?: boolean;
}

export function BlogPostForm({
  formData,
  onFormDataChange,
  disabled = false,
}: BlogPostFormProps) {
  const handleChange = (field: keyof BlogFormData, value: string) => {
    onFormDataChange({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Title Input */}
      <div className="md:col-span-2">
        <label
          htmlFor="post-title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Post Title *
        </label>
        <input
          id="post-title"
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter your post title..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-500 text-gray-900 dark:text-gray-100"
          required
          disabled={disabled}
        />
      </div>

      {/* Category Dropdown */}
      <div>
        <label
          htmlFor="post-category"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Category
        </label>
        <select
          id="post-category"
          value={formData.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-500 text-gray-900 dark:text-gray-100"
          disabled={disabled}
        >
          <option value="">Select a category...</option>
          {BLOG_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Author Input */}
      <div>
        <label
          htmlFor="post-author"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Author
        </label>
        <input
          id="post-author"
          type="text"
          value={formData.author}
          onChange={(e) => handleChange("author", e.target.value)}
          placeholder="Enter author name..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-500 text-gray-900 dark:text-gray-100"
          disabled={disabled}
        />
      </div>

      {/* Image URL Input */}
      <div className="md:col-span-2">
        <label
          htmlFor="post-image"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Featured Image URL
        </label>
        <input
          id="post-image"
          type="url"
          value={formData.image}
          onChange={(e) => handleChange("image", e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-500 text-gray-900 dark:text-gray-100"
          disabled={disabled}
        />
        {formData.image && (
          <div className="mt-2">
            <img
              src={formData.image}
              alt="Preview"
              className="w-32 h-24 object-cover rounded-md border border-gray-300 dark:border-gray-600"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
