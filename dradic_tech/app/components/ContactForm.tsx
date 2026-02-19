import { useState } from "react";
import { Dropdown } from "./Dropdown";
import { XIcon } from "./Icons";
import { X } from "lucide-react";

export default function ContactForm({
  setContactModalOpen,
}: {
  setContactModalOpen: (value: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [service, setService] = useState("Cloud Solutions");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setContactModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full p-6 max-w-md">
      <div className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-brand-600 text-white p-1 rounded text-sm font-black">
            DR
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold">Dradic</span>
            <span className="text-xs text-gray-500">Technologies</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setContactModalOpen(false)}
          aria-label="Close contact form"
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-gray-400 dark:text-gray-500 hover:text-brand-500" />
        </button>
      </div>
      <p className="text-center text-slate-600 dark:text-slate-400">
        Please let us know the reason for your inquiry and which service you are
        interested in.
      </p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="service"
            className="font-semibold text-slate-700 dark:text-slate-300 text-left text-sm"
          >
            Service
          </label>
          <Dropdown
            id="service"
            data={[
              "Cloud Solutions",
              "DevOps & CI/CD",
              "IoT & Embedded",
              "Network Engineering",
            ]}
            defaultValue={service}
            onChange={(value) => setService(value)}
            className="w-full border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-dark-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="font-semibold text-slate-700 dark:text-slate-300 text-left text-sm"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            className="w-full border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-dark-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="font-semibold text-slate-700 dark:text-slate-300 text-left text-sm"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="w-full border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-dark-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="message"
            className="font-semibold text-slate-700 dark:text-slate-300 text-left text-sm"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Enter your message"
            rows={4}
            className="resize-none w-full border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-dark-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          />
        </div>
        <button type="submit" className="btn-primary mt-2" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
