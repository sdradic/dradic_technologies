import ContactForm from "~/components/ContactForm";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import SectionHeader from "~/components/SectionHeader";

export default function ContactPage() {
  return (
    <div className="inverse-gradient-background min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col max-w-6xl mx-auto px-4 my-auto">
        <SectionHeader title="Contact us" className="text-center pt-12" />
        <ContactForm />
      </div>
      <Footer />
    </div>
  );
}
