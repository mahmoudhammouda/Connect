import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { AvailabilityListComponent } from '../availability-list/availability-list.component';
import { AvailabilityFormComponent } from '../availability-form/availability-form.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Availability } from '../../models/availability.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board-consultant',
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    AvailabilityListComponent,
    AvailabilityFormComponent,
    LoginModalComponent
  ],
  templateUrl: './board-consultant.component.html',
  styleUrls: ['./board-consultant.component.scss']
})
export class BoardConsultantComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  
  // Tab state
  activeTab: 'available' | 'mine' = 'available';
  showLoginModal = false;
  showAvailabilityForm = false;
  availabilities: Availability[] = [
    // Copy the availabilities array from board.component.ts
  ];
  selectedAvailability: Availability | null = null;

  get currentUser() {
    return this.userService.getCurrentUser()();
  }

  constructor() {
    // Redirect non-consultants to main board
    if (this.currentUser && this.currentUser.role !== 'freelance') {
      this.router.navigate(['/board']);
      return;
    }
  }

  openAvailabilityForm(availability: Availability | null = null): void {
    this.selectedAvailability = availability;
    this.showAvailabilityForm = true;
  }

  closeAvailabilityForm(): void {
    this.showAvailabilityForm = false;
    this.selectedAvailability = null;
  }

  handleAvailabilitySubmit(formData: any): void {
    if (!this.selectedAvailability) {
      this.createNewAvailability(formData);
    } else {
      const index = this.availabilities.findIndex(c => c.id === this.selectedAvailability!.id);
      if (index !== -1) {
        this.availabilities[index] = {
          ...this.availabilities[index],
          status: formData.status,
          workLocation: formData.workLocation,
          mobility: formData.workLocation === 'remote' ? 'Remote' : 
                   formData.workLocation === 'hybrid' ? 'Hybrid' : 'On-site',
          availability: {
            startDate: new Date(formData.startDate),
            isFullRemote: formData.workLocation === 'remote'
          },
          description: formData.description,
          contractType: formData.contractType,
          isLocked: formData.isLocked,
          isActive: true
        };
      }
    }
    this.closeAvailabilityForm();
  }

  private createNewAvailability(formData: any): void {
    const newAvailability: Availability = {
      id: (this.availabilities.length + 1).toString(),
      reference: `AVAIL-${(this.availabilities.length + 1).toString().padStart(3, '0')}`,
      role: 'New Role',
      seniority: 'between_3_and_10',
      mobility: formData.workLocation === 'remote' ? 'Remote' : 
               formData.workLocation === 'hybrid' ? 'Hybrid' : 'On-site',
      expertise: [],
      workLocation: formData.workLocation,
      availability: {
        startDate: new Date(formData.startDate),
        isFullRemote: formData.workLocation === 'remote'
      },
      status: formData.status,
      preferences: [],
      description: formData.description,
      contractType: formData.contractType,
      isLocked: formData.isLocked,
      isSubcontractor: false,
      isActive: true,
      cities: []
    };
    this.availabilities.unshift(newAvailability);
  }
  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  handleLoginEvent(userData: any): void {
    this.userService.setCurrentUser(userData);
    this.closeLoginModal();
  }
}