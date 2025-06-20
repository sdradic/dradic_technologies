import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import { app } from "~/module/firebase";
import type { BlogPost, BlogPostMetadata } from "./types";
import { handleSaveLocalStoredBlogMetadata } from "./utils";

async function fetchPostContent(slug: string): Promise<string> {
  const VITE_FIREBASE_STORAGE_BUCKET = import.meta.env
    .VITE_FIREBASE_STORAGE_BUCKET;
  const storage = getStorage(app);
  const fileRef = ref(
    storage,
    `gs://${VITE_FIREBASE_STORAGE_BUCKET}/blog_posts/${slug}`
  );

  try {
    const url = await getDownloadURL(fileRef);
    const response = await fetch(url);
    return await response.text();
  } catch (error) {
    console.error(`Error fetching post content for ${slug}:`, error);
    return '';
  }
}

export async function fetchPostsFromFirebase(): Promise<BlogPost[]> {
  const VITE_FIREBASE_STORAGE_BUCKET = import.meta.env
    .VITE_FIREBASE_STORAGE_BUCKET;
  const storage = getStorage(app);
  const folderRef = ref(
    storage,
    `gs://${VITE_FIREBASE_STORAGE_BUCKET}/blog_posts/`
  );

  try {
    // Get local metadata
    const localStoredBlogMetadata = localStorage.getItem("localStoredBlogMetadata");
    const localPosts: BlogPostMetadata[] = localStoredBlogMetadata
      ? JSON.parse(localStoredBlogMetadata)
      : [];
    const localPostsMap = new Map(localPosts.map(post => [post.slug, post]));

    const res = await listAll(folderRef);
    const posts: BlogPost[] = [];
    const firebaseSlugs = new Set(res.items.map(item => item.name.replace(/\.md$/, '')));

    // Process each post
    for (const itemRef of res.items) {
      const slug = itemRef.name.replace(/\.md$/, "");
      const localPost = localPostsMap.get(slug);
      
      try {
        let content = '';
        let title = 'Untitled';
        let created_at = new Date().toISOString();
        let updated_at = new Date().toISOString();
        let image = '';
        
        try {
          content = await fetchPostContent(slug);
          if (content) {
            const metadataMatch = content.match(/---\s*([\s\S]*?)\s*---/);
            if (metadataMatch && metadataMatch[1]) {
              const metadata = metadataMatch[1];
              const getMetadataValue = (field: string): string => {
                const match = metadata.match(new RegExp(`${field}:\\s*([^\\n]+)`));
                return match ? match[1].trim() : '';
              };

              const new_updated_at = getMetadataValue('updated_at');
              const new_title = getMetadataValue('title');
              const new_created_at = getMetadataValue('created_at');
              const new_image = getMetadataValue('image');

              if (new_updated_at) updated_at = new_updated_at;
              if (new_title) title = new_title;
              if (new_created_at) created_at = new_created_at;
              if (new_image) image = new_image;

              // Only use cached content if the post hasn't been updated
              if (localPost?.updated_at && localPost.updated_at === updated_at) {
                posts.push({
                  ...localPost,
                  content: content,
                });
                continue;
              }
            }
          }
        } catch (error) {
          console.error(`Error processing post ${slug}:`, error);
          // Continue to create a post with available data
        }

        posts.push({
          slug,
          title,
          created_at,
          updated_at,
          image,
          content: content || 'Error loading content',
        });
      } catch (error) {
        console.error(`Error processing post ${slug}:`, error);
        // Skip this post if there's an error
        continue;
      }
    }

    // Clean up local storage by removing metadata for posts that no longer exist in Firebase
    const updatedLocalPosts = posts.map(({ content, ...metadata }) => metadata);
    handleSaveLocalStoredBlogMetadata(updatedLocalPosts);

    return posts;
  } catch (error) {
    console.error("Error loading blog posts:", error);
    // Return local posts if available, or empty array if not
    const localStoredBlogMetadata = localStorage.getItem("localStoredBlogMetadata");
    if (localStoredBlogMetadata) {
      const localPosts: BlogPostMetadata[] = JSON.parse(localStoredBlogMetadata);
      return localPosts.map(post => ({
        ...post,
        content: 'Error loading content. Please check your connection and refresh.'
      }));
    }
    return [];
  }
}
