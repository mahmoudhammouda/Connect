import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Availability } from '../../models/availability.model';
import { AvailabilityFormComponent } from '../availability-form/availability-form.component';

@Component({
  selector: 'app-my-availabilities',
  standalone: true,
  imports: [CommonModule, FormsModule, AvailabilityFormComponent],
  template: `
    <div class="p-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">My Posted Availabilities</h2>
        <button 
          (click)="openAvailabilityForm()"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
        >
          <span class="material-icons text-sm">add</span>
          Post New Availability
        </button>
      </div>

      <!-- Filter Bar -->
      <div class="mb-6 flex gap-4">
        <select 
          [(ngModel)]="statusFilter"
          (ngModelChange)="applyFilters()"
          class="border rounded-lg p-2"
        >
          <option value="">All Statuses</option>
          <option value="immediate">Available Now</option>
          <option value="soon">Available Soon</option>
          <option value="inactive">Not Available</option>
        </select>
        <select 
          [(ngModel)]="typeFilter"
          (ngModelChange)="applyFilters()"
          class="border rounded-lg p-2"
        >
          <option value="">All Types</option>
          <option value="direct">Direct</option>
          <option value="subcontractor">Subcontractor</option>
        </select>
      </div>

      <!-- Availabilities List -->
      <div class="space-y-4">
        @for (availability of filteredAvailabilities; track availability.id) {
          <div class="border rounded-lg p-4 bg-white shadow-sm">
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-gray-500 text-sm">{{availability.reference}}</span>
                  <div class="flex items-center gap-2">
                    <div [class]="getStatusDotClass(availability.status)"></div>
                    <span class="text-sm font-medium">{{getStatusText(availability.status)}}</span>
                    <label class="relative inline-flex items-center cursor-pointer ml-4">
                      <input 
                        type="checkbox" 
                        class="sr-only peer"
                        [checked]="availability.isActive"
                        (change)="toggleAvailability($event, availability)"
                      >
                      <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      <span class="ml-2 text-sm text-gray-600">{{availability.isActive ? 'Active' : 'Inactive'}}</span>
                    </label>
                  </div>
                  @if (availability.isSubcontractor) {
                    <span class="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <span class="material-icons text-sm">business</span>
                      Subcontractor
                    </span>
                  }
                </div>
                <h3 class="text-lg font-semibold mb-1">{{availability.role}}</h3>
                <div class="text-sm text-gray-600 mb-2">
                  Available from {{availability.availability.startDate | date}} • {{availability.mobility}}
                </div>
                <div class="flex flex-wrap gap-2 mb-3">
                  @for (skill of availability.expertise; track skill) {
                    <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {{skill}}
                    </span>
                  }
                </div>
                <p class="text-gray-700">{{availability.description}}</p>
              </div>
              
              <div class="flex items-start gap-2">
                <button 
                  (click)="openAvailabilityForm(availability)"
                  class="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  title="Edit"
                >
                  <span class="material-icons">edit</span>
                </button>
                <button 
                  (click)="deleteAvailability(availability)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                  title="Delete"
                >
                  <span class="material-icons">delete</span>
                </button>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4 text-sm text-gray-600">
                  <span class="flex items-center gap-1">
                    <span class="material-icons text-sm">calendar_today</span>
                    Posted on {{availability.availability.startDate | date}}
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="material-icons text-sm">visibility</span>
                    24 views
                  </span>
                </div>
                <button 
                  class="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-md transition-colors duration-200 flex items-center gap-1"
                  (click)="shareOnLinkedIn(availability)"
                >
                  <span class="material-icons text-sm">share</span>
                  Share on LinkedIn
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Availability Form Modal -->
    <app-availability-form
      [isOpen]="showAvailabilityForm"
      [availability]="selectedAvailability"
      (closeModal)="closeAvailabilityForm()"
      (save)="handleAvailabilitySubmit($event)"
    ></app-availability-form>
  `
})
export class MyAvailabilityListComponent {
  // Filters
  statusFilter = '';
  typeFilter = '';
  
  // Modal state
  showAvailabilityForm = false;
  selectedAvailability: Availability | null = null;

  // Mock data - this would come from a service in a real app
  availabilities: Availability[] = [
    // Using the same availability data structure
  ];
  
  filteredAvailabilities: Availability[] = [];

  constructor() {
    // Initialize with all availabilities
    this.filteredAvailabilities = this.availabilities;
  }

  toggleAvailability(event: Event, availability: Availability): void {
    const target = event.target as HTMLInputElement;
    availability.isActive = target.checked;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredAvailabilities = this.availabilities.filter(availability => {
      const matchesStatus = !this.statusFilter || availability.status === this.statusFilter;
      const matchesType = !this.typeFilter || 
        (this.typeFilter === 'subcontractor' ? availability.isSubcontractor : !availability.isSubcontractor);
      
      return matchesStatus && matchesType;
    });
  }

  openAvailabilityForm(availability: Availability | null = null) {
    this.selectedAvailability = availability;
    this.showAvailabilityForm = true;
  }

  closeAvailabilityForm() {
    this.showAvailabilityForm = false;
    this.selectedAvailability = null;
  }

  handleAvailabilitySubmit(formData: any) {
    if (this.selectedAvailability) {
      // Update existing availability
      const index = this.availabilities.findIndex(a => a.id === this.selectedAvailability!.id);
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
          additionalMobilityInfo: formData.additionalMobilityInfo
        };
      }
    } else {
      // Create new availability
      const newAvailability: Availability = {
        id: (this.availabilities.length + 1).toString(),
        reference: `AVAIL-${(this.availabilities.length + 1).toString().padStart(3, '0')}`,
        role: 'New Role', // This would come from user profile
        seniority: 'between_3_and_10', // This would come from user profile
        mobility: formData.workLocation === 'remote' ? 'Remote' : 
                 formData.workLocation === 'hybrid' ? 'Hybrid' : 'On-site',
        expertise: [], // This would come from user profile
        workLocation: formData.workLocation,
        availability: {
          startDate: new Date(formData.startDate),
          isFullRemote: formData.workLocation === 'remote'
        },
        status: formData.status,
        preferences: [],
        description: formData.description,
        contractType: formData.contractType,
        isLocked: false,
        isSubcontractor: false,
        additionalMobilityInfo: formData.additionalMobilityInfo
      };
      this.availabilities.unshift(newAvailability);
    }

    this.applyFilters();
    this.closeAvailabilityForm();
  }

  deleteAvailability(availability: Availability) {
    if (confirm('Are you sure you want to delete this availability?')) {
      const index = this.availabilities.findIndex(a => a.id === availability.id);
      if (index !== -1) {
        this.availabilities.splice(index, 1);
        this.applyFilters();
      }
    }
  }

  shareOnLinkedIn(availability: Availability) {
    // Implement LinkedIn sharing
    console.log('Sharing on LinkedIn:', availability);
  }

  getStatusDotClass(status: string): string {
    const baseClasses = 'w-2.5 h-2.5 rounded-full';
    switch (status) {
      case 'immediate':
        return `${baseClasses} bg-green-500`;
      case 'soon':
        return `${baseClasses} bg-yellow-500`;
      case 'inactive':
        return `${baseClasses} bg-gray-400`;
      default:
        return baseClasses;
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'immediate':
        return 'Available Now';
      case 'soon':
        return 'Available Soon';
      case 'inactive':
        return 'Not Available';
      default:
        return status;
    }
  }
}