import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Consultant } from '../../models/consultant.model';

@Component({
  selector: 'app-availability-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Update Your Availability</h3>
          
          <form (submit)="handleSubmit($event)" class="space-y-4">
            <!-- Availability Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Availability Status
              </label>
              <div class="flex gap-4">
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    [(ngModel)]="formData.status"
                    value="immediate"
                    class="mr-2"
                  >
                  <span>Available Now</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    [(ngModel)]="formData.status"
                    value="soon"
                    class="mr-2"
                  >
                  <span>Available Soon</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    [(ngModel)]="formData.status"
                    value="inactive"
                    class="mr-2"
                  >
                  <span>Not Available</span>
                </label>
              </div>
            </div>

            <!-- Start Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                [(ngModel)]="formData.startDate"
                name="startDate"
                class="w-full p-2 border rounded-md"
                [min]="today"
              >
            </div>

            <!-- Work Location -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Work Location Preference
              </label>
              <select
                [(ngModel)]="formData.workLocation"
                name="workLocation"
                class="w-full p-2 border rounded-md"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </div>

            <!-- Additional Mobility Info -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Additional Mobility Information
              </label>
              <textarea
                [(ngModel)]="formData.additionalMobilityInfo"
                name="additionalMobilityInfo"
                rows="2"
                class="w-full p-2 border rounded-md"
                placeholder="E.g., Willing to travel 2 days per week, Available for occasional on-site meetings..."
              ></textarea>
            </div>

            <!-- LinkedIn Message -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Message for Recruiters (will be posted on LinkedIn)
              </label>
              <textarea
                [(ngModel)]="formData.description"
                name="description"
                rows="4"
                class="w-full p-2 border rounded-md"
                placeholder="Describe your experience, what you're looking for, and any other relevant information..."
              ></textarea>
            </div>

            <!-- Contract Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Preferred Contract Type
              </label>
              <select
                [(ngModel)]="formData.contractType"
                name="contractType"
                class="w-full p-2 border rounded-md"
              >
                <option value="freelance">Freelance</option>
                <option value="cdi">CDI</option>
                <option value="cdd">CDD</option>
              </select>
            </div>

            <!-- Buttons -->
            <div class="flex justify-end gap-2 mt-4">
              <button
                type="button"
                (click)="close()"
                class="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save & Share
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AvailabilityFormComponent {
  @Input() isOpen = false;
  @Input() consultant: Consultant | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  today = new Date().toISOString().split('T')[0];

  formData = {
    status: 'immediate',
    startDate: this.today,
    workLocation: 'remote',
    additionalMobilityInfo: '',
    description: '',
    contractType: 'freelance'
  };

  ngOnInit() {
    if (this.consultant) {
      this.formData = {
        status: this.consultant.status,
        startDate: this.consultant.availability.startDate.toISOString().split('T')[0],
        workLocation: this.consultant.workLocation,
        additionalMobilityInfo: this.consultant.additionalMobilityInfo || '',
        description: this.consultant.description,
        contractType: this.consultant.contractType
      };
    }
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    this.save.emit(this.formData);
    this.close();
  }

  close() {
    this.closeModal.emit();
  }
}