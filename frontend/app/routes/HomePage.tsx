import { ChipSVG } from "~/components/Icons";
import { useNavigate } from "react-router";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import SectionHeader from "~/components/SectionHeader";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="inverse-gradient-background min-h-screen flex flex-col justify-between">
      <Navbar />
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col w-full justify-center items-center md:items-start px-4 md:px-8">
          <SectionHeader
            title="Innovating Electronics & IoT Solutions"
            className="text-center md:text-left"
          />
          <p className="text-lg text-gray-50 text-wrap text-center md:text-left">
            We specialize in cutting-edge embedded systems and technology.
          </p>
          <button
            onClick={() => navigate("/about")}
            className="btn-primary mt-4"
          >
            Learn More
          </button>
        </div>
        {/* Right Side: Chip SVG Illustration */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <ChipSVG className="w-96 h-96" />
        </div>
      </div>
      <Footer />
    </div>
  );
}
