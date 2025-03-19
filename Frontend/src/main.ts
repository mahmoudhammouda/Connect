import { Component, importProvidersFrom, signal } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './app/components/board/board.component';
import { BoardConsultantComponent } from './app/components/board-consultant/board-consultant.component';
import { BoardRecruiterComponent } from './app/components/board-recruiter/board-recruiter.component';
import { UserProfileComponent } from './app/components/user-profile/user-profile.component';
import { User } from './app/models/user.model';
import { LoginModalComponent } from './app/components/login-modal/login-modal.component';
import { inject } from '@angular/core';
import { UserService } from './app/services/user.service';
import '@angular/compiler';
import { NgModule } from '@angular/core';
import { consultantGuard } from './app/guards/consultant.guard';
import { recruiterGuard } from './app/guards/recruiter.guard';

// Define interface for unlock requests
interface UnlockRequest {
  id: string;
  recruiterId: string;
  recruiterName: string;
  company: string;
  message: string;
  date: Date;
  status: 'pending' | 'accepted' | 'refused';
}

const routes: Routes = [
  { path: '', component: BoardComponent },
  { path: 'board', component: BoardComponent },
  { path: 'consultant', component: BoardConsultantComponent, canActivate: [consultantGuard] },
  { path: 'recruiter', component: BoardRecruiterComponent, canActivate: [recruiterGuard] }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, UserProfileComponent, LoginModalComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow-lg relative z-50">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <h1 class="text-xl font-bold">FactConnect</h1>
              </div>
              <div class="hidden sm:ml-6 sm:flex sm:space-x-6">
                <!-- Navigation links removed as the site opens directly to /board -->
              </div>
            </div>
            <div class="flex items-center">
              @if (!userService.getCurrentUser()()) {
              <button 
                (click)="showLoginModal = true"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                Sign In with LinkedIn
              </button>
              } @else {
                <!-- Notification Bell (only shown for consultants) -->
                @if (userService.getCurrentUser()()?.role === 'consultant') {
                  <div class="relative mr-4">
                    <button 
                      (click)="toggleNotifications($event)"
                      class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 focus:outline-none transition-colors notifications-bell"
                    >
                      <span class="material-icons text-gray-700">notifications</span>
                      <!-- Notification badge -->
                      <span 
                        *ngIf="unlockRequests.length > 0" 
                        class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full"
                      >
                        {{unlockRequests.length}}
                      </span>
                    </button>
                    
                    <!-- Notifications Panel -->
                    <div 
                      *ngIf="showNotifications" 
                      class="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200 notifications-dropdown"
                    >
                      <div class="p-3 border-b bg-gray-50 flex justify-between items-center">
                        <h3 class="text-sm font-medium text-gray-700">Notifications</h3>
                        <span class="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">Mark all as read</span>
                      </div>
                      
                      <div class="max-h-96 overflow-y-auto">
                        <div *ngIf="unlockRequests.length === 0" class="p-4 text-center text-gray-500">
                          <span class="material-icons text-gray-400 text-4xl mb-2">notifications_off</span>
                          <p>No notifications at this time</p>
                        </div>
                        
                        <div *ngFor="let request of unlockRequests" class="p-4 border-b hover:bg-gray-50">
                          <div class="flex items-start gap-4">
                            <div class="flex-shrink-0">
                              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span class="material-icons text-blue-600">person</span>
                              </div>
                            </div>
                            <div class="flex-1 min-w-0">
                              <div class="flex justify-between items-start">
                                <p class="text-sm font-medium text-gray-900">
                                  {{request.recruiterName}}
                                </p>
                                <p class="text-xs text-gray-400">
                                  {{request.date | date:'MMM d, h:mm a'}}
                                </p>
                              </div>
                              <p class="text-xs text-gray-500">
                                {{request.company}}
                              </p>
                              <p class="mt-2 text-sm text-gray-600">
                                {{request.message}}
                              </p>
                              <div class="mt-3 flex gap-2">
                                <button 
                                  (click)="acceptRequest(request.id, $event)" 
                                  class="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                                >
                                  Accept
                                </button>
                                <button 
                                  (click)="refuseRequest(request.id, $event)" 
                                  class="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                                >
                                  Refuse
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- See All Link -->
                      <div class="p-3 border-t bg-gray-50 text-center">
                        <a 
                          routerLink="/notifications" 
                          (click)="showNotifications = false"
                          class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          See all notifications
                        </a>
                      </div>
                    </div>
                  </div>
                }
                <app-user-profile [user]="userService.getCurrentUser()()!" />
              }
            </div>
          </div>
        </div>
      </nav>
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Login Modal -->
      <app-modal
        [isOpen]="showLoginModal"
        (closeModal)="showLoginModal = false"
      ></app-modal>
    </div>
  `
})
export class App {
  name = 'FactConnect';
  showLoginModal = false;
  showNotifications = false;
  userService = inject(UserService);
  
  // Sample unlock requests for demonstration
  unlockRequests: UnlockRequest[] = [
    {
      id: '1',
      recruiterId: 'r1',
      recruiterName: 'Sophie Martin',
      company: 'TechRecruit Partners',
      message: 'I have an exciting opportunity for a senior developer role at a fintech startup that matches your expertise.',
      date: new Date('2025-03-18T10:30:00'),
      status: 'pending'
    },
    {
      id: '2',
      recruiterId: 'r2',
      recruiterName: 'Thomas Dubois',
      company: 'Digital Talent Solutions',
      message: 'Our client is looking for a consultant with your profile for a 6-month project starting next month.',
      date: new Date('2025-03-17T15:45:00'),
      status: 'pending'
    },
    {
      id: '3',
      recruiterId: 'r3',
      recruiterName: 'Emma Rodriguez',
      company: 'Global IT Staffing',
      message: 'We would like to discuss a potential role that requires your specific skills in backend development.',
      date: new Date('2025-03-16T09:15:00'),
      status: 'pending'
    }
  ];
  
  constructor() {
    // Add document click listener to close dropdown when clicking outside
    document.addEventListener('click', this.handleOutsideClick.bind(this));
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
  
  acceptRequest(requestId: string, event: Event): void {
    event.stopPropagation(); // Prevent event bubbling
    
    // Find the request
    const requestIndex = this.unlockRequests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) return;
    
    // Update the request status
    this.unlockRequests[requestIndex].status = 'accepted';
    
    // In a real application, you would make an API call to update the request status
    // and to unlock the profile for the specific recruiter
    console.log(`Request ${requestId} accepted. Profile unlocked for recruiter ${this.unlockRequests[requestIndex].recruiterName}`);
    
    // Remove the request from the list after a short delay to show the status change
    setTimeout(() => {
      this.unlockRequests = this.unlockRequests.filter(req => req.id !== requestId);
    }, 1500);
  }
  
  refuseRequest(requestId: string, event: Event): void {
    event.stopPropagation(); // Prevent event bubbling
    
    // Find the request
    const requestIndex = this.unlockRequests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) return;
    
    // Update the request status
    this.unlockRequests[requestIndex].status = 'refused';
    
    // In a real application, you would make an API call to update the request status
    console.log(`Request ${requestId} refused. Profile remains locked for recruiter ${this.unlockRequests[requestIndex].recruiterName}`);
    
    // Remove the request from the list after a short delay to show the status change
    setTimeout(() => {
      this.unlockRequests = this.unlockRequests.filter(req => req.id !== requestId);
    }, 1500);
  }
}

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    CommonModule
  ],
  bootstrap: [App]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch((err: Error) => console.error(err));