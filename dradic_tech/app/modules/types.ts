export interface BlogPostMetadata {
  slug: string;
  title: string;
  created_at: string;
  updated_at: string;
  image?: string;
  author?: string;
  category?: string;
  sample_content?: string;
}

export interface BlogPost extends BlogPostMetadata {
  content: string; // Pure markdown content without frontmatter
}

export interface BlogPostWithSeparatedContent {
  metadata: BlogPostMetadata;
  content: string; // Pure markdown content without frontmatter
}

export type NavItem = {
  label: string;
  path: string;
  children?: NavItem[];
};

export type NavConfig = NavItem[];
