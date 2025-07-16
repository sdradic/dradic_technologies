import type { Route } from "./+types/index";
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
          software engineer and DevOps specialist.
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 text-center md:text-center mt-4">
          I strive to create innovative applications and implement robust DevOps
          solutions through my company{" "}
          <span className="text-primary-500">Dradic Technologies</span>,
          combining software engineering excellence with modern deployment
          practices.
        </p>
        <div className="flex flex-col md:flex-row md:justify-between items-center mx-auto px-4 md:px-8 mt-16 gap-4">
          {/* Right Side: Chip SVG Illustration */}
          <div className="flexflex-1 items-center justify-center mt-6">
            <ChipSVG className="md:size-72 size-64 stroke-8 stroke-primary-500 fill-gray-100 dark:fill-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
