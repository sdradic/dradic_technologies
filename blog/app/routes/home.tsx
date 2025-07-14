import type { Route } from "./+types/home";
import { SimpleInput } from "~/components/SimpleInput";
import { PostsList } from "~/components/PostList";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dradic Technologies Blog" },
    { name: "description", content: "Welcome to Dradic Technologies Blog!" },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4">
      {/* Hero Section */}
      <div className="flex flex-col mt-4 justify-center items-center text-center mx-4 pt-4 pb-8">
        <h1 className="text-4xl md:text-6xl font-semibold">
          Weekly <span className="text-primary-500">embedded</span> +{" "}
          <span className="text-primary-500">programing</span> tech insights and
          tutorials
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-4">
          Join us as we explore the latest trends in technology and share our
          insights with you.
        </p>
        {/* Subscribe Bar */}
        <SimpleInput />
      </div>
      {/* Recent Posts */}
      <div className="flex flex-col mt-6 justify-center text-left mx-4">
        <h2 className="font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2">
          Latest content
        </h2>
        <ul className="flex flex-col mt-4 dark:bg-dark-400 bg-gray-100 rounded-xl p-4 divide-y divide-gray-200 dark:divide-gray-700">
          <PostsList />
        </ul>
      </div>
    </div>
  );
}
