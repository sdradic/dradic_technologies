# Markdown Rendering System

This folder contains a simplified markdown rendering system for the blog using react-markdown.

## Components

### MarkdownRenderer

A React component that renders markdown content using react-markdown with:

- GitHub Flavored Markdown (GFM) support via remark-gfm
- Frontmatter parsing via remark-frontmatter
- Tailwind CSS prose styling
- No innerHTML - renders React elements directly
- No DOMPurify needed - XSS protection by design
- No async rendering - no useEffect or innerHTML timing

## Features

### Clean React-based Rendering

- Renders markdown as React components instead of HTML strings
- Built-in XSS protection through React's DOM handling
- Automatic frontmatter stripping
- GFM support for tables, strikethrough, and more

### Styling

- Uses Tailwind CSS prose classes for beautiful typography
- Dark mode support with `dark:prose-invert`
- Responsive design with `max-w-none` for full-width content

## Usage

```tsx
import { MarkdownRenderer } from "~/components/markdown";

function BlogPost({ content }) {
  return <MarkdownRenderer content={content} className="custom-styles" />;
}
```

## Dependencies

- `react-markdown` - Core markdown rendering
- `remark-gfm` - GitHub Flavored Markdown support
- `remark-frontmatter` - Frontmatter parsing and removal

## Benefits over Previous System

- **Simpler**: No complex async rendering pipeline
- **Safer**: No innerHTML means no XSS vulnerabilities
- **Cleaner**: No DOMPurify or manual DOM manipulation
- **More React-like**: Renders actual React components
- **Better Performance**: No async overhead or DOM sanitization
