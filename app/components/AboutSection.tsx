import SectionHeader from "./SectionHeader";

export default function AboutSection() {
  return (
    <div>
      <SectionHeader title="About Us" />
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="flex flex-col border border-primary-500 rounded-lg p-6 bg-white justify-center items-center gap-4">
            <img
              src="/public/dusan.jpeg"
              alt="Srdjan Radic"
              className="w-24 h-24 rounded-full"
            />
            <h3 className="text-xl font-bold mb-2">Srdjan Radic</h3>
            <h4 className="text-gray-600 mb-4">Founder & Lead Engineer</h4>
            <p className="text-gray-700">
              An Electrical and Software Engineer from Chile, specializing in
              embedded systems and hardware-software integration. Experienced in
              developing firmware for microcontrollers and real-time systems.
              Passionate about IoT solutions, robotics, and low-level
              programming using C/C++. Currently working on innovative projects
              combining hardware design with secure software implementations.
            </p>
          </div>
          {/* Additional team members can be added here following the same pattern */}
        </div>
      </div>
    </div>
  );
}
