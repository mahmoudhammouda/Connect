import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingScreenComponent } from '../loading-screen/loading-screen.component';
import { LinkedInConfirmationComponent } from '../linkedin-confirmation/linkedin-confirmation.component';
import { User } from '../../models/user.model';
import { inject } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, LoadingScreenComponent, LinkedInConfirmationComponent],
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() login = new EventEmitter<User>();
  
  private userService = inject(UserService);

  showLoading = false;
  showConfirmation = false;
  userData: Partial<User> = {
    firstName: '',
    lastName: '',
    role: 'freelance'
  };

  close() {
    this.closeModal.emit();
  }

  async loginWithLinkedIn() {
    this.showLoading = true;
    
    try {
      // Simulate LinkedIn OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate fetching user data from LinkedIn
      this.userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        photoUrl: 'https://ui-avatars.com/api/?name=John+Doe',
        role: 'freelance',
        linkedinUrl: 'https://linkedin.com/in/johndoe',
        isLinkedInVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.showLoading = false;
      this.showConfirmation = true;
    } catch (error) {
      console.error('LinkedIn login failed:', error);
      // Handle error (show error message)
      this.showLoading = false;
    }
  }

  handleConfirm(userData: User) {
    this.userService.setCurrentUser(userData);
    this.login.emit(userData);
    this.close();
  }
}