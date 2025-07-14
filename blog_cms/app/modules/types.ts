export interface BlogPostMetadata {
  slug: string;
  title: string;
  created_at: string;
  updated_at: string;
  image: string;
}

export interface BlogPost extends BlogPostMetadata {
  content: string;
}

export interface MarkdownMetadata {
  title: string;
  created_at: string;
  image: string;
  category?: string;
  author?: string;
}
