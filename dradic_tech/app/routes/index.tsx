import type { Route } from "./+types/index";
import { ChipSVG } from "~/components/Icons";
import { useEffect } from "react";
import { pingBackend } from "~/modules/apis";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Dradic Technologies Blog" },
    { name: "description", content: "Welcome to Dradic Technologies Blog!" },
  ];
}

let pinged = false;

export default function Home() {
  // Background ping on homepage load
  useEffect(() => {
    if (!pinged) {
      pingBackend();
      pinged = true;
    }
  }, []);

  return (
    <div className="w-full max-w-4xl sm:max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row justify-center items-center text-center mx-4">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-5xl md:text-6xl font-semibold mb-8">
            Hi! I&apos;m <span className="text-primary-500">Dusan Radic</span>,
            a software engineer and DevOps specialist.
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 text-center md:text-center">
            I strive to create innovative applications and implement robust
            DevOps solutions through my company{" "}
            <span className="text-primary-500">Dradic Technologies</span>,
            combining software engineering excellence with modern deployment
            practices.
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between md:mt-0 mt-8 items-center mx-auto px-4 md:px-8 gap-4">
          {/* Right Side: Chip SVG Illustration */}
          <div className="flex flex-1 items-center justify-center">
            <ChipSVG className="md:size-72 size-64 stroke-8 stroke-primary-500 fill-gray-100 dark:fill-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
