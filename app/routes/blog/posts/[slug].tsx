import { useLoaderData } from "react-router";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

interface LoaderData {
  html: string;
  metadata: {
    title: string;
    date: string;
  };
}

export async function loader({ params }: { params: { slug: string } }) {
  console.log("Blog post loader called with params:", params);
  const slug = params.slug;
  const postsDir = path.resolve(
    process.cwd(),
    "app",
    "routes",
    "blog",
    "posts"
  );
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
  return { html, metadata: data } as LoaderData;
}

export default function BlogPost() {
  console.log("Blog post component rendering");
  const data = useLoaderData() as LoaderData;
  console.log("Loader data:", data);

  if (!data) {
    console.log("No data received from loader");
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <article className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold mb-4">{data.metadata.title}</h1>
        <p className="text-gray-500 text-sm mb-8">{data.metadata.date}</p>
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: data.html }}
        />
      </article>
    </div>
  );
}
