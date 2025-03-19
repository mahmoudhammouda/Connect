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
import { NotificationsComponent } from './app/components/notifications/notifications.component';
import { inject } from '@angular/core';
import { UserService } from './app/services/user.service';
import '@angular/compiler';
import { NgModule } from '@angular/core';
import { consultantGuard } from './app/guards/consultant.guard';
import { recruiterGuard } from './app/guards/recruiter.guard';

const routes: Routes = [
  { path: '', component: BoardComponent },
  { path: 'board', component: BoardComponent },
  { path: 'consultant', component: BoardConsultantComponent, canActivate: [consultantGuard] },
  { path: 'recruiter', component: BoardRecruiterComponent, canActivate: [recruiterGuard] },
  { path: 'notifications', component: BoardConsultantComponent, canActivate: [consultantGuard] }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, UserProfileComponent, LoginModalComponent, NotificationsComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow-lg relative z-50">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <h1 class="text-xl font-bold">FastConnect</h1>
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
                <!-- Show notifications for both consultants and recruiters -->
                @if (userService.getCurrentUser()()?.role === 'consultant' || 
                     userService.getCurrentUser()()?.role === 'recruiter' || 
                     userService.getCurrentUser()()?.role === 'business_developer') {
                  <app-notifications class="mr-4"></app-notifications>
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
  name = 'FastConnect';
  showLoginModal = false;
  userService = inject(UserService);
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