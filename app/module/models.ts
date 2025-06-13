export interface Project {
  name: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}

export interface BlogPost {
  slug: string;
  title: string;
  created_at: string;
  image: string;
  content: string;
}
