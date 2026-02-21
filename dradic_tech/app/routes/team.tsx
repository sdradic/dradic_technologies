import { useState } from "react";
import { downloadFileFromBackend } from "~/modules/apis";
import LanguageToggle from "~/components/LanguageToggle";

interface Experience {
  company: string;
  location: string;
  roles: Role[];
  overallPeriod: string;
  highlights?: string[];
}

interface Role {
  title: string;
  period?: string;
  highlights?: string[];
}

export default function Team() {
  const [cvLang, setCvLang] = useState<"EN" | "ES">("EN");
  const filename =
    cvLang === "ES" ? "Dusan_Radic_CV_es.pdf" : "Dusan_Radic_CV.pdf";

  const handleCvDownload = async () => {
    await downloadFileFromBackend(filename);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <h1 className="text-4xl sm:text-6xl font-extrabold text-center pt-2 text-slate-900 dark:text-white">
        About Me
      </h1>
      {/* About Me */}
      <div className="flex flex-col items-center justify-center gap-4">
        <img
          src="/assets/dusan.webp"
          alt="Dradic"
          className="size-42 md:size-48 rounded-full border-2 border-slate-300 dark:border-slate-800"
        />
        <h2 className="text-2xl font-bold text-center md:text-left text-slate-800 dark:text-slate-100">
          Dusan Radic
        </h2>
        <p className="text-lg text-center md:text-left text-slate-600 dark:text-slate-400 leading-relaxed">
          DevOps Lead and Distributed Systems Engineer with 5+ years of
          experience designing, securing, and scaling cloud-native and
          event-driven systems on AWS. Strong expertise in CI/CD architecture,
          infrastructure as code, observability, cost optimization, and secure
          pipeline design for regulated workloads. Background in Electrical
          Engineering and Bioinformatics, applying systems thinking to
          production-grade cloud platforms.
        </p>
      </div>
      {/* Download CV with Language Toggle (above the button) */}
      <div className="flex flex-col items-center gap-2 w-full max-w-48 mx-auto">
        <button
          className="w-full px-8 py-3 border border-brand-600 dark:border-brand-500 rounded-xl font-bold bg-brand-600 text-white hover:bg-brand-700 transition-all cursor-pointer"
          onClick={handleCvDownload}
          type="button"
        >
          Download CV
        </button>
        <LanguageToggle value={cvLang} onChange={setCvLang} />
      </div>
      {/* Experience */}
      <div className="flex flex-col gap-6 pb-8">
        <h2 className="text-2xl font-bold text-center md:text-left mb-2 text-slate-900 dark:text-white">
          Experience
        </h2>
        <div className="flex flex-col gap-6">
          {experience.map((company) => (
            <div
              key={company.company}
              className="glass bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md p-6 transition-all hover:shadow-brand-500/25 hover:border-brand-500"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h3 className="text-xl font-bold text-brand-600 dark:text-brand-400">
                    {company.company}
                  </h3>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {company.location}
                  </span>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                  {company.overallPeriod}
                </span>
              </div>
              <div className="flex flex-col gap-1 mb-2">
                {company.roles.map((role, idx) => (
                  <div
                    key={role.title + idx}
                    className="flex flex-col sm:items-center sm:gap-2"
                  >
                    <div className="flex flex-row justify-between items-center sm:gap-2 w-full">
                      <span className="font-medium text-slate-800 dark:text-slate-200 text-left">
                        {role.title}
                      </span>
                      {role.period && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {role.period}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-row sm:items-center sm:gap-2 w-full">
                      <ul className="list-disc list-inside pl-2 text-slate-700 dark:text-slate-200 text-sm space-y-1">
                        {role.highlights?.map((highlight, idx) => (
                          <li
                            key={idx}
                            className="list-disc list-inside pl-2 text-slate-700 dark:text-slate-200 text-sm space-y-1"
                          >
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              <ul className="list-disc list-inside pl-2 text-slate-700 dark:text-slate-200 text-sm space-y-1">
                {company.highlights?.map((highlight, idx) => (
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

// Experience data with full detail adapted from provided description
const experience: Experience[] = [
  {
    company: "Moder",
    location: "United States",
    roles: [
      {
        title: "Lead DevOps Engineer",
        period: "Jan 2026 – Present",
        highlights: [
          "Promoted to Lead DevOps Engineer based on ownership of CI/CD pipelines and infrastructure reliability.",
          "Led design and implementation of AgentCore-based CI/CD pipelines for loans and mortgage platforms.",
          "Owned infrastructure as code, deployment automation, and environment standardization across regulated financial workloads.",
          "Designed secure pipeline execution using OIDC-based role assumption, ephemeral credentials, and least-privilege IAM policies.",
          "Established observability and alerting standards for pipeline failures and runtime regressions.",
          "Collaborated with backend and product teams to improve release safety, rollback strategies, and deployment velocity.",
        ],
      },
      {
        title: "DevOps Engineer",
        period: "Nov 2025 – Jan 2026",
        highlights: [
          "Owned CI/CD pipeline implementation and infrastructure automation for financial workloads.",
          "Standardized environments and improved deployment consistency across teams.",
          "Strengthened IAM and secure role assumption practices within delivery pipelines.",
        ],
      },
    ],
    overallPeriod: "Nov 2025 – Present",
  },
  {
    company: "SwiftCX",
    location: "United States",
    roles: [
      {
        title: "Lead DevOps Engineer",
        period: "Jun 2025 – Sep 2025",
        highlights: [
          "Transitioned from Software Engineer to DevOps Lead, owning CI/CD pipelines, infrastructure standards, and platform reliability.",
          "Architected AWS Lambda cost attribution and monitoring systems with per-customer visibility and anomaly detection.",
          "Built event-driven error monitoring platform with automated classification, deduplication, and Slack alerting.",
          "Optimized Lambda workloads via memory tuning and execution profiling, reducing timeouts and runtime costs.",
          "Led infrastructure provisioning using AWS CDK and implemented automated testing and deployment workflows.",
        ],
      },
      {
        title: "Software Engineer",
        period: "Mar 2023 – Jun 2025",
        highlights: [
          "Developed transcription automation tool for Zendesk voice messages, improving operational efficiency.",
          "Integrated external web applications into core platform services.",
          "Re-engineered chatbot architecture for improved scalability and traffic handling.",
          "Refactored legacy systems and implemented automated testing frameworks to increase reliability.",
          "Automated AWS resource provisioning using Cloud Development Kit (CDK).",
        ],
      },
    ],
    overallPeriod: "Mar 2023 – Sep 2025",
  },
  {
    company: "Deloitte Consulting",
    location: "Santiago, Chile",
    roles: [
      {
        title: "Data Engineer",
        period: "Mar 2022 – Mar 2023",
        highlights: [
          "Designed and implemented scalable ETL pipelines using PySpark on AWS (S3, Lambda, Redshift).",
          "Deployed data workloads using Docker to ensure consistent multi-environment delivery.",
          "Built production-grade data pipelines supporting analytics and reporting workloads.",
        ],
      },
    ],
    overallPeriod: "Mar 2022 – Mar 2023",
  },
  {
    company: "Ministerio de Economía, Fomento y Turismo",
    location: "Santiago, Chile",
    roles: [
      {
        title: "Software Engineer",
        period: "Sep 2021 – Mar 2022",
        highlights: [
          "Developed backend systems using Django and frontend components with Vue.js.",
          "Applied AWS security best practices to protect sensitive government data.",
          "Automated infrastructure provisioning using Ansible and serverless architectures.",
          "Deployed containerized applications using Docker across environments.",
        ],
      },
    ],
    overallPeriod: "Sep 2021 – Mar 2022",
  },
  {
    company: "Artificial Intelligence Solutions",
    location: "Santiago, Chile",
    roles: [
      {
        title: "Backend Engineer",
        period: "Jun 2021 – Oct 2021",
        highlights: [
          "Configured and managed AWS cloud infrastructure for backend systems.",
          "Designed optimized PostgreSQL schemas to improve data retrieval performance.",
          "Containerized backend services using Docker to enhance portability and deployment consistency.",
        ],
      },
    ],
    overallPeriod: "Jun 2021 – Oct 2021",
  },
];
