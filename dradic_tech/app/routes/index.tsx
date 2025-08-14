import type { Route } from "./+types/index";
import { ChipSVG } from "~/components/Icons";
import { useEffect } from "react";
import { pingBackend } from "~/modules/apis";
import { Link } from "react-router";

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
    <>
      {/* Hero Section with Background Video */}
      <div className="relative flex flex-col md:flex-row justify-center items-center text-center">
        {/* Background Video */}
        {/* <div
          className="absolute inset-0 w-full h-full"
          style={{
            zIndex: 0,
            pointerEvents: "none", // Prevents video from blocking interactions
          }}
        >
          <video
            id="banner-video"
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            className="w-full h-full object-cover -translate-y-1/12"
          >
            <source src="/assets/hero_bg.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div> */}

        {/* Content */}
        <div className="flex flex-col md:flex-row justify-center items-center text-center relative">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl md:text-6xl font-semibold mb-8">
              Welcome to{" "}
              <span className="text-primary-500">Dradic Technologies</span>
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 text-center md:text-center">
              At Dradic Technologies, we specialize in cloud solutions and
              DevOps, with a particular focus on deploying and managing edge
              devices. Our mission is to deliver innovative, reliable, and
              scalable infrastructure that bridges the gap between cloud and
              edge computing.
            </p>
            <Link to="/about" className="btn-primary max-w-48 mt-8">
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
