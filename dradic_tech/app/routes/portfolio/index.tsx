import { Link } from "react-router";
import { ExternalLink, Beaker } from "lucide-react";

export default function Portfolio() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4">Portfolio</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          Explore our applications and research projects.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Apps Card */}
        <Link
          to="/portfolio/"
          className="group glass border border-slate-200 dark:border-slate-800 rounded-2xl p-8 hover:border-brand-500 transition-all hover:-translate-y-2"
        >
          <div className="mb-6 bg-brand-100 dark:bg-brand-900/20 w-fit p-4 rounded-xl group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
            <ExternalLink className="w-8 h-8 text-brand-500 group-hover:text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3 group-hover:text-brand-500 transition-colors">
            Applications
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Production applications showcasing modern web development practices.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
              Expense Tracker
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
              Gym Tracker
            </li>
          </ul>
        </Link>

        {/* Projects Card */}
        <Link
          to="/portfolio/projects"
          className="group glass border border-slate-200 dark:border-slate-800 rounded-2xl p-8 hover:border-brand-500 transition-all hover:-translate-y-2"
        >
          <div className="mb-6 bg-brand-100 dark:bg-brand-900/20 w-fit p-4 rounded-xl group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
            <Beaker className="w-8 h-8 text-brand-500 group-hover:text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3 group-hover:text-brand-500 transition-colors">
            Research Projects
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Academic and experimental research in bioinformatics and algorithms.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
              Compression Algorithms
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
              DNA Sequence Analysis
            </li>
          </ul>
        </Link>
      </div>
    </div>
  );
}
