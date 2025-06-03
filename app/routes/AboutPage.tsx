import Footer from "~/components/Footer";
import MemberCard from "~/components/MemberCard";
import Navbar from "~/components/Navbar";
import SectionHeader from "~/components/SectionHeader";

export default function AboutPage() {
  const description =
    "Electrical and Software Engineer specializing in embedded systems, IoT, and hardware-software integration. Experienced in firmware development and real-time systems, with expertise in C/C++ programming.";
  const name = "Dusan Radic";
  const title = "Founder & Lead Engineer";
  return (
    <div className="inverse-gradient-background min-h-screen flex flex-col justify-between">
      <Navbar />
      <div className="flex flex-col md:flex-row justify-center items-center py-12 max-w-6xl mx-auto">
        <div className="flex flex-col text-center md:text-left w-full px-4 md:px-8">
          <SectionHeader title="About Us" />
          <p className="text-lg text-gray-700 leading-relaxed">
            At Dradic Technologies, we solve real-world challenges by
            integrating hardware and software solutions. We create impactful
            innovations by combining cutting-edge technology with practical
            applications.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mt-4">
            With expertise in embedded systems, IoT, and custom hardware, we
            tackle complex problems holistically. Our deep knowledge of hardware
            and software allows us to build efficient, scalable solutions that
            make a difference across industries.
          </p>
        </div>
        <div className="flex flex-col md:mt-0 mt-12 px-4 md:px-8">
          <div className="flex flex-wrap gap-8 justify-center">
            <MemberCard
              description={description}
              name={name}
              title={title}
              image="/dusan.jpeg"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
