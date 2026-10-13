import { IoLogoJavascript, IoLogoFirebase } from "react-icons/io5";
import { BiLogoTypescript, BiLogoMongodb, BiLogoPostgresql } from "react-icons/bi";
import { FaReact, FaNodeJs, FaGitAlt } from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";
import {
  SiReactrouter,
  SiTailwindcss,
  SiShadcnui,
  SiExpress,
  SiMongoose,
  SiPostman,
  SiJsonwebtokens,
  SiVite,
  SiPrisma,
  SiNestjs,
  SiRedis,
  SiSupabase,
  SiSocketdotio,
  SiGooglegemini,
  SiRedux,
  SiZod,
  SiDocker,
  SiGithub,
} from "react-icons/si";
import { GiBullHorns } from "react-icons/gi";

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
  "react.js": {
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
  "next.js 15": {
    icon: <RiNextjsFill className="text-white" />,
    color: "white",
  },
  "next 15": {
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
  "shadcn ui": {
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
  nestjs: {
    icon: <SiNestjs className="text-[#E0234E]" />,
    color: "#E0234E",
  },
  "nest.js": {
    icon: <SiNestjs className="text-[#E0234E]" />,
    color: "#E0234E",
  },
  nest: {
    icon: <SiNestjs className="text-[#E0234E]" />,
    color: "#E0234E",
  },
  redis: {
    icon: <SiRedis className="text-[#DC382D]" />,
    color: "#DC382D",
  },
  bullmq: {
    icon: <GiBullHorns className="text-[#FF5722]" />,
    color: "#FF5722",
  },
  supabase: {
    icon: <SiSupabase className="text-[#3ECF8E]" />,
    color: "#3ECF8E",
  },
  "socket.io": {
    icon: <SiSocketdotio className="text-white" />,
    color: "white",
  },
  socketio: {
    icon: <SiSocketdotio className="text-white" />,
    color: "white",
  },

  mongodb: {
    icon: <BiLogoMongodb className="text-[#27FF82]" />,
    color: "#27FF82",
  },
  "mongodb (mongoose)": {
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
  github: {
    icon: <SiGithub className="text-white" />,
    color: "white",
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
  docker: {
    icon: <SiDocker className="text-[#2496ED]" />,
    color: "#2496ED",
  },
  zod: {
    icon: <SiZod className="text-[#3E67B1]" />,
    color: "#3E67B1",
  },
  redux: {
    icon: <SiRedux className="text-[#764ABC]" />,
    color: "#764ABC",
  },
  "redux toolkit": {
    icon: <SiRedux className="text-[#764ABC]" />,
    color: "#764ABC",
  },
  "rtk query": {
    icon: <SiRedux className="text-[#764ABC]" />,
    color: "#764ABC",
  },
  "gemini ai": {
    icon: <SiGooglegemini className="text-[#4E75F8]" />,
    color: "#4E75F8",
  },
  gemini: {
    icon: <SiGooglegemini className="text-[#4E75F8]" />,
    color: "#4E75F8",
  },
};

export const getSkillIcon = (skillName) => {
  if (!skillName) return { icon: null, color: "#666666" };
  const normalizedName = skillName.toLowerCase().trim();
  return (
    skillsIconMap[normalizedName] || {
      icon: null,
      color: "#666666",
    }
  );
};

