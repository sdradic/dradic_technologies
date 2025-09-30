import { useState } from "react";
import { Dropdown } from "./Dropdown";
import { DradicTechLogo, XIcon } from "./Icons";
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
    <div className="flex flex-col gap-4 w-full p-4 max-w-96">
      <div className="flex items-center justify-center w-full">
        <div className="flex items-center cursor-pointer ml-auto">
          <DradicTechLogo className="h-18 stroke-4 stroke-primary-500 dark:stroke-primary-500" />
          <div className="flex items-center">
            <div className="h-0.5 w-8 bg-primary-500 rounded-full rotate-90" />
            <div className="flex flex-col">
              <span className="text-2xl font-semibold">Dradic</span>
              <span className="text-sm text-gray-500">Technologies</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setContactModalOpen(false)}
          aria-label="Close contact form"
          className="cursor-pointer ml-auto pr-4"
        >
          <XIcon className="w-8 h-8 stroke-gray-400 dark:stroke-gray-500 hover:stroke-primary-400 dark:hover:stroke-primary-500" />
        </button>
      </div>
      <p className="text-center text-gray-700 dark:text-gray-300">
        Please let us know the reason for your inquiry and which service you are
        interested in.
      </p>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="service"
            className="font-semibold text-gray-700 dark:text-gray-300 text-left ml-2"
          >
            Service
          </label>
          <Dropdown
            id="service"
            data={["Cloud Solutions", "DevOps", "Software"]}
            defaultValue={service}
            onChange={(value) => setService(value)}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="font-semibold text-gray-700 dark:text-gray-300 text-left ml-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="font-semibold text-gray-700 dark:text-gray-300 text-left ml-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="message"
            className="font-semibold text-gray-700 dark:text-gray-300 text-left ml-2"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Enter your message"
            rows={4}
            className="resize-none w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          Send Message
        </button>
      </form>
    </div>
  );
}
