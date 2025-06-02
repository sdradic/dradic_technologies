import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { useLoaderData, useNavigate } from "react-router";
import Footer from "~/components/Footer";
import SectionHeader from "~/components/SectionHeader";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  image: string;
}

export async function loader() {
  const dir = path.resolve(process.cwd(), "app/routes/blog/posts");
  const files = fs.readdirSync(dir);

  const posts = files
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const file = fs.readFileSync(path.join(dir, filename), "utf8");
      const { data } = matter(file);
      return { slug, ...data } as BlogPost;
    });

  return posts;
}

export default function BlogPage() {
  const posts = useLoaderData() as BlogPost[];
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-screen justify-between">
      <main className="flex flex-col h-full justify-center items-center">
        <SectionHeader title="Blog Posts" />
        <ul className="space-y-4 flex flex-wrap gap-4">
          {posts?.map((post) => (
            <li
              key={post.slug}
              className=" mx-auto p-4 rounded-lg border border-gray-200 h-72 bg-white cursor-pointer hover:underline hover:scale-105 transition-all duration-300"
              onClick={() => {
                navigate(`/blog/posts/${post.slug}`);
              }}
            >
              <img
                className="size-48 object-cover w-full"
                src={post?.image || "/blog_post_placeholder.png"}
                alt={post.title}
              />
              <div className="text-blue-600 text-lg font-medium">
                {post.title}
              </div>
              <p className="text-sm text-gray-500 mt-1">{post.date}</p>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
