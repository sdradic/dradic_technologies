import type { FormEvent } from "react";

interface UserContact {
  name: string;
  email: string;
  phone: number;
}
export default function ContactForm() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    console.log(e);
  };
  return (
    <div className="flex items-center justify-center sm:px-2 px-8 max-h-screen">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg">
        <div>
          <div className="flex flex-col items-center justify-center gap-1 mt-2">
            <h3 className="text-gray-500 dark:text-gray-400 mb-8">
              Give us the following details and we'll contact you shortly
            </h3>
          </div>
        </div>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          <div className="flex flex-col gap-6">
            <div>
              <label htmlFor="Full Name" className="">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="name"
                required
                className="relative border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="Phone" className="">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="phone"
                required
                className="relative border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700"
                placeholder="Phone"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
