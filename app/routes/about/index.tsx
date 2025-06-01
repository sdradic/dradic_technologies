import MemberCard from "~/components/MemberCard";

export default function AboutPage() {
  const description =
    "An Electrical and Software Engineer from Chile, specializing in embedded systems and hardware-software integration. Experienced in developing firmware for microcontrollers and real-time systems. Passionate about IoT solutions, robotics, and low-level programming using C/C++. Currently working on innovative projects combining hardware design with secure software implementations.";
  const name = "Dusan Radic";
  const title = "Founder & Lead Engineer";
  return (
    <div className="flex flex-col min-h-full justify-center items-center">
      <div className="text-center max-w-3xl">
        <p className="text-lg text-gray-700 leading-relaxed">
          At Dradic Technologies, we solve real-world challenges by integrating
          hardware and software solutions. We create impactful innovations by
          combining cutting-edge technology with practical applications.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mt-4">
          With expertise in embedded systems, IoT, and custom hardware, we
          tackle complex problems holistically. Our deep knowledge of hardware
          and software allows us to build efficient, scalable solutions that
          make a difference across industries.
        </p>
      </div>
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Our Team</h2>
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
  );
}
