import { ChipSVG } from "~/components/Icons";
import { useNavigate } from "react-router";
import Footer from "~/components/Footer";

export default function App() {
  const navigate = useNavigate();
  return (
    <main className="flex flex-col h-screen justify-between">
      <div className="flex flex-row w-full h-full">
        {/* Left Side: Text Content */}
        <div className="flex flex-col w-full justify-center items-center md:items-start px-4 md:px-8">
          <h1 className="text-5xl font-bold text-gray-800 leading-tight text-center md:text-left">
            Innovating
            <br />
            Electronics &<br />
            IoT Solutions
          </h1>
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
    </main>
  );
}
