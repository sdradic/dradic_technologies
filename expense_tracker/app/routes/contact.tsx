import { HeaderControls } from "~/components/HeaderControls";

export default function Contact() {
  return (
    <div className="space-y-8">
      <HeaderControls />
      <div className="card-fintrack p-8">
        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-2 flex items-center gap-2">
          <svg
            className="w-6 h-6 text-primary-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Contact us
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Get in touch with the team.
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          Contact form or details can be added here.
        </p>
      </div>
    </div>
  );
}
