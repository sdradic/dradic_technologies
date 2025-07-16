# Markdown Rendering System

This folder contains an enhanced markdown rendering system for the blog with rich styling and additional features.

## Components

### MarkdownRenderer

A React component that renders markdown content with enhanced features:

- HTML sanitization using DOMPurify
- Copy buttons for code blocks
- Smooth scrolling for anchor links
- Rich Tailwind CSS styling

### MarkdownConfig

Configuration for the marked library with:

- GitHub Flavored Markdown (GFM) support
- Line breaks enabled
- Custom renderer setup

### markdownUtils

Utility functions for markdown processing:

- `renderMarkdownToHtml()` - Enhanced markdown to HTML conversion
- `processMarkdownContent()` - Pre-processing with additional features
- `calculateReadingTime()` - Estimate reading time
- `extractTableOfContents()` - Generate table of contents

## Features

### Rich Styling

- Responsive typography with proper heading hierarchy
- Enhanced code blocks with syntax highlighting support
- Beautiful blockquotes with accent borders
- Responsive tables with hover effects
- Dark mode support throughout

### Interactive Elements

- Copy buttons on code blocks
- Smooth scrolling for anchor links
- Hover effects on links and tables

### Additional Features

- Reading time calculation
- Table of contents extraction
- Callout blocks support (NOTE, WARNING, TIP)
- Enhanced image rendering with shadows

## Usage

```tsx
import { MarkdownRenderer } from "~/components/markdown";

function BlogPost({ content }) {
  return <MarkdownRenderer content={content} className="custom-styles" />;
}
```

## Styling

The system uses Tailwind CSS classes defined in `markdown.css` which is imported in the main `app.css`. All styles support both light and dark modes.

## Customization

To add new features:

1. Update `markdownUtils.ts` for processing logic
2. Add styles to `markdown.css`
3. Update `MarkdownRenderer.tsx` for interactive features
4. Export new functions in `index.ts`
