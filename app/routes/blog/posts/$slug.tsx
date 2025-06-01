import { useLoaderData } from "react-router";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

export async function loader({ params }: { params: { slug: string } }) {
  console.log("Blog post loader called with params:", params);
  const slug = params.slug;
  const postsDir = path.join(process.cwd(), "app", "routes", "blog", "posts");
  const filePath = path.join(postsDir, `${slug}.md`);

  console.log("Looking for file at:", filePath);

  if (!fs.existsSync(filePath)) {
    console.log("File not found at:", filePath);
    throw new Response("Not Found", { status: 404 });
  }

  const file = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(file);
  const html = marked.parse(content);

  console.log("Successfully loaded post:", data.title);
  return { html, metadata: data };
}

export default function BlogPost() {
  console.log("Blog post component rendering");
  const { html, metadata } = useLoaderData<typeof loader>();

  return (
    <article className="prose max-w-2xl mx-auto py-8">
      <h1>{metadata.title}</h1>
      <p className="text-gray-500 text-sm">{metadata.date}</p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
