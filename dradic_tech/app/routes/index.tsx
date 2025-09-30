import type { Route } from "./+types/index";
import { ChipSVG } from "~/components/Icons";
import { Link } from "react-router";
import AboutPage from "./about";
import { RecentPosts } from "./blog";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Dradic Technologies" },
    { name: "description", content: "Welcome to Dradic Technologies!" },
  ];
}

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="flex flex-col justify-center items-center gap-8 sm:mt-0 mt-8">
        {/* Content */}
        <div className="flex flex-col md:flex-row  text-center text-center md:h-screen">
          <div className="hidden md:flex flex-col md:flex-row md:justify-between items-center mx-auto px-4 md:px-8 gap-4">
            {/* Right Side: Chip SVG Illustration */}
            <div className="flex flex-1 items-center justify-center">
              <ChipSVG className="md:size-72 size-64 stroke-8 stroke-primary-500 fill-gray-100 dark:fill-white" />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl md:text-6xl font-semibold mb-8">
              Welcome to{" "}
              <span className="text-primary-500 dark:text-primary-600">
                Dradic Technologies
              </span>
            </h1>
            <div className="md:hidden flex flex-col md:flex-row md:justify-between items-center mx-auto px-4 md:px-8 gap-4">
              {/* Right Side: Chip SVG Illustration */}
              <div className="flex flex-1 items-center justify-center">
                <ChipSVG className="md:size-72 size-64 stroke-8 stroke-primary-500 fill-gray-100 dark:fill-white" />
              </div>
            </div>
            <p className="text-xl text-gray-500 dark:text-gray-300 text-center md:text-center">
              At Dradic Technologies, we empower businesses of all types with
              innovative, reliable, and scalable technology solutions. Our
              expertise spans cloud, DevOps, and modern infrastructure. Helping
              you achieve your goals, no matter your industry.
            </p>
            <Link
              to="/about"
              className="btn-primary max-w-48 mt-8 dark:bg-primary-700 dark:hover:bg-primary-800"
            >
              Learn More
            </Link>
          </div>
        </div>
        <AboutPage />
        <div className="flex flex-col mt-8 w-full">
          <h1 className="text-4xl sm:text-6xl font-semibold text-center pt-2">
            {" "}
            Blog
          </h1>
          <RecentPosts refreshButton={false} />
        </div>
      </div>
    </>
  );
}
