import type { Route } from "./+types/index";
import {
  ChevronRight,
  Terminal,
  Cloud,
  Network,
  Cpu,
  Settings,
  BookOpen,
  ArrowRight,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Dradic Technologies | Engineering the Future" },
    {
      name: "description",
      content:
        "Elite engineering solutions in DevOps, Cloud Architecture, IoT, and Embedded Systems for enterprises that refuse to compromise.",
    },
  ];
}

const SERVICES = [
  {
    id: "devops",
    title: "DevOps & CI/CD",
    icon: Terminal,
    description:
      "Automating high-scale software delivery with robust pipelines and container orchestration.",
    features: [
      "Jenkins/GitLab CI",
      "Kubernetes",
      "Terraform",
      "Infrastructure as Code",
    ],
  },
  {
    id: "cloud",
    title: "Cloud Solutions",
    icon: Cloud,
    description:
      "Scalable architecture design for AWS, Azure, and GCP focusing on cost and performance.",
    features: [
      "Serverless",
      "Microservices",
      "Hybrid Cloud",
      "Cost Optimization",
    ],
  },
  {
    id: "iot",
    title: "IoT & Embedded",
    icon: Cpu,
    description:
      "Bridging hardware and software with real-time systems and smart connectivity.",
    features: [
      "RTOS",
      "MQTT/CoAP",
      "Hardware Prototyping",
      "Firmware Security",
    ],
  },
  {
    id: "networks",
    title: "Network Engineering",
    icon: Network,
    description:
      "High-availability networking, SD-WAN, and enterprise security frameworks.",
    features: [
      "SDN",
      "Cisco/Juniper",
      "Network Security",
      "Latency Optimization",
    ],
  },
];

const BLOG_POSTS = [
  {
    id: 1,
    title: "The Future of Edge Computing in IoT",
    excerpt:
      "How local processing is revolutionizing data latency in industrial sensors...",
    date: "Oct 12, 2023",
    author: "Dr. Jane Dradic",
    category: "IOT",
  },
  {
    id: 2,
    title: "Scaling Kubernetes to 10k Nodes",
    excerpt:
      "Lessons learned from managing hyper-scale clusters in production environments.",
    date: "Sep 28, 2023",
    author: "Mark Sterling",
    category: "CLOUD",
  },
  {
    id: 3,
    title: "Rust vs C++ in Embedded Systems",
    excerpt:
      "Why memory safety is becoming the top priority for mission-critical hardware.",
    date: "Sep 15, 2023",
    author: "Alex Chen",
    category: "EMBEDDED",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section
        id="home"
        className="relative pt-32 pb-20 overflow-hidden w-full"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 -z-20"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-500/10 blur-[120px] rounded-full -z-10 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-full bg-purple-500/10 blur-[100px] rounded-full -z-10 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-sm font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              Next-Gen Engineering Solutions
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
              Engineering the{" "}
              <span className="text-brand-600 italic">Unbreakable</span> Future
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
              Dradic Technologies provides elite engineering solutions in
              DevOps, Cloud Architecture, IoT, and Embedded Systems for
              enterprises that refuse to compromise.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg hover:shadow-brand-500/25 flex items-center gap-2 cursor-pointer"
              >
                Get in Touch <ChevronRight className="w-5 h-5" />
              </button>
              <a
                href="/#insights"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("insights")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 border border-slate-300 dark:border-slate-800 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all dark:text-white inline-flex items-center gap-2"
              >
                Read Insights
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="glass border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-2xl float">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  ~/dradic-core/arch_viewer.sh
                </div>
              </div>
              <div className="space-y-4 font-mono text-sm">
                <div className="flex gap-2">
                  <span className="text-green-500">$</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    init-cluster --region us-east-1
                  </span>
                </div>
                <div className="pl-4 text-slate-500">
                  Initializing control plane... [OK]
                  <br />
                  Deploying IoT Edge Nodes... [OK]
                  <br />
                  Synchronizing Embedded Hubs... [OK]
                  <br />
                </div>
                <div className="flex gap-2">
                  <span className="text-brand-500">➜</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    deploy --env production
                  </span>
                </div>
                <div className="text-brand-500 animate-pulse">
                  Running architectural analysis...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-20 bg-gray-50 dark:bg-slate-900 w-full"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">
              Deep Technical Expertise
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              We specialize in the complex layers of modern infrastructure and
              hardware development.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  className="glass group border border-slate-200 dark:border-slate-800 p-8 rounded-2xl hover:border-brand-500 transition-all hover:-translate-y-2"
                >
                  <div className="mb-6 bg-brand-100 dark:bg-brand-900/20 w-fit p-4 rounded-xl group-hover:bg-brand-500 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-brand-500 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    {s.description}
                  </p>
                  <ul className="space-y-2">
                    {s.features.map((f) => (
                      <li
                        key={f}
                        className="text-xs font-medium flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About/Why Section */}
      <section id="about" className="py-20 bg-white dark:bg-slate-950 w-full">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square">
            <div className="absolute inset-0 bg-brand-600 rounded-3xl rotate-3 opacity-10"></div>
            <div className="absolute inset-0 border-2 border-slate-300 dark:border-slate-800 rounded-3xl -rotate-3"></div>
            <div className="relative h-full w-full glass rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center">
              <div className="text-center space-y-4 p-12">
                <Settings
                  className="w-20 h-20 mx-auto text-brand-600"
                  style={{ animation: "spin 20s linear infinite" }}
                />
                <h4 className="text-4xl font-black">5+ Years</h4>
                <p className="text-slate-500 dark:text-slate-400">
                  Of combined engineering excellence across global sectors.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Why Dradic Technologies?</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We started with a simple mission: to handle the engineering tasks
              that others find too daunting. Whether it&apos;s porting legacy
              firmware to modern RTOS, optimizing multi-cloud costs, or
              designing secure global networks, our team has seen and solved it
              all.
            </p>
            <div className="space-y-4">
              {[
                "Unmatched expertise in cross-disciplinary domains.",
                "Security-first approach in every line of code and hardware design.",
                "Agile, transparent, and results-driven methodologies.",
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="mt-1 bg-green-500/20 text-green-600 p-1 rounded">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section
        id="insights"
        className="py-20 bg-gray-50 dark:bg-slate-900 w-full"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Engineering Insights</h2>
              <p className="text-slate-500 dark:text-slate-400">
                Latest thoughts from our lead engineers.
              </p>
            </div>
            <Link
              to="/blog"
              className="hidden md:flex items-center gap-2 text-brand-600 font-bold hover:underline"
            >
              All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.id}
                className="group glass border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all"
              >
                <div className="h-48 bg-slate-200 dark:bg-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <BookOpen className="w-12 h-12 text-slate-400" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs font-semibold text-brand-600 mb-3 uppercase tracking-wider">
                    {post.category}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-brand-500 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-400">{post.date}</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {post.author}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 md:hidden text-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-brand-600 font-bold"
            >
              View All Posts <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section - Let's Build It */}
      <section id="contact" className="py-20 bg-white dark:bg-slate-950 w-full">
        <div className="max-w-4xl mx-auto px-6">
          <div className="glass border border-slate-200 dark:border-slate-800 rounded-3xl p-10 md:p-14 shadow-xl">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">
                  Let&apos;s Build It.
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Ready to scale? Have a technical bottleneck? Reach out and
                  we&apos;ll engineer the solution.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-100 dark:bg-brand-900/20 p-3 rounded-xl">
                      <Mail className="w-6 h-6 text-brand-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Email Us
                      </div>
                      <a
                        href="mailto:hello@dradic.tech"
                        className="text-lg font-semibold hover:text-brand-600 transition-colors"
                      >
                        hello@dradic.tech
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-100 dark:bg-brand-900/20 p-3 rounded-xl">
                      <MessageSquare className="w-6 h-6 text-brand-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Live Chat
                      </div>
                      <div className="text-lg font-semibold">
                        Mon - Fri, 9am - 6pm EST
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      required
                    />
                  </div>
                  <div>
                    <select
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                      required
                    >
                      <option value="">Select Service</option>
                      <option value="devops">DevOps & CI/CD</option>
                      <option value="cloud">Cloud Solutions</option>
                      <option value="iot">IoT & Embedded</option>
                      <option value="network">Network Engineering</option>
                    </select>
                  </div>
                  <div>
                    <textarea
                      placeholder="Project details..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Dispatch Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
