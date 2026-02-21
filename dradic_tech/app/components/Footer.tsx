import { useState } from "react";
import { useLocation, Link } from "react-router";
import { handleSubscribe } from "~/modules/utils";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const [userEmail, setUserEmail] = useState<string>("");
  const location = useLocation();
  const isBlog = location.pathname.startsWith("/blog");

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      window.location.href = `/#${sectionId}`;
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <footer className="bg-slate-900 text-slate-400 py-16 md:py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 md:gap-8">
            <div className="md:w-1/3">
              <Link to="/" className="flex items-center gap-3 mb-6 group">
                <div className="bg-brand-600 text-white p-2 rounded text-lg font-black group-hover:rotate-15 transition-transform duration-300">
                  DR
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold uppercase text-lg">
                    Dradic
                  </span>
                  <span className="text-xs text-slate-500">Technologies</span>
                </div>
              </Link>
              <p className="text-sm mb-6 leading-relaxed">
                High-performance engineering solutions for the modern world.
                Specializing in DevOps and Cloud Architecture.
                {/* Specializing in DevOps, Cloud, IoT, and Embedded Systems. */}
              </p>
              <div className="flex gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-500 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-500 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="mailto:contact@dradic.tech"
                  className="hover:text-brand-500 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-white font-bold mb-4 md:mb-6 uppercase text-xs tracking-widest">
                  Navigation
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <button
                      onClick={() => scrollToSection("home")}
                      className="hover:text-brand-500 transition-colors text-left cursor-pointer"
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("services")}
                      className="hover:text-brand-500 transition-colors text-left cursor-pointer"
                    >
                      Services
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("about")}
                      className="hover:text-brand-500 transition-colors text-left cursor-pointer"
                    >
                      About
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("insights")}
                      className="hover:text-brand-500 transition-colors text-left cursor-pointer"
                    >
                      Insights
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("contact")}
                      className="hover:text-brand-500 transition-colors text-left cursor-pointer"
                    >
                      Contact
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4 md:mb-6 uppercase text-xs tracking-widest">
                  Services
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <button
                      onClick={() => scrollToSection("services")}
                      className="hover:text-brand-500 transition-colors cursor-pointer text-left"
                    >
                      DevOps & CI/CD
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("services")}
                      className="hover:text-brand-500 transition-colors cursor-pointer text-left"
                    >
                      Cloud Solutions
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("services")}
                      className="hover:text-brand-500 transition-colors cursor-pointer text-left"
                    >
                      IoT & Embedded
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("services")}
                      className="hover:text-brand-500 transition-colors cursor-pointer text-left"
                    >
                      Network Engineering
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4 md:mb-6 uppercase text-xs tracking-widest">
                  Company
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      to="/team"
                      className="hover:text-brand-500 transition-colors"
                    >
                      Team
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blog"
                      className="hover:text-brand-500 transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/portfolio"
                      className="hover:text-brand-500 transition-colors"
                    >
                      Portfolio
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-slate-800">
            <div className="max-w-xl mx-auto text-center space-y-4">
              <h4 className="text-white font-bold uppercase text-xs tracking-widest">
                Newsletter
              </h4>
              <p className="text-sm">
                Get quarterly engineering reports in your inbox.
              </p>

              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-500"
                />
                <button
                  onClick={() => {
                    handleSubscribe(userEmail);
                    setUserEmail("");
                  }}
                  className="px-6 py-3 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors cursor-pointer"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-4 pt-2">
          <p className="text-center text-xs tracking-wide">
            &copy; {new Date().getFullYear()} Dradic Technologies. All rights
            reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
