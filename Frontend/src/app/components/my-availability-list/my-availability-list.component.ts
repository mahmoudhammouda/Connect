import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Availability } from '../../models/availability.model';
import { AvailabilityFormComponent } from '../availability-form/availability-form.component';

@Component({
  selector: 'app-my-availabilities',
  standalone: true,
  imports: [CommonModule, FormsModule, AvailabilityFormComponent],
  templateUrl: './my-availability-list.component.html',
  styleUrls: ['./my-availability-list.component.scss']
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