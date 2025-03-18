export type UserRole = 'recruiter' | 'business_developer' | 'consultant';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string;
  role: UserRole;
  linkedinUrl?: string;
  isLinkedInVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}