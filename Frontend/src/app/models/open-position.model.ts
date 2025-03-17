export interface OpenPosition {
  id: string;
  reference: string;
  title: string;
  description: string;
  requiredExpertise: string[];
  seniority: 'less_than_3' | 'between_3_and_10' | 'more_than_10';
  workLocation: 'remote' | 'hybrid' | 'onsite';
  cities?: Array<{
    name: string;
    country: string;
    countryCode: string;
  }>;
  startDate: Date;
  contractType: 'cdi' | 'freelance' | 'cdd';
  postedBy: {
    id: string;
    firstName: string;
    lastName: string;
    photoUrl?: string;
    company: string;
  };
  postedDate: Date;
  isActive: boolean;
}