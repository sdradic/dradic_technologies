import ContactForm from "~/components/ContactForm";

const dusanImage =
  "https://aorsaqycwhnsrutvqtdx.supabase.co/storage/v1/object/sign/dradic-public-assets/blog-images/dusan.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81N2MyMzZkNi0xZDEyLTQ3OTYtOTljNi0yM2MyNjhjYmQ2MmYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkcmFkaWMtcHVibGljLWFzc2V0cy9ibG9nLWltYWdlcy9kdXNhbi5qcGVnIiwiaWF0IjoxNzUyNDk5Mzg4LCJleHAiOjE3ODQwMzUzODh9.e9rxea7Za7UlX6QRCIIl8VARFPu-qDWEAEhUVbC9mQI";
export default function About() {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-semibold text-center mt-12">About Me</h1>
      <div className="flex flex-col justify-center items-center md:flex-row md:justify-evenly my-8 text-center px-8 gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <img src={dusanImage} alt="Dradic" className="size-32 rounded-full" />
          <h2 className="text-2xl font-bold text-center md:text-left">
            Dusan Radic
          </h2>
          <p className="text-lg text-center md:text-left text-gray-500 dark:text-gray-400">
            I am an Electrical Engineer with a passion for embedded systems and
            programming. I have 4+ years of experience as a software engineer.
          </p>
          <p className="text-lg text-center md:text-left text-gray-500 dark:text-gray-400">
            Take a look at my projects and experience at{" "}
            <a
              href="https://dradic.cl"
              className="text-primary-500 dark:text-primary-400 underline"
            >
              dradic.cl
            </a>
          </p>
        </div>
        <div className="flex mt-8 md:mt-0">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
