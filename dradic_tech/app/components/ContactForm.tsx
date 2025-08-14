import { useState } from "react";

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
  };
  return (
    <div className="flex flex-col gap-4 w-full bg-gray-50 dark:bg-dark-400 rounded-xl border border-gray-200 dark:border-gray-700 px-2 py-4 max-w-96">
      <h1 className="text-2xl font-bold text-center text-gray-700 dark:text-gray-300">
        Contact Me
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="font-medium text-gray-700 dark:text-gray-300 text-left ml-4"
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
            className="font-medium text-gray-700 dark:text-gray-300 text-left ml-4"
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
            className="font-medium text-gray-700 dark:text-gray-300 text-left ml-4"
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
