export interface JobRole {
  id: string;
  name: string;
  category:
    | "Web Development"
    | "AI & ML"
    | "Cloud Computing"
    | "Mobile Development"
    | "Cyber Security";
  requiredSkills: string[];
  students: number;
  status: "Active" | "Inactive";
}

export const initialJobRoles: JobRole[] = [
  {
    id: "1",
    name: "Frontend Developer",
    category: "Web Development",
    requiredSkills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
    ],
    students: 54,
    status: "Active",
  },
  {
    id: "2",
    name: "Backend Developer",
    category: "Web Development",
    requiredSkills: [
      "Node.js",
      "Express",
      "SQL",
    ],
    students: 38,
    status: "Active",
  },
  {
    id: "3",
    name: "Data Scientist",
    category: "AI & ML",
    requiredSkills: [
      "Python",
      "TensorFlow",
      "SQL",
    ],
    students: 27,
    status: "Inactive",
  },
];