import type { BlogPostWithSeparatedContent } from "./types";

// Simple store to share blog posts data between components
class BlogStore {
  private posts: BlogPostWithSeparatedContent[] = [];
  private listeners: Set<() => void> = new Set();
  private updateTimeout: ReturnType<typeof setTimeout> | null = null;

  setPosts(posts: BlogPostWithSeparatedContent[]) {
    this.posts = posts;
    this.scheduleNotification();
  }

  getPosts(): BlogPostWithSeparatedContent[] {
    return this.posts;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private scheduleNotification() {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    // Defer notifications to avoid render-time updates
    this.updateTimeout = setTimeout(() => {
      this.notifyListeners();
      this.updateTimeout = null;
    }, 0);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }
}

export const blogStore = new BlogStore();
