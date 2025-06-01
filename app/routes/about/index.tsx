import Footer from "~/components/Footer";
import MemberCard from "~/components/MemberCard";
import SectionHeader from "~/components/SectionHeader";

export default function AboutPage() {
  const description =
    "An Electrical and Software Engineer from Chile, specializing in embedded systems and hardware-software integration. Experienced in developing firmware for microcontrollers and real-time systems. Passionate about IoT solutions, robotics, and low-level programming using C/C++. Currently working on innovative projects combining hardware design with secure software implementations.";
  const name = "Dusan Radic";
  const title = "Founder & Lead Engineer";
  return (
    <div className="flex flex-col h-screen justify-between">
      <main className="flex flex-col md:flex-row h-full w-full max-w-7xl mx-auto justify-center items-center px-4 pt-24">
        <div className="flex flex-col text-center md:text-left w-full">
          <SectionHeader title="About Dradic Technologies" />
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
        {/* <div className="flex flex-col mt-8 md:mt-0">
          <div className="flex flex-wrap gap-8 justify-center">
            <MemberCard
              description={description}
              name={name}
              title={title}
              image="/dusan.jpeg"
            />
          </div>
        </div> */}
      </main>
      <Footer />
    </div>
  );
}
