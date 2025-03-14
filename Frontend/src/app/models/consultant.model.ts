export interface Consultant {
  id: string;
  reference: string;
  availability: {
    startDate: Date;
    isFullRemote: boolean;
  };
  expertise: string[];
  role: string;
  preferences: string[];
  mobility: string;
  workLocation: 'remote' | 'hybrid' | 'onsite';
  additionalMobilityInfo?: string;
  seniority: 'less_than_3' | 'between_3_and_10' | 'more_than_10';
  description: string;
  status: 'immediate' | 'soon' | 'inactive';
  contractType: 'cdi' | 'freelance' | 'cdd';
  isLocked: boolean;
  isSubcontractor: boolean;
}