export type DriveRound = {
  name: string;
  date: string;
};

export type PlacementDrive = {
  id: string;
  company: string;
  role: string;
  status: "Open" | "Application Closed" | "Interview In Progress" | "Results Awaited";
  applicationDeadline: string;
  rounds: DriveRound[];
};

export const placementDrives: PlacementDrive[] = [
  {
    id: "infosys-systems-engineer",
    company: "Infosys",
    role: "Systems Engineer",
    status: "Open",
    applicationDeadline: "Mar 27, 2026",
    rounds: [
      { name: "Aptitude Test", date: "Mar 28, 2026" },
      { name: "Coding Round", date: "Mar 30, 2026" },
      { name: "HR Interview", date: "Apr 1, 2026" },
    ],
  },
  {
    id: "tcs-ase",
    company: "TCS",
    role: "Assistant Systems Engineer",
    status: "Open",
    applicationDeadline: "Apr 1, 2026",
    rounds: [
      { name: "TCS NQT", date: "Apr 2, 2026" },
      { name: "Technical Interview", date: "Apr 5, 2026" },
      { name: "HR Discussion", date: "Apr 7, 2026" },
    ],
  },
  {
    id: "ey-technology-consultant",
    company: "EY",
    role: "Technology Consultant",
    status: "Interview In Progress",
    applicationDeadline: "Apr 8, 2026",
    rounds: [
      { name: "Online Assessment", date: "Apr 10, 2026" },
      { name: "Group Discussion", date: "Apr 12, 2026" },
      { name: "Technical Interview", date: "Apr 14, 2026" },
      { name: "HR Interview", date: "Apr 16, 2026" },
    ],
  },
  {
    id: "ibm-associate-developer",
    company: "IBM",
    role: "Associate Developer",
    status: "Results Awaited",
    applicationDeadline: "Apr 13, 2026",
    rounds: [
      { name: "Coding Challenge", date: "Apr 15, 2026" },
      { name: "Technical Interview", date: "Apr 17, 2026" },
      { name: "Managerial Interview", date: "Apr 18, 2026" },
    ],
  },
];
