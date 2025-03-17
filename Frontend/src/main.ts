import { Component, importProvidersFrom, signal } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './app/components/board/board.component';
import { BoardConsultantComponent } from './app/components/board-consultant/board-consultant.component';
import { UserProfileComponent } from './app/components/user-profile/user-profile.component';
import { User } from './app/models/user.model';
import { LoginModalComponent } from './app/components/login-modal/login-modal.component';
import { inject } from '@angular/core';
import { UserService } from './app/services/user.service';
import '@angular/compiler';
import { NgModule } from '@angular/core';



const routes: Routes = [
  { path: '', component: BoardComponent },
  { path: 'board', component: BoardComponent },
  { path: 'consultant', component: BoardConsultantComponent }
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
                <a routerLink="/board" 
                   routerLinkActive="border-b-2 border-blue-500"
                   class="inline-flex items-center px-1 pt-1 text-gray-900">
                  Available Experts
                </a>
              </div>
            </div>
            <div class="flex items-center">
              @if (!userService.getCurrentUser()()) {
              <button 
                (click)="showLoginModal = true"
                class="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
              >
                Login with LinkedIn
              </button>
              } @else {
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