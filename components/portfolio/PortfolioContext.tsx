"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PortfolioData, SkillItem } from "@/interfaces/interface";
import getAbout from "@/helper/getAbout";
import getSkills from "@/helper/getSkills";

interface PortfolioContextType {
  data: PortfolioData | null;
  skills: SkillItem[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

const defaultPortfolioData: PortfolioData = {
  name: "Hasib Hossain Niloy",
  title: "Software Engineer & Full-Stack Builder",
  avatar: "https://avatars.githubusercontent.com/u/174131986?v=4",
  tagline: "I value ownership, problem solving, and taking responsibility for my work.",
  statusText: "Open to Work & Collaboration",
  seekingRole: "Actively seeking Software Engineer roles",
  location: "Dhaka, Bangladesh",
  timezone: "Asia/Dhaka",
  resumeUrl: "https://drive.google.com/file/d/1mepMM01uzz6R7qLAdUZM-ODszg-Kvz7V/view?usp=sharing",
  bioLead: "I’m a Software Engineer focused on building reliable, maintainable software that solves real business problems. I believe great software starts with understanding the problem, business logic, and workflow before choosing the right technical solution.",
  bioExpanded: [
    "With experience in full stack development and client projects, I’ve worked on backend systems, REST APIs, authentication, role and permission based access control, payment integrations, caching, background jobs, and database optimization.",
    "I primarily work with TypeScript and the modern JavaScript ecosystem, with a strong interest in backend engineering, system design, and practical AI integration. I value continuous learning, problem solving, and ownership, with a long term goal of growing into leadership while creating meaningful technical and business impact."
  ],
  workValues: ["High ownership", "Clean architecture", "Continuous learner"],
  remoteText: "Comfortable across global teams, shipping robust code with disciplined ownership.",
  aiTools: [
    { name: "Gemini", color: "#4e75f8", icon: "SiGooglegemini" },
    { name: "Claude", color: "#d97757", icon: "SiClaude" },
    { name: "Antigravity", color: "#38bdf8", icon: "AntigravityIcon" },
    { name: "Codex", color: "#10a37f", icon: "CodexIcon" }
  ],
  coreStack: [
    { name: "TypeScript", color: "#3178C6" },
    { name: "NestJS", color: "#E0234E" },
    { name: "Node.js", color: "#339933" },
    { name: "Express", color: "#ffffff" },
    { name: "PostgreSQL", color: "#4169E1" },
    { name: "Prisma", color: "#2D3748" },
    { name: "MongoDB", color: "#47A248" },
    { name: "Mongoose", color: "#880000" },
    { name: "Redis", color: "#DC382D" },
    { name: "Supabase", color: "#3ECF8E" },
    { name: "Next.js", color: "#ffffff" }
  ],
  universityInfo: {
    varsity: "Daffodil International University",
    department: "BSc in Software Engineering",
    startYear: "2023",
    endYear: "2027",
    degree: "BSc in Software Engineering"
  },
  education: [
    {
      varsity: "Daffodil International University",
      department: "BSc in Software Engineering",
      startYear: "2023",
      endYear: "2027",
      degree: "BSc in Software Engineering"
    }
  ],
  journey: [
    {
      year: "2026",
      title: "Backend Architecture & AI Systems",
      description: "Expanding into high-concurrency systems, background workers (BullMQ/Redis), and production AI integrations."
    },
    {
      year: "2025",
      title: "Industry Transition @ Lint Technologies",
      description: "Stepped into professional software development, promoted from intern to full-stack engineer."
    },
    {
      year: "2024",
      title: "Production Projects with Modern Web Stack",
      description: "Mastered full-stack engineering, strict deadline management, and scalable cloud architectures."
    },
    {
      year: "2022",
      title: "Problem Solving & Algorithms",
      description: "Deepened algorithmic problem solving on Codeforces and Beecrowd using C and C++."
    }
  ],
  experience: [
    {
      companyName: "Lint Technologies",
      role: "Software Engineer",
      startDate: "2025-07-22",
      endDate: "2025-12-14",
      location: "Remote",
      jobType: "Full-Time",
      isCurrent: false,
      worked: [
        "Worked on full stack development for client projects and company products, ensuring smooth functionality and UX.",
        "Recognized for being a fast learner and for taking initiative, demonstrating strong commitment.",
        "Contributed to AI related projects using Gemini."
      ],
      jobTechStack: ["Gemini AI", "Next.js", "TypeScript", "Node.js", "Supabase"]
    }
  ],
  currentlyBuilding: {
    title: "ProcureAI Platform",
    desc: "AI-powered procurement management platform streamlining purchase workflows, vendor quotation comparisons, and intelligent decision support with Gemini AI.",
    liveUrl: "https://procureai-platform-frontend.vercel.app/",
    repoUrl: "https://github.com/khh-Niloy/procureai-platform-frontend"
  },
  currentlyLearning: {
    title: "AI Engineering Lab",
    desc: "An ongoing collection of practical AI/LLM engineering projects built while learning production oriented AI integration. Currently includes an AI Ticket Classifier implementing structured outputs, prompt engineering, retries, timeouts, model fallback, and runtime validation.",
    badge: "Ongoing",
    repoUrl: "https://github.com/khh-Niloy/ai-engineering-lab",
    topics: ["System design", "LLM-RAG"]
  },
  socialLinks: [
    { name: "GitHub", link: "https://github.com/khh-Niloy", handle: "@khh-Niloy" },
    { name: "LinkedIn", link: "https://www.linkedin.com/in/hasibhossain-niloy01/", handle: "/in/hasibhossain-niloy01" },
    { name: "WhatsApp", link: "https://wa.me/8801915910291", handle: "+880 1915-910291" },
    { name: "Facebook", link: "https://www.facebook.com/khhniloy.niloy/", handle: "/khhniloy.niloy" },
    { name: "Email", link: "mailto:khhniloy0@gmail.com", handle: "khhniloy0@gmail.com" }
  ],
  faqs: [
    {
      id: "faq-1",
      question: "Are you open to full time or remote opportunities?",
      answer: "Yes, I’m actively open to full time software engineering opportunities, including remote roles. I value ownership, thoughtful problem solving, and building reliable software that solves real business problems.",
      isSidebar: true,
      isPublic: true,
      order: 1
    },
    {
      id: "faq-2",
      question: "What is the best way to get in touch?",
      answer: "You can reach me through the Contact section, email me at khhniloy0@gmail.com, or connect with me on LinkedIn or WhatsApp at +880 1915 910291. I’d be happy to connect and discuss potential opportunities.",
      isSidebar: true,
      isPublic: true,
      order: 2
    },
    {
      id: "faq-3",
      question: "Would you be interested in contributing to a SaaS business?",
      answer: "Absolutely. I’m currently developing a multi tenant ecommerce SaaS platform, working on features across storefronts, products, inventory, orders, checkout, and business insights. I’m interested in understanding the business behind a product and contributing to its growth through thoughtful engineering.",
      isSidebar: true,
      isPublic: true,
      order: 3
    },
    {
      id: "faq-4",
      question: "Which area of software engineering do you focus on most?",
      answer: "My primary focus is backend engineering, particularly API design, business logic, database design, authentication, and system reliability. I also work with frontend technologies when needed to build and integrate complete product features.",
      isSidebar: true,
      isPublic: true,
      order: 4
    },
    {
      id: "faq-5",
      question: "Do you use AI coding agents in your development workflow?",
      answer: "Yes. I actively use Google Antigravity and Codex CLI, and I’ve also worked with Claude CLI and Cursor. I use these tools to accelerate development, explore solutions, and improve productivity while keeping code quality and understanding the implementation a priority.",
      isSidebar: true,
      isPublic: true,
      order: 5
    },
    {
      id: "faq-6",
      question: "Have you worked with AI and LLM APIs?",
      answer: "Yes. I’ve integrated the Gemini API in my previous professional work and in ProcureAI, an AI powered procurement project. I’m also building my knowledge of production grade AI engineering through my AI Engineering Lab, focusing on reliable LLM integration, error handling, and practical implementation patterns.",
      isSidebar: true,
      isPublic: true,
      order: 6
    }
  ]
};

const PortfolioContext = createContext<PortfolioContextType>({
  data: defaultPortfolioData,
  skills: [],
  loading: false,
  refreshData: async () => {},
});

export function PortfolioProvider({
  children,
  initialData,
  initialSkills = [],
}: {
  children: React.ReactNode;
  initialData?: PortfolioData | null;
  initialSkills?: SkillItem[];
}) {
  const [data, setData] = useState<PortfolioData>(() => ({
    ...defaultPortfolioData,
    ...(initialData || {}),
  }));
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills);
  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [aboutRes, skillsRes] = await Promise.all([
        getAbout(),
        getSkills(),
      ]);

      if (aboutRes) {
        setData((prev) => ({
          ...prev,
          ...aboutRes,
        }));
      }

      if (skillsRes && Array.isArray(skillsRes.data)) {
        setSkills(skillsRes.data);
      }
    } catch (err) {
      console.error("Error refreshing portfolio data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <PortfolioContext.Provider value={{ data, skills, loading, refreshData }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  return context;
}
