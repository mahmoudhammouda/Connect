import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { User } from '../../models/user.model';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { PositionListComponent } from '../position-list/position-list.component';
import { AvailabilityListComponent } from '../availability-list/availability-list.component';
import { AvailabilityFormComponent } from '../availability-form/availability-form.component';
import { Router } from '@angular/router';
import { Availability } from '../../models/availability.model';

@Component({
  selector: 'app-board-recruiter',
  standalone: true,
  imports: [CommonModule, LoginModalComponent, HeroSectionComponent, PositionListComponent, AvailabilityListComponent, AvailabilityFormComponent],
  templateUrl: './board-recruiter.component.html',
  styleUrls: ['./board-recruiter.component.scss']
})
export class BoardRecruiterComponent {
  // Tab state
  activeTab: 'available' | 'subcontractors' | 'open-position' = 'available';
  activeHeroTab: 'consultant' | 'recruiter' = 'recruiter';

  // Modal state
  showLoginModal = false;
  showAvailabilityForm = false;
  selectedAvailability: Availability | null = null;

  // Country data for dropdown
  uniqueCountries: Array<{ code: string; name: string }> = [
    { code: 'fr', name: 'France' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'de', name: 'Germany' },
    { code: 'es', name: 'Spain' },
    { code: 'it', name: 'Italy' },
    { code: 'nl', name: 'Netherlands' },
    { code: 'be', name: 'Belgium' },
    { code: 'ch', name: 'Switzerland' }
  ];

  private userService = inject(UserService);
  private router = inject(Router);

  get currentUser() {
    return this.userService.getCurrentUser()();
  }

  // Method to handle tab change event from hero section
  setActiveTab(tab: 'available' | 'open-position'): void {
    this.activeTab = tab;
  }

  getCountryName(code: string): string {
    return this.uniqueCountries.find(c => c.code === code.toLowerCase())?.name || '';
  }

  // LinkedIn related methods
  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  handleLoginEvent(userData: any): void {
    this.userService.setCurrentUser(userData);
    this.closeLoginModal();
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
    // Handle availability submission
    this.closeAvailabilityForm();
  }
}
