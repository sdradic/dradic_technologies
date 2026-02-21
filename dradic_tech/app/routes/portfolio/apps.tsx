import { useState } from "react";
import { useLocation } from "react-router";

// NOTE: Color and style conventions adapted to match index.tsx, including glass, border, brand and text colors.

const APPS = [
  {
    title: "Expense Tracker",
    description:
      "A simple expense tracker app built with React and TypeScript.",
    image: "/assets/TallyUp.webp",
    link: "https://app.dradic.cl/",
  },
  {
    title: "Gym Tracker",
    description: "A gym tracker app built with Next.js and TypeScript.",
    image: "/assets/gymTracker.png",
    link: "https://gym.dradic.cl/",
  },
];

const PROJECTS = [
  {
    name: "Compression algorithm analysis applied to DNA sequences",
    description:
      "This project is a compression algorithm analysis applied to DNA sequences.",
    link: "https://github.com/sdradic/Bioinformatics",
    tags: ["Bioinformatics", "Compression", "Algorithms"],
  },
];

export default function Apps() {
  const location = useLocation();
  const [tab, setTab] = useState(() => {
    if (location.hash === "#projects") return "projects";
    return "apps";
  });

  function handleTabChange(newTab: string) {
    setTab(newTab);
    window.location.hash = newTab === "apps" ? "#apps" : "#projects";
  }

  return (
    <div className="w-full">
      <h1 className="text-4xl sm:text-6xl font-extrabold text-center tracking-tight text-brand-600 dark:text-brand-400">
        Portfolio
      </h1>
      <div className="flex items-center justify-center mt-8 mb-2">
        <TabButton
          active={tab === "apps"}
          onClick={() => handleTabChange("apps")}
        >
          Apps
        </TabButton>
        <TabButton
          active={tab === "projects"}
          onClick={() => handleTabChange("projects")}
        >
          Projects
        </TabButton>
      </div>

      <div className="max-w-2xl mx-auto mt-12">
        {tab === "apps" && (
          <>
            <p className="text-2xl text-slate-600 dark:text-slate-400 mb-6 text-center leading-relaxed">
              Here are some of the apps we&apos;ve worked on.
            </p>
            <div className="flex flex-col gap-6">
              {APPS.map((app) => (
                <AppCard
                  key={app.title}
                  title={app.title}
                  description={app.description}
                  image={app.image}
                  link={app.link}
                />
              ))}
            </div>
          </>
        )}
        {tab === "projects" && (
          <>
            <p className="text-2xl text-slate-600 dark:text-slate-400 mb-6 text-center leading-relaxed">
              These are research projects we&apos;ve worked on.
            </p>
            <div className="flex flex-col gap-6">
              {PROJECTS.map((project) => (
                <ProjectCard
                  key={project.name}
                  name={project.name}
                  description={project.description}
                  link={project.link}
                  tags={project.tags}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`px-8 py-3 text-lg font-bold rounded-xl mx-2 transition-all duration-150 cursor-pointer
      ${
        active
          ? "bg-brand-600 text-white dark:bg-brand-400 dark:text-slate-900 shadow border border-brand-500 dark:border-brand-400"
          : "bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-brand-100 dark:hover:bg-brand-900/20 hover:text-brand-600 dark:hover:text-brand-400"
      }
    `}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </button>
  );
}

// App card matching index.tsx, glass, brand, and hover colors
const AppCard = ({
  title,
  description,
  image = "/assets/blog_post_placeholder.webp",
  link,
}: {
  title: string;
  description: string;
  image?: string;
  link?: string;
}) => {
  return (
    <div
      className={`glass flex flex-col gap-3 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 w-full
        hover:border-brand-500 transition-all hover:-translate-y-2 cursor-pointer group`}
      onClick={() => {
        if (link) {
          window.open(link, "_blank");
        } else {
          alert("Coming Soon");
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (link) {
            window.open(link, "_blank");
          } else {
            alert("Coming Soon");
          }
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={link ? `Open ${title} app` : `${title} - Coming Soon`}
    >
      {image && (
        <div className="mb-6 bg-brand-100 dark:bg-brand-900/20 w-fit p-4 rounded-xl mx-auto group-hover:bg-brand-500 transition-colors duration-300">
          <img
            src={image}
            alt={title}
            className="size-12 object-contain rounded-lg mx-auto group-hover:grayscale-0 group-hover:scale-105 transition"
          />
        </div>
      )}
      <h2 className="text-xl font-bold mb-1 text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
        {title}
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
        {description}
      </p>
    </div>
  );
};

// Project card matching index.tsx/card style/brand accent
const ProjectCard = ({
  name,
  description,
  link,
  tags,
}: {
  name: string;
  description: string;
  link: string;
  tags: string[];
}) => {
  return (
    <div
      className="glass flex flex-col gap-3 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 w-full
        hover:border-brand-500 transition-all hover:-translate-y-2 cursor-pointer group"
      onClick={() => {
        window.open(link, "_blank");
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.open(link, "_blank");
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open ${name} project`}
    >
      <h2 className="text-xl font-bold mb-1 text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
        {name}
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
        {description}
      </p>
      <div className="flex flex-row flex-wrap gap-2 mt-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-2 px-2 py-0.5 rounded text-xs font-medium bg-brand-100 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300"
          >
            <div className="size-2 rounded-full bg-brand-500 dark:bg-brand-400" />
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};
