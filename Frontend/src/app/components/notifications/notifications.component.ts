import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UnlockRequest } from '../../models/unlock-request.model';
import { UserService } from '../../services/user.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  showNotifications = false;
  private documentClickListener: any;
  private userService = inject(UserService);
  
  // Sample unlock requests for consultants (unlock requests from recruiters)
  consultantNotifications: UnlockRequest[] = [
    {
      id: '1',
      type: 'consultant_request',
      recruiterId: 'r1',
      recruiterName: 'Sophie Martin',
      company: 'TechRecruit Partners',
      message: 'I have an exciting opportunity for a senior developer role at a fintech startup that matches your expertise.',
      date: new Date('2025-03-19T10:30:00'),
      status: 'pending'
    },
    {
      id: '2',
      type: 'consultant_request',
      recruiterId: 'r2',
      recruiterName: 'Thomas Dubois',
      company: 'Digital Talent Solutions',
      message: 'Our client is looking for a consultant with your profile for a 6-month project starting next month.',
      date: new Date('2025-03-18T15:45:00'),
      status: 'pending'
    },
    {
      id: '3',
      type: 'consultant_request',
      recruiterId: 'r3',
      recruiterName: 'Emma Rodriguez',
      company: 'Global IT Staffing',
      message: 'We would like to discuss a potential role that requires your specific skills in backend development.',
      date: new Date('2025-03-17T09:15:00'),
      status: 'pending'
    }
  ];
  
  // Sample notifications for recruiters (responses from consultants)
  recruiterNotifications: UnlockRequest[] = [
    {
      id: '101',
      type: 'recruiter_response',
      recruiterId: 'currentRecruiter', // Would be set to current user ID
      recruiterName: 'Current Recruiter',
      company: 'Your Company',
      consultantId: 'c1',
      consultantName: 'Jean Dupont',
      profileId: 'profile123',
      message: 'I have accepted your request to view my profile. You can now see my full details and contact information.',
      date: new Date('2025-03-19T09:15:00'),
      status: 'accepted'
    },
    {
      id: '102',
      type: 'recruiter_response',
      recruiterId: 'currentRecruiter',
      recruiterName: 'Current Recruiter',
      company: 'Your Company',
      consultantId: 'c2',
      consultantName: 'Marie Lambert',
      profileId: 'profile456',
      message: 'Thank you for your interest in my profile. Unfortunately, I am not available for new opportunities at this time.',
      date: new Date('2025-03-18T14:30:00'),
      status: 'refused'
    },
    {
      id: '103',
      type: 'recruiter_response',
      recruiterId: 'currentRecruiter',
      recruiterName: 'Current Recruiter',
      company: 'Your Company',
      consultantId: 'c3',
      consultantName: 'Lucas Bernard',
      profileId: 'profile789',
      message: 'I have accepted your connection request. I would be interested in discussing the opportunity you mentioned.',
      date: new Date('2025-03-17T11:45:00'),
      status: 'accepted'
    }
  ];
  
  // Returns notifications based on user role
  get notifications(): UnlockRequest[] {
    const user = this.userService.getCurrentUser()();
    if (!user) return [];
    
    if (user.role === 'consultant') {
      return this.consultantNotifications;
    } else if (user.role === 'recruiter' || user.role === 'business_developer') {
      return this.recruiterNotifications;
    }
    
    return [];
  }
  
  ngOnInit(): void {
    // Add document click listener to close dropdown when clicking outside
    this.documentClickListener = this.handleOutsideClick.bind(this);
    document.addEventListener('click', this.documentClickListener);
  }
  
  ngOnDestroy(): void {
    // Remove event listener when component is destroyed
    document.removeEventListener('click', this.documentClickListener);
  }
  
  // Handle clicks outside of notification dropdown
  handleOutsideClick(event: MouseEvent): void {
    // Skip if notifications aren't shown
    if (!this.showNotifications) return;
    
    // Check if the click is outside the notification dropdown
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.notifications-dropdown');
    const bell = document.querySelector('.notifications-bell');
    
    // If click is outside both the dropdown and the bell, close the dropdown
    if (dropdown && bell && !dropdown.contains(target) && !bell.contains(target)) {
      this.showNotifications = false;
    }
  }
  
  // Notification methods
  toggleNotifications(event: Event): void {
    event.stopPropagation(); // Prevent event bubbling
    this.showNotifications = !this.showNotifications;
  }
  
  // Get user role
  getUserRole(): string | null {
    const user = this.userService.getCurrentUser()();
    return user ? user.role : null;
  }
  
  // Accept an unlock request (for consultants)
  acceptRequest(requestId: string, event: Event): void {
    event.stopPropagation(); // Prevent event bubbling
    
    // Find the request
    const requestIndex = this.consultantNotifications.findIndex(req => req.id === requestId);
    if (requestIndex === -1) return;
    
    // Update the request status
    this.consultantNotifications[requestIndex].status = 'accepted';
    
    // In a real application, you would make an API call to update the request status
    // and to unlock the profile for the specific recruiter
    console.log(`Request ${requestId} accepted. Profile unlocked for recruiter ${this.consultantNotifications[requestIndex].recruiterName}`);
    
    // Remove the request from the list after a short delay to show the status change
    setTimeout(() => {
      this.consultantNotifications = this.consultantNotifications.filter(req => req.id !== requestId);
    }, 1500);
  }
  
  // Refuse an unlock request (for consultants)
  refuseRequest(requestId: string, event: Event): void {
    event.stopPropagation(); // Prevent event bubbling
    
    // Find the request
    const requestIndex = this.consultantNotifications.findIndex(req => req.id === requestId);
    if (requestIndex === -1) return;
    
    // Update the request status
    this.consultantNotifications[requestIndex].status = 'refused';
    
    // In a real application, you would make an API call to update the request status
    console.log(`Request ${requestId} refused. Profile remains locked for recruiter ${this.consultantNotifications[requestIndex].recruiterName}`);
    
    // Remove the request from the list after a short delay to show the status change
    setTimeout(() => {
      this.consultantNotifications = this.consultantNotifications.filter(req => req.id !== requestId);
    }, 1500);
  }
  
  // Dismiss a notification (for recruiters)
  dismissNotification(requestId: string, event: Event): void {
    event.stopPropagation(); // Prevent event bubbling
    
    // Find the notification
    const notificationIndex = this.recruiterNotifications.findIndex(req => req.id === requestId);
    if (notificationIndex === -1) return;
    
    console.log(`Notification ${requestId} dismissed.`);
    
    // Remove the notification from the list
    this.recruiterNotifications = this.recruiterNotifications.filter(req => req.id !== requestId);
  }
  
  // View profile (for recruiters who received an accepted response)
  viewProfile(profileId: string, event: Event): void {
    event.stopPropagation(); // Prevent event bubbling
    
    console.log(`Navigating to profile ${profileId}`);
    // In a real application, you would navigate to the profile page
    // this.router.navigate(['/profile', profileId]);
  }
}
