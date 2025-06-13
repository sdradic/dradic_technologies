import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import { app } from "~/module/firebase";
import type { BlogPost } from "./types";
import { handleSaveLocalStoredBlogMetadata } from "./utils";

export async function fetchPostsFromFirebase(): Promise<BlogPost[]> {
  const VITE_FIREBASE_STORAGE_BUCKET = import.meta.env
    .VITE_FIREBASE_STORAGE_BUCKET;
  const storage = getStorage(app);
  const folderRef = ref(
    storage,
    `gs://${VITE_FIREBASE_STORAGE_BUCKET}/blog_posts/`
  );

  try {
    const localStoredBlogMetadata = localStorage.getItem(
      "localStoredBlogMetadata"
    );
    const localStoredBlogMetadataParsed = JSON.parse(
      localStoredBlogMetadata || "{}"
    );
    const res = await listAll(folderRef);
    const posts: BlogPost[] = [];

    for (const itemRef of res.items) {
      // If blog post metadata different from local stored blog metadata, update local stored blog metadata
      if (
        localStoredBlogMetadata &&
        localStoredBlogMetadataParsed.some(
          (post: BlogPost) => post.slug === itemRef.name.replace(/\.md$/, "")
        )
      ) {
        const post = localStoredBlogMetadataParsed.find(
          (post: BlogPost) => post.slug === itemRef.name.replace(/\.md$/, "")
        );
        posts.push(post);
        console.log(
          "Blog post metadata is the same as local stored blog metadata"
        );
        continue;
      }
      // If blog post metadata is different from local stored blog metadata, fetch from Firebase
      const url = await getDownloadURL(itemRef);
      const response = await fetch(url);
      const content = await response.text();

      // Assuming the filename is the slug
      const slug = itemRef.name.replace(/\.md$/, "");

      // Parse the markdown frontmatter to get metadata
      const metadata = content.split("---")[1];
      const title = metadata.match(/title:\s*(.*)/)?.[1] || "";
      const created_at = metadata.match(/created_at:\s*(.*)/)?.[1] || "";
      const image = metadata.match(/image:\s*(.*)/)?.[1] || "";

      posts.push({
        slug,
        title,
        created_at,
        image,
        content,
      });
    }
    handleSaveLocalStoredBlogMetadata(posts);

    return posts;
  } catch (error) {
    console.error("Error loading blog posts:", error);
    return [];
  }
}
