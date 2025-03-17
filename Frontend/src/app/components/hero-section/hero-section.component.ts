import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 rounded-xl p-12 mb-8 text-white relative overflow-hidden min-h-[480px] flex flex-col">
      <!-- Background Network Illustration -->
      <div class="absolute inset-0 w-full h-full opacity-5">
        <img 
          src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/network-illustration.png" 
          alt="Network illustration"
          class="w-full h-full object-cover"
        >
      </div>
      
    
      <!-- Decorative Elements -->
      <div class="absolute top-0 right-0 w-1/2 h-full">
        <div class="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute top-40 right-40 w-32 h-32 bg-blue-400/10 rounded-full blur-xl"></div>
        <div class="absolute bottom-20 right-20 w-24 h-24 bg-blue-300/10 rounded-full blur-xl"></div>
      </div>

      <!-- Hero Tabs - Only show if not logged in -->
      @if (!currentUser) {
        <div class="border-b border-white/20 mb-10 relative z-10">
          <div class="flex -mb-px">
            <button 
              (click)="activeHeroTab = 'consultant'"
              class="px-10 py-4 font-medium transition-all duration-200 flex items-center gap-3 border-b-2"
              [class]="activeHeroTab === 'consultant' ? 
                'text-white border-white bg-white/5 shadow-lg' : 
                'text-blue-100 border-transparent hover:bg-white/5 hover:text-white'"
            >
              <span class="material-icons text-sm">person</span>
              I'm a Consultant
            </button>
            <button 
              (click)="activeHeroTab = 'recruiter'"
              class="px-10 py-4 font-medium transition-all duration-200 flex items-center gap-3 border-b-2"
              [class]="activeHeroTab === 'recruiter' ? 
                'text-white border-white bg-white/5 shadow-lg' : 
                'text-blue-100 border-transparent hover:bg-white/5 hover:text-white'"
            >
              <span class="material-icons text-sm">business</span>
              I'm a Recruiter or Business Partner
            </button>
          </div>
        </div>
      }

      <!-- Consultant Content -->
      <div class="max-w-3xl relative z-10 flex-1 flex flex-col justify-center" *ngIf="activeHeroTab === 'consultant' && !currentUser">
        <h1 class="text-3xl font-bold mb-4">Join 200+ Experts Getting Premium Projects</h1>
        <p class="text-xl mb-8 text-blue-100 leading-relaxed">Add your availability to get noticed by top recruiters and access exclusive opportunities. Our experts get contacted within 48 hours and receive priority access to high-value projects.</p>
        <div class="flex gap-4 items-center">
          <button 
            (click)="addAvailability.emit()"
            class="px-8 py-4 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium flex items-center gap-3 shadow-lg hover:shadow-xl"
          >
            <span class="material-icons text-sm">add</span>
            Add Your Availability
          </button>
          <div class="flex items-center gap-2 text-blue-100">
            <span class="material-icons">check_circle</span>
            <span>Already used by 200+ experts</span>
          </div>
        </div>
        <div class="mt-6 flex gap-8">
          <div class="flex items-center gap-2">
            <span class="material-icons text-blue-300">people</span>
            <span class="text-blue-100">Get Contacted Within 48h</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="material-icons text-blue-300">rocket_launch</span>
            <span class="text-blue-100">Exclusive Off-Market Projects</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="material-icons text-blue-300">verified</span>
            <span class="text-blue-100">Premium Rates & Conditions</span>
          </div>
        </div>
      </div>

      <!-- Logged-in Consultant Content -->
      <div class="max-w-3xl relative z-10 flex-1 flex flex-col justify-center" *ngIf="currentUser?.role === 'freelance'">
        <h1 class="text-3xl font-bold mb-4">Welcome back, {{currentUser?.firstName}}! 👋</h1>
        <p class="text-xl mb-6 text-blue-100">Stay visible to our network of 500+ recruiters by keeping your availability up to date. Our experts get contacted within 48 hours and receive priority access to high-value projects.</p>
        <div class="grid grid-cols-3 gap-6 mb-8">
          <div class="bg-white/10 rounded-lg p-4">
            <div class="text-3xl font-bold mb-1">24</div>
            <div class="text-blue-100">Profile Views</div>
            <div class="text-sm text-blue-200 mt-1">Last 30 days</div>
          </div>
          <div class="bg-white/10 rounded-lg p-4">
            <div class="text-3xl font-bold mb-1">12</div>
            <div class="text-blue-100">Connection Requests</div>
            <div class="text-sm text-blue-200 mt-1">Last 30 days</div>
          </div>
          <div class="bg-white/10 rounded-lg p-4">
            <div class="text-3xl font-bold mb-1">3</div>
            <div class="text-blue-100">Project Matches</div>
            <div class="text-sm text-blue-200 mt-1">This week</div>
          </div>
        </div>
        <div class="flex gap-4 items-center">
          <button 
            (click)="addAvailability.emit()"
            class="px-6 py-3 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium flex items-center gap-2"
          >
            <span class="material-icons text-sm">add</span>
            Add Your Availability
          </button>
        </div>
      </div>

      <!-- Recruiter Content -->
      <div class="max-w-3xl relative z-10 flex-1 flex flex-col justify-center" *ngIf="currentUser?.role === 'recruiter' || currentUser?.role === 'business_developer'">
        <h1 class="text-3xl font-bold mb-4">Welcome back, {{currentUser?.firstName}}! 👋</h1>
        <p class="text-xl mb-6 text-blue-100">Connect with our network of verified tech experts and accelerate your project staffing. Get instant access to pre-screened professionals ready for new opportunities.</p>
        <div class="grid grid-cols-3 gap-6 mb-8">
          <div class="bg-white/10 rounded-lg p-4">
            <div class="text-3xl font-bold mb-1">156</div>
            <div class="text-blue-100">Active Experts</div>
            <div class="text-sm text-blue-200 mt-1">Available now</div>
          </div>
          <div class="bg-white/10 rounded-lg p-4">
            <div class="text-3xl font-bold mb-1">45</div>
            <div class="text-blue-100">New Availabilities</div>
            <div class="text-sm text-blue-200 mt-1">This week</div>
          </div>
          <div class="bg-white/10 rounded-lg p-4">
            <div class="text-3xl font-bold mb-1">92%</div>
            <div class="text-blue-100">Response Rate</div>
            <div class="text-sm text-blue-200 mt-1">Last 30 days</div>
          </div>
        </div>
        <div class="flex gap-4 items-center">
          <button 
            (click)="addAvailability.emit()"
            class="px-8 py-4 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium flex items-center gap-3 shadow-lg hover:shadow-xl"
          >
            <span class="material-icons text-sm">group_add</span>
            Share Your Candidates' Availability
          </button>
          <button 
            routerLink="/requests"
            class="px-8 py-4 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium flex items-center gap-3 shadow-lg hover:shadow-xl"
          >
            <span class="material-icons text-sm">post_add</span>
            Share Your Expertise Request
          </button>
        </div>
      </div>
      
      <!-- Non-logged in Recruiter Content -->
      <div class="max-w-3xl relative z-10 flex-1 flex flex-col justify-center" *ngIf="!currentUser && activeHeroTab === 'recruiter'">
        <h1 class="text-3xl font-bold mb-4">Access Elite Tech Talent Network</h1>
        <p class="text-xl mb-6 text-blue-100">Whether you're a recruiter, business developer, or subcontractor, tap into our network of verified tech experts. Connect directly with pre-screened professionals and accelerate your project staffing.</p>
        <div class="flex gap-4 items-center">
          <button 
            (click)="addAvailability.emit()"
            class="px-8 py-4 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium flex items-center gap-3 shadow-lg hover:shadow-xl"
          >
            <span class="material-icons text-sm">group_add</span>
            Share Your Candidates' Availability
          </button>
          <button 
            routerLink="/requests"
            class="px-8 py-4 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium flex items-center gap-3 shadow-lg hover:shadow-xl"
          >
            <span class="material-icons text-sm">post_add</span>
            Share Your Expertise Request
          </button>
        </div>
        <div class="mt-6 flex gap-8">
          <div class="flex items-center gap-2">
            <span class="material-icons text-blue-300">groups</span>
            <span class="text-blue-100">200+ Active Experts</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="material-icons text-blue-300">bolt</span>
            <span class="text-blue-100">Fast Response Time</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="material-icons text-blue-300">business</span>
            <span class="text-blue-100">Sub-contracting Options</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HeroSectionComponent {
  @Input() currentUser: User | null = null;
  @Output() addAvailability = new EventEmitter<void>();
  
  activeHeroTab: 'consultant' | 'recruiter' = 'consultant';
}