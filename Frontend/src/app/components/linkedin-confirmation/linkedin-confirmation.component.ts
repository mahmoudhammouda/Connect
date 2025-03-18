import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-linkedin-confirmation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
        @if (showConfirmation) {
          <div class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-md z-10">
            <div class="text-center px-6">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <span class="material-icons text-green-600">check</span>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Email Confirmation Sent!</h3>
              <p class="text-gray-600 mb-6">Please check {{userData.email}} to verify your account.</p>
              <button
                (click)="handleConfirmationAcknowledge()"
                class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                OK, I understand
              </button>
            </div>
          </div>
        }

        <div class="mt-3">
          <div class="flex items-center justify-center mb-6">
            <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
              <img 
                [src]="userData.photoUrl || 'https://ui-avatars.com/api/?name=' + userData.firstName + '+' + userData.lastName" 
                [alt]="userData.firstName + ' ' + userData.lastName"
                class="w-20 h-20 rounded-full"
              >
            </div>
          </div>

          <h3 class="text-lg font-medium text-center mb-6">Confirm Your Information</h3>

          <div class="space-y-4">
            <!-- Name Fields -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  [(ngModel)]="userData.firstName"
                  class="w-full p-2 border rounded-md"
                  placeholder="First Name"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  [(ngModel)]="userData.lastName"
                  class="w-full p-2 border rounded-md"
                  placeholder="Last Name"
                >
              </div>
            </div>

            <!-- Email Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email Address
                <span class="text-red-500">*</span>
              </label>
              <input
                type="email"
                [(ngModel)]="userData.email"
                class="w-full p-2 border rounded-md"
                placeholder="your@email.com"
                [class.border-red-500]="showEmailError"
                (input)="validateEmail()"
              >
              @if (showEmailError) {
                <p class="mt-1 text-sm text-red-500">Please enter a valid email address</p>
              }
            </div>

            <!-- Role Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Select Your Role</label>
              <div class="space-y-2">
                <label class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    [(ngModel)]="userData.role"
                    name="role"
                    value="recruiter"
                    class="mr-3"
                  >
                  <div>
                    <div class="font-medium">Tech Recruiter</div>
                    <div class="text-sm text-gray-500">I help companies find the best tech talent</div>
                  </div>
                </label>
                <label class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    [(ngModel)]="userData.role"
                    name="role"
                    value="business_developer"
                    class="mr-3"
                  >
                  <div>
                    <div class="font-medium">Business Developer</div>
                    <div class="text-sm text-gray-500">I connect consultants with great opportunities</div>
                  </div>
                </label>
                <label class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    [(ngModel)]="userData.role"
                    name="role"
                    value="consultant"
                    class="mr-3"
                  >
                  <div>
                    <div class="font-medium">Consultant</div>
                    <div class="text-sm text-gray-500">I'm looking for new projects and opportunities</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              (click)="close()"
              class="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              (click)="handleConfirm()"
              [disabled]="!isValid"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LinkedInConfirmationComponent {
  @Input() isOpen = false;
  @Input() userData: Partial<User> = {
    firstName: '',
    lastName: '',
    email: '',
    role: 'consultant'
  };
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<User>();

  private router = inject(Router);
  showEmailError = false;
  showConfirmation = false;
  emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  get isValid(): boolean {
    return !!(this.userData.firstName && 
              this.userData.lastName && 
              this.userData.email &&
              this.emailRegex.test(this.userData.email) &&
              this.userData.role);
  }

  validateEmail(): void {
    this.showEmailError = !!this.userData.email && !this.emailRegex.test(this.userData.email);
  }

  close(): void {
    this.closeModal.emit();
  }

  handleConfirm(): void {
    if (this.isValid) {
      this.showConfirmation = true;
    }
  }

  handleConfirmationAcknowledge(): void {
    this.showConfirmation = false;
    this.confirm.emit(this.userData as User);
    
    // Redirect to appropriate board based on user role
    if (this.userData.role === 'consultant') {
      this.router.navigate(['/consultant']);
    } else {
      this.router.navigate(['/board']);
    }
  }
}