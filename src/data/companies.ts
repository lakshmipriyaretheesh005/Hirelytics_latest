export interface CompanyData {
  id: string;
  name: string;
  logo: string;
  sampleResume?: string;
  status: "Active" | "Upcoming" | "Closed";
  minCgpa: number;
  packageLpa: number;
  about: string;
  roles: string[];
  interviewDate: string;
  skillsRequired: string[];
  resources: string[];
  selectionProcess: { round: string; description: string }[];
  experiences: { name: string; batch: string; text: string }[];
}

export const companiesData: CompanyData[] = [
  {
    id: "ey",
    name: "EY (Ernst & Young)",
    logo: "EY",
    status: "Active",
    minCgpa: 7.0,
    packageLpa: 6.5,
    about:
      "EY is a multinational professional services network providing assurance, tax, consulting, and advisory services. They actively recruit from top engineering colleges for technology consulting and digital transformation roles.",
    roles: ["Technology Consultant", "Staff Engineer", "Analyst"],
    interviewDate: "Apr 10, 2026",
    skillsRequired: ["Problem Solving", "SQL", "Python", "Communication", "Data Analysis"],
    resources: ["Aptitude Pack", "SQL Revision Notes", "Consulting Interview Guide"],
    selectionProcess: [
      { round: "Online Assessment", description: "Aptitude, logical reasoning, and verbal ability (60 min)" },
      { round: "Group Discussion", description: "Topic-based discussion in groups of 8–10" },
      { round: "Technical Interview", description: "CS fundamentals, projects, problem solving" },
      { round: "HR Interview", description: "Behavioral questions, culture fit, career goals" },
    ],
    experiences: [
      {
        name: "Meera Joseph",
        batch: "CSE '24",
        text: "The GD round was more about structured thinking than speaking loudly. In the technical round they focused on my projects and SQL queries.",
      },
    ],
  },
  {
    id: "ibm",
    name: "IBM",
    logo: "IBM",
    status: "Active",
    minCgpa: 7.5,
    packageLpa: 5.8,
    about:
      "IBM is a global technology and consulting company offering cloud computing, AI, and enterprise solutions. Their campus hiring focuses on software development, cloud engineering, and data science roles.",
    roles: ["Associate Developer", "Cloud Engineer", "Data Analyst"],
    interviewDate: "Apr 15, 2026",
    skillsRequired: ["Java", "Cloud Basics", "Data Structures", "REST APIs", "Linux"],
    resources: ["Cognitive Test Practice", "Java Notes", "Cloud Basics Deck"],
    selectionProcess: [
      { round: "Cognitive Assessment", description: "IBM's proprietary cognitive ability test (45 min)" },
      { round: "Coding Round", description: "2 coding problems — arrays, strings, basic DP" },
      { round: "Technical Interview", description: "OOP concepts, project discussion, system design basics" },
      { round: "HR Round", description: "Motivation, team scenarios, relocation preferences" },
    ],
    experiences: [
      {
        name: "Rohit Nair",
        batch: "IT '24",
        text: "The cognitive test was unique — pattern recognition and word association. Coding was medium difficulty. They liked that I had cloud project experience.",
      },
    ],
  },
  {
    id: "infosys",
    name: "Infosys",
    logo: "INF",
    status: "Active",
    minCgpa: 6.5,
    packageLpa: 3.6,
    about:
      "Infosys is one of India's largest IT services companies, specializing in digital services, consulting, and next-gen solutions. They hire in large batches across all engineering branches.",
    roles: ["Systems Engineer", "Digital Specialist Engineer", "Power Programmer"],
    interviewDate: "Mar 28, 2026",
    skillsRequired: ["C/C++", "Java", "Problem Solving", "DBMS", "Communication"],
    resources: ["InfyTQ Prep Sheet", "DBMS Cheat Sheet", "HR FAQ List"],
    selectionProcess: [
      { round: "InfyTQ / Online Test", description: "MCQs on aptitude, reasoning, verbal (90 min)" },
      { round: "Coding Round", description: "1–2 problems, pseudo-code or Python/Java" },
      { round: "Technical Interview", description: "Fundamentals of CS, DBMS, OS, project discussion" },
      { round: "HR Interview", description: "Standard behavioral questions, willingness to relocate" },
    ],
    experiences: [
      {
        name: "Anitha S",
        batch: "ECE '24",
        text: "InfyTQ certification helped me skip the initial test. The coding round was straightforward — focus on basics and you'll clear it.",
      },
    ],
  },
  {
    id: "tcs",
    name: "TCS",
    logo: "TCS",
    status: "Upcoming",
    minCgpa: 6.0,
    packageLpa: 3.36,
    about:
      "Tata Consultancy Services is the largest Indian IT services company and a global leader in technology, consulting, and business solutions. They conduct one of the largest campus recruitment drives in India.",
    roles: ["Assistant Systems Engineer", "Digital Cadre", "Ninja / Prime"],
    interviewDate: "Apr 2, 2026",
    skillsRequired: ["Aptitude", "Basic Coding", "English Proficiency", "Adaptability"],
    resources: ["NQT Pattern Sheet", "Aptitude Formula List", "Interview Readiness Notes"],
    selectionProcess: [
      { round: "TCS NQT", description: "National Qualifier Test — aptitude, programming logic, coding" },
      { round: "Technical Interview", description: "Based on NQT performance, CS basics, resume" },
      { round: "Managerial Round", description: "Scenario-based, leadership, teamwork questions" },
      { round: "HR Interview", description: "Bond agreement discussion, location preferences" },
    ],
    experiences: [
      {
        name: "Vishnu Prasad",
        batch: "ME '24",
        text: "TCS NQT is the key — practice on their portal. The interview was relaxed, mostly about projects and willingness to learn.",
      },
    ],
  },
];
