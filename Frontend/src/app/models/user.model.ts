export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string;
  role: 'recruiter' | 'business_developer' | 'freelance';
  linkedinUrl?: string;
  isLinkedInVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}