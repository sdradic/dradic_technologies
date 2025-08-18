import ContactForm from "~/components/ContactForm";

export default function Contact() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <h1 className="text-4xl sm:text-6xl font-semibold text-center pt-2">
        Contact us
      </h1>
      <div className="flex flex-col items-center justify-center gap-4 w-full">
        <ContactForm />
      </div>
    </div>
  );
}
