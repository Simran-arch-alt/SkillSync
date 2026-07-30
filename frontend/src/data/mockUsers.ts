export interface MockUser {
    name: string;
    email: string;
    password: string;
    role: "Admin" | "Student";
}

export const mockUsers = [
  {
    email: "admin@skillsync.com",
    password: "admin123",
    role: "Admin",
  },
  {
    email: "student@skillsync.com",
    password: "student123",
    role: "Student",
  },
];