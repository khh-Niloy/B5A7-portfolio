import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

export const passwordSchema = z
  .string()
  .min(1, "Password is required")

export const urlSchema = z
  .string()
  .optional()
  .refine(
    (val) => !val || z.string().url().safeParse(val).success,
    "Please enter a valid URL"
  );

export const requiredStringSchema = (fieldName: string) =>
  z.string().min(1, `${fieldName} is required`);

export const optionalStringSchema = z.string().optional();

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const projectSchema = z.object({
  projectName: requiredStringSchema("Project name"),
  shortDes: requiredStringSchema("Short description"),
  techStack: requiredStringSchema("Tech stack"),
  liveSite: urlSchema,
  tagline: requiredStringSchema("Tagline"),
  problemSolution: requiredStringSchema("Problem & solution"),
  features: requiredStringSchema("Key features"),
  dependencies: optionalStringSchema,
  responsibilities: requiredStringSchema("Responsibilities"),
  githubRepo: urlSchema,
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export const blogSchema = z.object({
  title: requiredStringSchema("Title"),
  content: z
    .string()
    .min(1, "Content is required")
    .min(50, "Content must be at least 50 characters"),
  category: requiredStringSchema("Category"),
});

export type BlogFormValues = z.infer<typeof blogSchema>;

export const contactSchema = z.object({
  name: requiredStringSchema("Contact name"),
  link: z
    .string()
    .min(1, "Link is required")
    .url("Please enter a valid URL"),
});

export const journeySchema = z.object({
  year: requiredStringSchema("Year"),
  title: requiredStringSchema("Title"),
  description: requiredStringSchema("Description"),
});

export const experienceSchema = z.object({
  companyName: requiredStringSchema("Company name"),
  role: requiredStringSchema("Role"),
  startDate: requiredStringSchema("Start date"),
  endDate: z.string().optional(),
  location: z.enum(["remote", "onsite", "hybrid"]),
  jobType: z.enum(["full-time", "part-time", "contract", "internship"]),
  jobTechStack: optionalStringSchema,
  worked: optionalStringSchema,
  isCurrent: z.boolean().optional(),
});

export const universityInfoSchema = z.object({
  varsity: optionalStringSchema,
  department: optionalStringSchema,
  startYear: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(Number(val)) && Number(val) >= 1900 && Number(val) <= 2100),
      "Please enter a valid year (1900-2100)"
    ),
  endYear: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(Number(val)) && Number(val) >= 1900 && Number(val) <= 2100),
      "Please enter a valid year (1900-2100)"
    ),
});

export const aboutInfoSchema = z.object({
  email: emailSchema,
  sampleText: optionalStringSchema,
});

export const aboutSchema = z.object({
  contacts: z.array(contactSchema).min(1, "At least one contact is required"),
  journey: z.array(journeySchema).optional(),
  universityInfo: universityInfoSchema,
  aboutInfo: aboutInfoSchema,
  experience: z.array(experienceSchema).optional(),
});

export const skillsSchema = z.object({
  name: requiredStringSchema("Skill name"),
  level: z
    .string()
    .min(1, "Skill level is required")
    .refine(
      (val) => ["beginner", "intermediate", "advanced", "expert"].includes(val),
      "Please select a valid skill level"
    ),
  category: requiredStringSchema("Category"),
});

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof z.ZodError) {
    return error.issues.map((err) => err.message).join(", ");
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
};

export const handleApiError = (error: unknown): { message: string; details?: string } => {
  if (error instanceof Error) {
    if (error.message.includes("fetch")) {
      return {
        message: "Network error. Please check your connection and try again.",
        details: error.message,
      };
    }
    
    if (error.message.includes("401") || error.message.includes("unauthorized")) {
      return {
        message: "You are not authorized to perform this action. Please log in again.",
        details: error.message,
      };
    }
    
    if (error.message.includes("500") || error.message.includes("server")) {
      return {
        message: "Server error. Please try again later.",
        details: error.message,
      };
    }
    
    return {
      message: error.message,
      details: error.message,
    };
  }
  
  if (typeof error === "object" && error !== null && "message" in error) {
    return {
      message: (error as { message: string }).message,
      details: JSON.stringify(error),
    };
  }
  
  return {
    message: "An unexpected error occurred. Please try again.",
    details: String(error),
  };
};

export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((err) => err.message),
      };
    }
    return {
      success: false,
      errors: ["Validation failed"],
    };
  }
};
