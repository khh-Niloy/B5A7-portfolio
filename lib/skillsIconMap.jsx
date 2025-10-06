import { IoLogoJavascript } from "react-icons/io5";
import { BiLogoTypescript, BiLogoMongodb, BiLogoPostgresql } from "react-icons/bi";
import { FaReact, FaNodeJs, FaGitAlt } from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";
import { SiReactrouter, SiTailwindcss, SiShadcnui, SiExpress, SiMongoose, SiPostman, SiJsonwebtokens, SiVite, SiPrisma } from "react-icons/si";
import { IoLogoFirebase } from "react-icons/io5";

export const skillsIconMap = {
  javascript: {
    icon: <IoLogoJavascript className="text-[#F3E224]" />,
    color: "#F3E224",
  },
  typescript: {
    icon: <BiLogoTypescript className="text-[#0076C6] text-md" />,
    color: "#0076C6",
  },
  react: {
    icon: <FaReact className="text-[#58C4DC]" />,
    color: "#58C4DC",
  },
  reactjs: {
    icon: <FaReact className="text-[#58C4DC]" />,
    color: "#58C4DC",
  },
  "react router": {
    icon: <SiReactrouter className="text-white" />,
    color: "white",
  },
  "react router dom": {
    icon: <SiReactrouter className="text-white" />,
    color: "white",
  },
  next: {
    icon: <RiNextjsFill className="text-white" />,
    color: "white",
  },
  "next.js": {
    icon: <RiNextjsFill className="text-white" />,
    color: "white",
  },
  nextjs: {
    icon: <RiNextjsFill className="text-white" />,
    color: "white",
  },
  tailwind: {
    icon: <SiTailwindcss className="text-[#00BCFF]" />,
    color: "#00BCFF",
  },
  "tailwind css": {
    icon: <SiTailwindcss className="text-[#00BCFF]" />,
    color: "#00BCFF",
  },
  tailwindcss: {
    icon: <SiTailwindcss className="text-[#00BCFF]" />,
    color: "#00BCFF",
  },
  shadcn: {
    icon: <SiShadcnui className="text-white" />,
    color: "white",
  },
  "shadcn/ui": {
    icon: <SiShadcnui className="text-white" />,
    color: "white",
  },

  node: {
    icon: <FaNodeJs className="text-[#58A149]" />,
    color: "#58A149",
  },
  "node.js": {
    icon: <FaNodeJs className="text-[#58A149]" />,
    color: "#58A149",
  },
  nodejs: {
    icon: <FaNodeJs className="text-[#58A149]" />,
    color: "#58A149",
  },
  express: {
    icon: <SiExpress className="text-white" />,
    color: "white",
  },
  "express.js": {
    icon: <SiExpress className="text-white" />,
    color: "white",
  },
  expressjs: {
    icon: <SiExpress className="text-white" />,
    color: "white",
  },

  mongodb: {
    icon: <BiLogoMongodb className="text-[#27FF82]" />,
    color: "#27FF82",
  },
  mongoose: {
    icon: <SiMongoose className="text-[#880000]" />,
    color: "#880000",
  },
  postgresql: {
    icon: <BiLogoPostgresql className="text-[#336791]" />,
    color: "#336791",
  },
  postgres: {
    icon: <BiLogoPostgresql className="text-[#336791]" />,
    color: "#336791",
  },
  prisma: {
    icon: <SiPrisma className="text-white" />,
    color: "white",
  },

  git: {
    icon: <FaGitAlt className="text-[#F05133]" />,
    color: "#F05133",
  },
  postman: {
    icon: <SiPostman className="text-[#FF6C37]" />,
    color: "#FF6C37",
  },
  jwt: {
    icon: <SiJsonwebtokens className="text-white" />,
    color: "white",
  },
  firebase: {
    icon: <IoLogoFirebase className="text-[#FFC400]" />,
    color: "#FFC400",
  },
  vite: {
    icon: <SiVite className="text-white" />,
    color: "white",
  },
};

export const getSkillIcon = (skillName) => {
  const normalizedName = skillName.toLowerCase().trim();
  return skillsIconMap[normalizedName] || {
    icon: null,
    color: "#666666",
  };
};

