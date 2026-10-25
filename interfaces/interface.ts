export interface Contact {
  name: string;
  link: string;
}

export interface UniversityInfo {
  varsity: string;
  department: string;
  startYear?: string | number;
  endYear?: string | number;
  degree?: string;
}

export interface Education {
  university: string;
  degree?: string;
  department: string;
  startYear: string | number;
  endYear: string | number;
  gpa?: string;
  highlights?: string;
}

export interface AboutInfo {
  email: string;
  sampleText: string | string[];
}

export interface Journey {
  year: string;
  description: string;
  title: string;
}

export interface Experience {
  companyName: string;
  role: string;
  startDate: string | Date;
  endDate: string | Date;
  location: string;
  jobType: string;
  jobTechStack: string[];
  worked: string[];
  isCurrent?: boolean;
}

export interface AiTool {
  name: string;
  desc?: string;
  color?: string;
  icon?: string;
}

export interface CoreStack {
  name?: string;
  label?: string;
  category?: string;
  color?: string;
  icon?: string;
}

export interface Service {
  title: string;
  desc?: string;
  description?: string;
  icon?: string;
  link?: string;
  badge?: string;
}

export interface CurrentlyBuilding {
  title: string;
  desc?: string;
  description?: string;
  liveUrl?: string;
  repoUrl?: string;
  link?: string;
  techStack?: string[] | string;
  status?: string;
}

export interface CurrentlyLearning {
  title?: string;
  topic?: string;
  desc?: string;
  notes?: string;
  level?: string;
  badge?: string;
  repoUrl?: string;
  topics?: string[];
}

export interface Faq {
  id?: string;
  question: string;
  answer: string;
  isSidebar?: boolean;
  isPublic?: boolean;
  order?: number;
}

export interface SocialLink {
  _id?: string;
  name: string;
  link: string;
  handle?: string;
  icon?: string;
}

export interface Seo {
  title?: string;
  metaTitle?: string;
  description?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
}

export interface Certification {
  name?: string;
  title?: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
  url?: string;
  credentialId?: string;
}

export interface PortfolioData {
  _id?: string;
  name?: string;
  title?: string;
  avatar?: string;
  tagline?: string;
  statusText?: string;
  seekingRole?: string;
  location?: string;
  timezone?: string;
  resumeUrl?: string;
  aiTools?: AiTool[];
  coreStack?: CoreStack[];

  bioLead?: string;
  bioExpanded?: string[];
  workValues?: string[];
  remoteText?: string;

  universityInfo?: UniversityInfo;
  education?: Education[] | UniversityInfo[];
  certifications?: Certification[];
  journey?: Journey[];
  experience?: Experience[];

  currentlyBuilding?: CurrentlyBuilding[] | CurrentlyBuilding;
  currentlyLearning?: CurrentlyLearning[] | CurrentlyLearning;
  faqs?: Faq[];

  services?: Service[];
  socialLinks?: SocialLink[];
  contacts?: Contact[];
  aboutInfo?: AboutInfo;

  seo?: Seo;
}

export interface Project {
  _id?: string;
  image: string; // Thumbnail image for cards
  images?: string[]; // Multiple detail images for modal
  projectName: string;
  tagline: string;
  role?: string;
  status?: string;
  techStack: string[];
  liveSite: string;
  frontendRepo: string;
  backendRepo: string;
  githubRepo?: string;
  backendLive?: string;
  rerankerRepo?: string;
  demoCheckerRepo?: string;
  technicalHighlights: string;
  projectType: "client project" | "personal project";
  isActive?: boolean;

  // Case Study Sections strictly following framework / output.md
  overview?: string; // Section 1. Overview
  problem?: string; // Section 2. Problem
  myContribution?: string; // Section 3. My Contribution
  architecture?: string; // Section 4. Architecture (ASCII diagram + Data Flows)
  keyDecisions?: string; // Section 5. Three Key Engineering Decisions
  resultsEvidence?: string; // Section 6. Results and Evidence
  limitationsNextSteps?: string; // Section 7. Limitations and Next Steps

  // Legacy fields
  shortDes?: string;
  problemSolution?: string;
  features?: string[];
  dependencies?: string;
  responsibilities?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillItem {
  _id?: string;
  category: string;
  skills: string[];
  order?: number;
}
