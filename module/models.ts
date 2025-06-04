export interface Project {
  name: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  image: string;
  content: string;
}
