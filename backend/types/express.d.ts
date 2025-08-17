// types/express.d.ts
export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
  role: Role;
  lastActivityDate: string;
  createdAt: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AppUser; // Optional, as req.user is undefined if not authenticated
    }
  }
}

// export {}; // Make this a module