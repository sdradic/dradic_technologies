import type { Route } from "./+types/home";
import { SimpleInput } from "~/components/SimpleInput";
import { PostsList } from "~/components/PostList";
import { ChipSVG } from "~/components/Icons";

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
          Hi! I'm <span className="text-primary-500">Dusan Radic</span>, a
          software engineer and embedded systems developer.
        </h1>
        <div className="flex flex-col md:flex-row md:justify-between items-center mx-auto px-4 md:px-8 mt-16 gap-4">
          <p className="text-xl text-gray-50 text-wrap text-center md:text-left">
            I run a software consulting practice called{" "}
            <span className="text-primary-500">Dradic Technologies</span> where
            I help companies build the next generation of embedded systems.
          </p>
          {/* Right Side: Chip SVG Illustration */}
          <div className="flexflex-1 items-center justify-center mt-6">
            <ChipSVG className="md:size-96 size-64" />
          </div>
        </div>
      </div>
    </div>
  );
}
