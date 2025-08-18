import type { Route } from "./+types/index";
import { ChipSVG } from "~/components/Icons";
import { useEffect } from "react";
import { pingBackend } from "~/modules/apis";
import { Link } from "react-router";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Dradic Technologies" },
    { name: "description", content: "Welcome to Dradic Technologies!" },
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
    <>
      {/* Hero Section with Background Video */}
      <div className="relative flex flex-col md:flex-row justify-center items-center text-center">
        {/* Content */}
        <div className="flex flex-col md:flex-row justify-center items-center text-center relative">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl md:text-6xl font-semibold mb-8">
              Welcome to{" "}
              <span className="text-primary-500 dark:text-primary-600">
                Dradic Technologies
              </span>
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-300 text-center md:text-center">
              At Dradic Technologies, we specialize in cloud solutions and
              DevOps, with a particular focus on deploying and managing edge
              devices. Our mission is to deliver innovative, reliable, and
              scalable infrastructure that bridges the gap between cloud and
              edge computing.
            </p>
            <Link
              to="/about"
              className="btn-primary max-w-48 mt-8 dark:bg-primary-700 dark:hover:bg-primary-800"
            >
              Learn More
            </Link>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:mt-0 mt-8 items-center mx-auto px-4 md:px-8 gap-4">
            {/* Right Side: Chip SVG Illustration */}
            <div className="flex flex-1 items-center justify-center">
              <ChipSVG className="md:size-72 size-64 stroke-8 stroke-primary-500 fill-gray-100 dark:fill-white" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
