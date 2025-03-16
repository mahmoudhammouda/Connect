import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { inject } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  template: `
    <div class="relative" clickOutside (clickOutside)="isOpen = false">
      <button 
        (click)="isOpen = !isOpen"
        class="flex items-center gap-2 focus:outline-none"
      >
        <img 
          [src]="user.photoUrl || 'https://ui-avatars.com/api/?name=' + user.firstName + '+' + user.lastName"
          [alt]="user.firstName"
          class="w-8 h-8 rounded-full"
        >
        <span class="text-sm font-medium">{{user.firstName}} {{user.lastName}}</span>
        <span class="material-icons text-gray-400 text-lg">expand_more</span>
      </button>

      <!-- Dropdown Menu -->
      @if (isOpen) {
        <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
          <a 
            href="#" 
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <span class="material-icons text-gray-400 text-base">person</span>
            Edit Profile
          </a>
          <a 
            href="#" 
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <span class="material-icons text-gray-400 text-base">lock</span>
            Change Password
          </a>
          <a 
            href="#" 
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <span class="material-icons text-gray-400 text-base">business</span>
            Placement Sectors
          </a>
          <a 
            href="#" 
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <span class="material-icons text-gray-400 text-base">groups</span>
            Managed Clients
          </a>
          <div class="border-t border-gray-100 my-1"></div>
          <button 
            (click)="logout()"
            class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <span class="material-icons text-red-600 text-base">logout</span>
            Sign Out
          </button>
        </div>
      }
    </div>
  `
})
export class UserProfileComponent {
  @Input() user!: User;
  isOpen = false;

  private userService = inject(UserService);

  logout() {
    this.userService.logout();
    this.isOpen = false;
  }
}