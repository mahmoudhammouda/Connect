export interface UnlockRequest {
  id: string;
  type: 'consultant_request' | 'recruiter_response'; // Type of notification (consultant request or recruiter response)
  recruiterId: string;
  recruiterName: string;
  company: string;
  consultantId?: string;        // For recruiter responses
  consultantName?: string;      // For recruiter responses
  profileId?: string;           // ID of the profile in question
  message: string;
  date: Date;
  status: 'pending' | 'accepted' | 'refused';
}
