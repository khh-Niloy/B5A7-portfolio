export interface Contact {
  name: string;
  link: string;
}

export interface UniversityInfo {
  varsity: string;
  department: string;
  startYear: string;
  endYear: string;
}

export interface AboutInfo {
  email: string;
  sampleText: string;
}

export interface Journey {
  year: string;
  description: string;
  title: string;
}

export interface Project {
  _id?: string;
  image: string;
  shortDes: string;
  techStack: string[];
  liveSite: string;
  projectName: string;
  tagline: string;
  problemSolution: string;
  features: string[];
  dependencies: string;
  responsibilities: string;
  githubRepo: string;
  projectType: "client project" | "personal project";
}
