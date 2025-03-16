import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div class="text-center">
        <div class="mb-4">
          <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <h3 class="text-xl font-medium text-gray-900 mb-2">{{title}}</h3>
        <p class="text-gray-500">{{message}}</p>
      </div>
    </div>
  `
})
export class LoadingScreenComponent {
  @Input() isOpen = false;
  @Input() title = 'Connecting to LinkedIn';
  @Input() message = 'Please wait while we verify your profile...';
}