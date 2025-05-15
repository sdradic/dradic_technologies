import { TallyUpLogo } from "~/components/Icons";
import type { Project } from "./models";

export const projects: Project[] = [
  {
    name: "Tally Up",
    description: "An expense tracker app.",
    link: "https://expense-tracker-kappa-livid.vercel.app/",
    icon: TallyUpLogo({
      className:
        "w-16 h-16 stroke-[#8DD3B7] fill-[#8DD3B7] dark:stroke-[#6BC3A1] dark:fill-[#6BC3A1] cursor-pointer",
    }),
  },
  // {
  //   name: "Project 2",
  //   description: "Description 2",
  //   link: "http://localhost:3000",
  // },
  // {
  //   name: "Project 3",
  //   description: "Description 3",
  //   link: "http://localhost:3000",
  // },
];
