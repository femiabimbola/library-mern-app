export enum Role {
  USER = "USER",
  ADMIN = "ADMIN", // Adjust based on your actual ROLE_ENUM values
}

 interface User {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
  role: Role;
  lastActivityDate: string; // ISO date string
  createdAt: string; // ISO date string
}