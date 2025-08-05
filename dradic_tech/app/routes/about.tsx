import ContactForm from "~/components/ContactForm";

export default function About() {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 mt-4">
      <h1 className="text-4xl md:text-6xl font-semibold text-center pt-4 pb-8">
        About Me
      </h1>
      <div className="flex flex-col justify-center items-center md:flex-row md:justify-evenly my-8 text-center px-8 gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <img
            src="/dusan.webp"
            alt="Dradic"
            className="size-32 rounded-full"
          />
          <h2 className="text-2xl font-bold text-center md:text-left">
            Dusan Radic
          </h2>
          <p className="text-lg text-center md:text-left text-gray-500 dark:text-gray-400">
            I am an Electrical Engineer with a passion for DevOps and cloud
            technologies. I have 4+ years of experience building and deploying
            modern software solutions.
          </p>
        </div>
        <div className="flex mt-8 md:mt-0">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
