import type { Route } from "./+types/index";
import { useState } from "react";
import {
  ChevronRight,
  Terminal,
  Cloud,
  Network,
  Cpu,
  Settings,
  ArrowRight,
  Mail,
  Calendar,
  Clock,
} from "lucide-react";
import { Link } from "react-router";
import { Dropdown } from "~/components/Dropdown";
import React from "react";

// Lazy-load PostList and its skeleton loader
const PostList = React.lazy(() => import("~/components/PostList"));

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Dradic Technologies | Engineering the Future" },
    {
      name: "description",
      content:
        "Elite engineering solutions in DevOps and Cloud Architecture for enterprises that refuse to compromise.",
    },
  ];
}

type Service = {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  features: string[];
  comingSoon: boolean;
  progress?: number;
  earlyAccess?: string;
  partners?: string[];
};

const SERVICES: Service[] = [
  {
    id: "devops",
    title: "Advanced DevOps & Pipeline Automation",
    icon: Terminal,
    description:
      "Enterprise-grade CI/CD automation with intelligent pipelines and scalable container orchestration.",
    features: [
      "Jenkins/GitLab CI",
      "Kubernetes",
      "Terraform",
      "Infrastructure as Code",
    ],
    comingSoon: false,
    partners: ["GitLab", "GitHub", "Docker"],
  },
  {
    id: "cloud",
    title: "Strategic Cloud Architecture & Optimization",
    icon: Cloud,
    description:
      "Multi-cloud excellence with intelligent cost optimization and performance-driven architecture design.",
    features: [
      "Serverless",
      "Microservices",
      "Hybrid Cloud",
      "Cost Optimization",
    ],
    comingSoon: false,
    partners: ["AWS", "Azure", "GCP"],
  },
  {
    id: "iot",
    title: "Smart Connectivity & Edge Intelligence",
    icon: Cpu,
    description:
      "Real-time edge computing with intelligent connectivity and embedded systems integration.",
    features: [
      "Edge Computing",
      "Real-time Analytics",
      "MQTT/CoAP",
      "Hardware Prototyping",
    ],
    comingSoon: true,
    progress: 75,
    earlyAccess: "Join the waitlist for a free pre-launch architecture audit",
    partners: ["NVIDIA Inception", "AWS IoT Partner", "Arm Ecosystem"],
  },
  {
    id: "networks",
    title: "Mission-Critical Embedded Systems",
    icon: Network,
    description:
      "Mission-critical embedded systems with RTOS expertise and hardware-level security.",
    features: [
      "RTOS Porting",
      "Hardware Security",
      "Firmware Development",
      "System Integration",
    ],
    comingSoon: true,
    progress: 60,
    earlyAccess: "Early access partners receive 20% off first-year maintenance",
    partners: ["NVIDIA Inception", "AWS IoT Partner", "Arm Ecosystem"],
  },
];

export default function Home() {
  const [selectedService, setSelectedService] = useState("");
  const [waitlistEmails, setWaitlistEmails] = useState<Record<string, string>>(
    {},
  );
  const [submittedServices, setSubmittedServices] = useState<Set<string>>(
    new Set(),
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showTimeSelection, setShowTimeSelection] = useState(false);

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const date = new Date(d);
      const isCurrentMonth = date.getMonth() === currentMonth;
      const isWeekday = date.getDay() >= 1 && date.getDay() <= 5;
      const isPast =
        date < today && date.toDateString() !== today.toDateString();
      const isToday = date.toDateString() === today.toDateString();

      days.push({
        date: date.toISOString().split("T")[0],
        day: date.getDate(),
        isCurrentMonth,
        isWeekday,
        isPast,
        isToday,
        isSelected: selectedDate === date.toISOString().split("T")[0],
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Available time slots (9am - 6pm CLT, 30-minute blocks)
  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
  ];

  const handleJoinWaitlist = (serviceId: string) => {
    const email = waitlistEmails[serviceId];
    if (!email?.trim() || submittedServices.has(serviceId)) return;

    // Here you would typically send this to your backend
    console.log(`Joining waitlist for ${serviceId} with email: ${email}`);

    setSubmittedServices((prev) => new Set(prev).add(serviceId));
    setWaitlistEmails((prev) => ({ ...prev, [serviceId]: "" }));
  };

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
              Dradic Technologies provides elite engineering solutions in DevOps
              and Cloud Architecture for enterprises that refuse to compromise.
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
                  ~/dradic-core/
                </div>
              </div>
              <div className="space-y-4 font-mono text-sm">
                <div className="flex gap-2">
                  <span className="text-green-500">$</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    terraform apply -auto-approve
                  </span>
                </div>
                <div className="pl-4 text-slate-500">
                  module.eks.cluster... Creating...
                  <br />
                  module.eks.node_group... [OK]
                  <br />
                  aws_lb.web... [OK]
                  <br />
                </div>
                <div className="flex gap-2">
                  <span className="text-brand-500">➜</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    gh workflow run deploy.yml --ref main
                  </span>
                </div>
                <div className="text-brand-500 animate-pulse">
                  Running CI pipeline...
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
              We specialize in DevOps and Cloud—the foundation of modern
              infrastructure.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {SERVICES.filter((s) => !s.comingSoon).map((s) => {
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
          <div className="mt-12 pt-12 border-t border-slate-200 dark:border-slate-700">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">
                Expanding Our Expertise
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                We&apos;re actively developing new capabilities to serve your
                growing needs.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {SERVICES.filter((s) => s.comingSoon).map((s) => {
                const Icon = s.icon;
                const isSubmitted = submittedServices.has(s.id);
                return (
                  <div
                    key={s.id}
                    className="relative group glass border border-slate-200 dark:border-slate-800 rounded-2xl p-8 hover:border-brand-500 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-500/20"
                  >
                    {/* Progress Circle */}
                    <div className="absolute top-4 right-4 w-16 h-16 flex flex-col items-center">
                      <div className="relative w-14 h-14">
                        <svg className="w-14 h-14 transform -rotate-90">
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-slate-200 dark:text-slate-700"
                          />
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 24}`}
                            strokeDashoffset={`${2 * Math.PI * 24 * (1 - s.progress! / 100)}`}
                            className="text-brand-500 transition-all duration-1000 ease-out"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
                            {s.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                        Development
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="mb-6 bg-brand-100 dark:bg-brand-900/20 w-fit p-4 rounded-xl group-hover:bg-brand-500 transition-colors duration-300">
                      <Icon className="w-12 h-12 text-brand-500 group-hover:text-white transition-colors duration-300" />
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {s.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {s.description}
                      </p>

                      {/* Features */}
                      <ul className="space-y-2 mb-6">
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

                      {/* Early Access Incentive */}
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              !
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                            Early Access Benefit
                          </span>
                        </div>
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          {s.earlyAccess}
                        </p>
                      </div>

                      {/* Email Input */}
                      {isSubmitted ? (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4 text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                              You&apos;re on the waitlist!
                            </span>
                          </div>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            We&apos;ll notify you as soon as this service
                            launches.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <input
                            type="email"
                            placeholder="Enter your email for early access..."
                            value={waitlistEmails[s.id] || ""}
                            onChange={(e) =>
                              setWaitlistEmails((prev) => ({
                                ...prev,
                                [s.id]: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                          />
                          <button
                            onClick={() => handleJoinWaitlist(s.id)}
                            disabled={!waitlistEmails[s.id]?.trim()}
                            className="w-full px-6 py-3 rounded-xl bg-brand-600 text-white hover:bg-brand-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 transition-colors font-semibold disabled:cursor-not-allowed cursor-pointer"
                          >
                            Join Waitlist
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
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
              that others find too daunting. Whether it&apos;s building
              bulletproof CI/CD pipelines, optimizing multi-cloud costs, or
              scaling infrastructure with code, our team has seen and solved it
              all.
            </p>
            <div className="space-y-4">
              {[
                "Unmatched expertise in DevOps and cloud-native architecture.",
                "Security-first approach in every line of code and infrastructure design.",
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
          <React.Suspense
            fallback={
              <div className="grid md:grid-cols-3 gap-8">
                {/* Try to use PostList.Skeleton if exported, else fallback to a simple skeleton */}
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                  >
                    <div className="animate-pulse flex flex-col">
                      <div className="h-48 bg-slate-300 dark:bg-slate-800 rounded-t-2xl"></div>
                      <div className="p-6 space-y-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-100 dark:bg-slate-900 rounded w-1/2"></div>
                        <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                          <div className="h-3 w-12 bg-slate-100 dark:bg-slate-900 rounded"></div>
                          <div className="h-3 w-20 bg-slate-100 dark:bg-slate-900 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <PostList max={3} layout="row" reloadTrigger={0} />{" "}
            {/* row layout and only 3 posts */}
          </React.Suspense>
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
                        href="mailto:contact@dradic.cl"
                        className="text-lg font-semibold hover:text-brand-600 transition-colors"
                      >
                        contact@dradic.cl
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-100 dark:bg-brand-900/20 p-3 rounded-xl">
                      <Calendar className="w-6 h-6 text-brand-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Schedule a Meeting
                      </div>
                      <div className="text-lg font-semibold">
                        Mon - Fri, 9am - 6pm CLT
                      </div>
                    </div>
                  </div>
                  {selectedDate && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-3">
                      <div className="text-sm font-semibold text-green-700 dark:text-green-300">
                        {selectedDate && selectedTime
                          ? `Scheduled: ${new Date(
                              selectedDate + "T00:00:00",
                            ).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })} at ${selectedTime} CLT`
                          : "No date and time selected"}
                      </div>
                    </div>
                  )}
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <div>
                    <Dropdown
                      id="service"
                      defaultValue={selectedService}
                      onChange={(value) => setSelectedService(value)}
                      data={[
                        "DevOps & CI/CD",
                        "Cloud Solutions",
                        "IoT & Embedded",
                        "Network Engineering",
                      ]}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCalendarModal(true)}
                    className="w-full px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 hover:border-brand-500 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-5 h-5 text-brand-600" />
                    {selectedDate && selectedTime
                      ? `${new Date(
                          selectedDate + "T00:00:00",
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })} at ${selectedTime}`
                      : "Select Date & Time"}
                  </button>
                  <div>
                    <label
                      htmlFor="project-details"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Project details
                    </label>
                    <textarea
                      id="project-details"
                      placeholder="Tell us about your project..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none placeholder:text-slate-500 dark:placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    Schedule Meeting
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Modal */}
      {showCalendarModal && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCalendarModal(false);
              setShowTimeSelection(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setShowCalendarModal(false);
              setShowTimeSelection(false);
            }
          }}
        >
          <section
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto"
            role="document"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Schedule a Meeting
                </h3>
                <button
                  onClick={() => {
                    setShowCalendarModal(false);
                    setShowTimeSelection(false);
                  }}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-5 h-5 text-slate-500 dark:text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                {!showTimeSelection
                  ? currentMonth
                  : `Select time for ${new Date(
                      selectedDate + "T00:00:00",
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}`}
              </p>
            </div>

            <div className="p-6">
              {!showTimeSelection ? (
                <>
                  {/* Calendar Header */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 py-2"
                        >
                          {day}
                        </div>
                      ),
                    )}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (day.isWeekday && !day.isPast) {
                            setSelectedDate(day.date);
                            setShowTimeSelection(true);
                          }
                        }}
                        disabled={!day.isWeekday || day.isPast}
                        className={`
                          aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all cursor-pointer
                          ${
                            !day.isCurrentMonth
                              ? "text-slate-300 dark:text-slate-600"
                              : ""
                          }
                          ${
                            day.isToday
                              ? "bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
                              : ""
                          }
                          ${day.isSelected ? "bg-brand-600 text-white" : ""}
                          ${
                            day.isWeekday && !day.isPast && !day.isSelected
                              ? "hover:bg-slate-100 dark:hover:bg-slate-800"
                              : ""
                          }
                          ${
                            (!day.isWeekday || day.isPast) && !day.isSelected
                              ? "text-slate-400 dark:text-slate-600 cursor-not-allowed"
                              : ""
                          }
                        `}
                      >
                        {day.day}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                      <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                        Business Hours
                      </span>
                    </div>
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Available Monday - Friday, 9:00 AM - 6:00 PM CLT
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Time Selection */}
                  <div className="mb-4">
                    <button
                      onClick={() => setShowTimeSelection(false)}
                      className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium text-sm transition-colors cursor-pointer"
                    >
                      ← Back to calendar
                    </button>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Select Time
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setSelectedTime(time);
                          setShowCalendarModal(false);
                          setShowTimeSelection(false);
                        }}
                        className={`
                          px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
                          ${
                            selectedTime === time
                              ? "bg-brand-600 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }
                        `}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                        30-Minute Slots
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      All meetings are scheduled in 30-minute increments
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>
        </button>
      )}
    </main>
  );
}
