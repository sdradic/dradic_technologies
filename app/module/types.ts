export interface Project {
  name: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}

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
