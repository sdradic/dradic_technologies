import SectionHeader from "./SectionHeader";
import MemberCard from "./MemberCard";

export default function AboutSection() {
  const description =
    "An Electrical and Software Engineer from Chile, specializing in embedded systems and hardware-software integration. Experienced in developing firmware for microcontrollers and real-time systems. Passionate about IoT solutions, robotics, and low-level programming using C/C++. Currently working on innovative projects combining hardware design with secure software implementations.";
  const name = "Dusan Radic";
  const title = "Founder & Lead Engineer";

  return (
    <div className="flex flex-col items-center justify-center">
      <SectionHeader title="About Us" />
      <div className="flex flex-row gap-4">
        <MemberCard description={description} name={name} title={title} />
      </div>
    </div>
  );
}
