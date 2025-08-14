import { Link } from "react-router";
import { downloadFileFromBackend } from "~/modules/apis";

interface Experience {
  company: string;
  location: string;
  roles: Role[];
  overallPeriod: string;
  highlights: string[];
}

interface Role {
  title: string;
  period?: string;
}

export default function About() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <h1 className="text-4xl sm:text-6xl font-semibold text-center pt-2">
        About Me
      </h1>
      {/* About Me */}
      <div className="flex flex-col items-center justify-center gap-4">
        <img
          src="/assets/dusan.webp"
          alt="Dradic"
          className="size-42 md:size-48 rounded-full"
        />
        <h2 className="text-2xl font-semibold text-center md:text-left text-gray-700 dark:text-gray-300">
          Dusan Radic
        </h2>
        <p className="text-lg text-center md:text-left text-gray-500 dark:text-gray-400">
          DevOps Lead and Backend Engineer with expertise in AWS cloud-native
          architectures, automation, and CI/CD. Proven success delivering
          scalable serverless systems and developer tooling for distributed
          platforms. Background in Electrical Engineering with a diploma in
          Bioinformatics. Passionate about building clean, maintainable code and
          fostering team collaboration.
        </p>
      </div>
      {/* Download CV and Contact Me Buttons */}
      <div className="flex flex-row gap-4 justify-evenly items-center">
        <button
          className="btn-secondary w-full max-w-48"
          onClick={async () =>
            await downloadFileFromBackend("Dusan_Radic_CV.pdf")
          }
        >
          Download CV
        </button>
        <Link to="/contact" className="btn-primary w-full text-center max-w-48">
          Contact Me
        </Link>
      </div>
      {/* Experience */}
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center md:text-left mb-2">
          Experience
        </h2>
        <div className="flex flex-col gap-6">
          {experience.map((company) => (
            <div
              key={company.company}
              className="bg-white dark:bg-dark-400 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-6 transition hover:shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-400">
                    {company.company}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {company.location}
                  </span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                  {company.overallPeriod}
                </span>
              </div>
              <div className="flex flex-col gap-1 mb-2">
                {company.roles.map((role, idx) => (
                  <div
                    key={role.title + idx}
                    className="flex flex-col sm:flex-row sm:items-center sm:gap-2"
                  >
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {role.title}
                    </span>
                    {role.period && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {role.period}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <ul className="list-disc list-inside pl-2 text-gray-700 dark:text-gray-300 text-sm space-y-1">
                {company.highlights.map((highlight, idx) => (
                  <li key={idx} className="leading-snug">
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
const experience: Experience[] = [
  {
    company: "SwiftCX",
    location: "Remote, USA",
    roles: [
      {
        title: "DevOps Lead",
        period: "Jun 2025 – Present",
      },
      {
        title: "Software Engineer",
        period: "Mar 2023 – Jun 2025",
      },
    ],
    overallPeriod: "Mar 2023 – Present",
    highlights: [
      "Led development of AI-driven error monitoring system with Slack notifications for rapid incident response.",
      "Optimized high-cost AWS Lambda functions by implementing per-client tracking, reducing memory-related timeouts.",
      "Developed automated transcription pipeline for Zendesk voice messages, increasing support efficiency.",
      "Integrated external web tools into SwiftCX platform, enhancing functionality and user engagement.",
      "Redesigned chatbot widget architecture to handle increased traffic and improve performance.",
      "Implemented infrastructure provisioning with CDK and established automated testing frameworks.",
    ],
  },
  {
    company: "Deloitte Consulting",
    location: "Santiago, Chile",
    roles: [
      {
        title: "Data Engineer",
      },
    ],
    overallPeriod: "Mar 2022 – Mar 2023",
    highlights: [
      "Built scalable ETL pipelines using PySpark and AWS services (S3, Lambda, Redshift).",
      "Delivered production-grade data pipelines for internal and client-facing analytics.",
    ],
  },
  {
    company: "Ministry of Economy, Development, and Tourism",
    location: "Santiago, Chile",
    roles: [
      {
        title: "Software Engineer",
      },
    ],
    overallPeriod: "Sep 2021 – Mar 2022",
    highlights: [
      "Developed full-stack features using Django and Vue.js.",
      "Applied AWS security best practices and automated infrastructure with Ansible.",
    ],
  },
  {
    company: "Artificial Intelligence Solutions",
    location: "Santiago, Chile",
    roles: [
      {
        title: "Backend Engineer",
      },
    ],
    overallPeriod: "Jun 2021 – Oct 2021",
    highlights: [
      "Managed AWS infrastructure for cost and performance efficiency.",
      "Designed PostgreSQL schemas for optimized data retrieval.",
    ],
  },
];
