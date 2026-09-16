/**
 * Approved public profile content.
 *
 * Every field here is sourced from the material Juli Yandi Rahman approved
 * for public display. Deliberately excluded, per the privacy boundary: NIP
 * and other personnel identity numbers, KTP/NPWP/BPJS numbers, full home
 * address, family records, decree/appointment/diploma/certificate numbers,
 * QR codes, religion, marital status, ethnicity, blood type, physical
 * measurements, and any raw CV/DRH document downloads.
 */

export const identity = {
  name: "Juli Yandi Rahman, S.Mat",
  positioning:
    "Mathematics graduate, statistical research consultant, data and information systems practitioner, and AI and cybersecurity learner.",
  origin: "Kotawaringin Barat, Indonesia",
  location: "Indonesia",
  github: "https://github.com/juliyandi35",
  githubHandle: "juliyandi35",
  linkedin: "https://www.linkedin.com/in/juli-yandi-rahman-3a2257290",
  email: "juliyandi35@gmail.com",
  phone: "081348609836",
  heroHeadline: "Turning research methods into working systems.",
  heroSubtext:
    "Mathematics, statistical modelling, data systems, and applied AI across 301 public repositories.",
} as const;

export interface TrajectoryStage {
  id: string;
  year: string;
  label: string;
  title: string;
  body: string;
}

export const trajectory: TrajectoryStage[] = [
  {
    id: "mathematics",
    year: "2020 – 2024",
    label: "Formation",
    title: "Mathematics education",
    body: "S-1 Mathematics at Universitas Pertahanan Republik Indonesia, graduating with a GPA of 3.56. A parallel research program at the National Research and Innovation Agency's Data and Information Science Research Center followed in 2023.",
  },
  {
    id: "consulting",
    year: "2023 – 2024",
    label: "Practice",
    title: "Statistical research consulting",
    body: "As a Research Consultant at Educativa ID, processed client research data with regression, clustering, machine learning and other methods, then prepared interpretations and full results-and-discussion chapters.",
  },
  {
    id: "public-sector",
    year: "2025 – present",
    label: "Systems",
    title: "Government data and information systems",
    body: "Civil servant at the Ministry of Defense of the Republic of Indonesia, in the Data Management and Application Systems field at the Data and Information Center, working on data services for the ministry.",
  },
  {
    id: "ai-security",
    year: "2025 – 2026",
    label: "Extension",
    title: "AI and cybersecurity development",
    body: "Structured coursework spanning network foundations, network defense, ethical hacking, vulnerability assessment and penetration testing, security operations, and generative AI application development.",
  },
];

export interface WorkExperience {
  id: string;
  organization: string;
  role: string;
  period: string;
  responsibilities: string[];
}

export const workExperience: WorkExperience[] = [
  {
    id: "kemhan-current",
    organization: "Ministry of Defense of the Republic of Indonesia",
    role: "Sandiman Pertama / Ahli Pertama, Data Management and Application Systems, Data and Information Center",
    period: "1 June 2026 – present",
    responsibilities: [
      "Civil servant, rank Penata Muda III/a.",
      "Current unit: Bidang Manajemen Data dan Sistem Aplikasi, Pusat Data dan Informasi, Kementerian Pertahanan RI.",
    ],
  },
  {
    id: "kemhan-previous",
    organization: "Ministry of Defense of the Republic of Indonesia",
    role: "Sandiman Pertama / Ahli Pertama, Data Services Sub-Field, Data Management and Application Systems",
    period: "4 June 2025 – 31 May 2026",
    responsibilities: [
      "Sub Bidang Layanan Data, Bidang Manajemen Data dan Sistem Aplikasi, Pusat Data dan Informasi, Kementerian Pertahanan RI.",
      "CPNS appointment began 1 June 2025; PNS appointment began 1 June 2026.",
    ],
  },
  {
    id: "educativa",
    organization: "Educativa ID",
    role: "Research Consultant in Statistical Data Processing",
    period: "2023 – 2024",
    responsibilities: [
      "Processed research data using regression, clustering, machine learning, and other methods requested by clients.",
      "Prepared concise interpretations and full results-and-discussion chapters based on completed analyses.",
      "Presented material and supported discussion or question-and-answer sessions with clients through online meetings when needed.",
    ],
  },
];

export interface EducationEntry {
  id: string;
  institution: string;
  program: string;
  period: string;
  detail?: string;
  tier: "primary" | "secondary" | "early";
}

export const education: EducationEntry[] = [
  {
    id: "unhan",
    institution: "Universitas Pertahanan Republik Indonesia",
    program: "S-1 Mathematics",
    period: "2020 – 2024",
    detail: "GPA 3.56",
    tier: "primary",
  },
  {
    id: "brin",
    institution: "National Research and Innovation Agency",
    program: "Data and Information Science Research Center",
    period: "2023",
    detail: "GPA 4.00 — research program",
    tier: "primary",
  },
  {
    id: "sma",
    institution: "SMA Negeri 1 Kumai",
    program: "Secondary education",
    period: "Graduated 2020",
    tier: "early",
  },
  {
    id: "mts",
    institution: "MTs Negeri Kumai",
    program: "Lower secondary education",
    period: "Graduated 2017",
    tier: "early",
  },
  {
    id: "sd",
    institution: "SD Negeri 2 Kumai Hilir",
    program: "Primary education",
    period: "Graduated 2014",
    tier: "early",
  },
];

export const organization = {
  name: "UNHAN RI Research and Technology",
  role: "Member",
  period: "2022",
  detail: "Participated in discussions related to research conducted by formed research groups.",
};

export interface TrainingEntry {
  id: string;
  title: string;
  period: string;
  detail?: string;
}

export const structuralTraining: TrainingEntry[] = [
  { id: "latsar", title: "Latsar CPNS Golongan III", period: "2026", detail: "Completed 21 April 2026" },
  { id: "komcad", title: "Pendidikan Militer DIK KOMCAD", period: "2021", detail: "Completed 8 September 2021" },
];

export type CourseGroup = "ai-data" | "networking-security" | "public-service-defense" | "language-spatial";

export interface Course {
  id: string;
  title: string;
  provider: string;
  year: string;
  hours?: number;
  completed: string;
  group: CourseGroup;
}

export const courses: Course[] = [
  {
    id: "genai-bootcamp",
    title: "Gen AI Engineer Bootcamp: Build AI Apps & Agents in Python",
    provider: "Udemy",
    year: "2026",
    hours: 11,
    completed: "23 August 2026",
    group: "ai-data",
  },
  {
    id: "mtcna",
    title: "MTCNA",
    provider: "PT Citraweb Solusi Teknologi",
    year: "2025",
    hours: 40,
    completed: "23 December 2025",
    group: "networking-security",
  },
  {
    id: "soc",
    title: "Security Operation Center",
    provider: "PT Xirka Dama Persada",
    year: "2025",
    hours: 40,
    completed: "5 September 2025",
    group: "networking-security",
  },
  {
    id: "vapt",
    title: "Vulnerability Assessment and Penetration Testing",
    provider: "PT Xirka Dama Persada",
    year: "2025",
    hours: 40,
    completed: "25 August 2025",
    group: "networking-security",
  },
  {
    id: "ethical-hacking",
    title: "Ethical Hacking",
    provider: "PT Xirka Dama Persada",
    year: "2025",
    hours: 40,
    completed: "15 August 2025",
    group: "networking-security",
  },
  {
    id: "network-defense",
    title: "Network Defense",
    provider: "PT Xirka Dama Persada",
    year: "2025",
    hours: 40,
    completed: "8 August 2025",
    group: "networking-security",
  },
  {
    id: "network-enterprise",
    title: "Network Enterprise",
    provider: "PT Xirka Dama Persada",
    year: "2025",
    hours: 40,
    completed: "1 August 2025",
    group: "networking-security",
  },
  {
    id: "network-foundation",
    title: "Network Foundation Specialist",
    provider: "PT Xirka Dama Persada",
    year: "2025",
    hours: 40,
    completed: "25 July 2025",
    group: "networking-security",
  },
  {
    id: "aptis",
    title: "Aptis",
    provider: "British Council Indonesia Foundation",
    year: "2024",
    completed: "13 August 2024",
    group: "language-spatial",
  },
  {
    id: "spatial-r-qgis",
    title: "Intermediate Spatial Data Analysis with R, QGIS & More",
    provider: "Udemy",
    year: "2024",
    hours: 5,
    completed: "3 July 2024",
    group: "language-spatial",
  },
];

export const courseGroupLabels: Record<CourseGroup, string> = {
  "ai-data": "AI and data",
  "networking-security": "Networking and cybersecurity",
  "public-service-defense": "Public service and defense formation",
  "language-spatial": "Language and spatial analysis",
};

export interface SkillCluster {
  id: string;
  label: string;
  items: string[];
}

export const skillClusters: SkillCluster[] = [
  {
    id: "statistical-computing",
    label: "Statistical computing",
    items: ["R and RStudio", "Python", "MATLAB", "IBM SPSS Statistics", "EViews 12", "Stata 17", "Minitab"],
  },
  {
    id: "data-ai",
    label: "Data and AI",
    items: ["Applied machine learning", "Applied AI", "MySQL", "Statistical modelling", "Research data processing"],
  },
  {
    id: "research-software",
    label: "Research software",
    items: ["SmartPLS", "JASP", "AMOS", "Maple", "Mendeley"],
  },
  {
    id: "spatial-tools",
    label: "Spatial tools",
    items: ["QGIS", "Spatial statistics", "Geographic data workflows"],
  },
  {
    id: "productivity",
    label: "Productivity",
    items: ["Microsoft Word", "Excel", "PowerPoint"],
  },
  {
    id: "security-foundations",
    label: "Security foundations",
    items: ["Networking fundamentals", "Network defense", "Ethical hacking foundations", "Vulnerability assessment"],
  },
  {
    id: "communication",
    label: "Communication",
    items: ["Technical presentation", "Client-facing discussion", "Data visualization and dashboards"],
  },
  {
    id: "mentoring",
    label: "Mentoring",
    items: ["Mentoring", "Cross-functional collaboration"],
  },
];

export const softSkills = ["Communicative", "Thorough", "Responsible", "Deft and resourceful", "Adaptive"];

export const languages = [
  { name: "Indonesian", level: "Native" },
  { name: "English", level: "Active, professionally fluent" },
  { name: "Japanese", level: "Active" },
];

export const disclaimer =
  "Personal portfolio. Views and projects presented here are personal and do not represent an institution.";
