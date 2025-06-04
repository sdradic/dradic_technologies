import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import { app } from "module/firebase";
import type { BlogPost } from "./models";

export async function fetchPostsFromFirebase(): Promise<BlogPost[]> {
  const VITE_FIREBASE_STORAGE_BUCKET = import.meta.env
    .VITE_FIREBASE_STORAGE_BUCKET;
  const storage = getStorage(app);
  const folderRef = ref(
    storage,
    `gs://${VITE_FIREBASE_STORAGE_BUCKET}/blog_posts/`
  );

  try {
    const res = await listAll(folderRef);
    const posts: BlogPost[] = [];

    for (const itemRef of res.items) {
      const url = await getDownloadURL(itemRef);
      const response = await fetch(url);
      const content = await response.text();

      // Assuming the filename is the slug
      const slug = itemRef.name.replace(/\.md$/, "");

      // Parse the markdown frontmatter to get metadata
      const metadata = content.split("---")[1];
      const title = metadata.match(/title:\s*(.*)/)?.[1] || "";
      const date = metadata.match(/date:\s*(.*)/)?.[1] || "";
      const image = metadata.match(/image:\s*(.*)/)?.[1] || "";

      posts.push({
        slug,
        title,
        date,
        image,
        content,
      });
    }

    return posts;
  } catch (error) {
    console.error("Error loading blog posts:", error);
    return [];
  }
}
