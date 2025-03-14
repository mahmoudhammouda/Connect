import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { Consultant } from '../../models/consultant.model';

interface City {
  name: string;
  country: string;
  countryCode: string;
}

@Component({
  selector: 'app-availability-form',
  standalone: true,
  imports: [CommonModule, FormsModule, EditorModule],
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

            <!-- Profile Lock -->
            <div>
              <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  [(ngModel)]="formData.isLocked"
                  name="isLocked"
                  class="rounded border-gray-300"
                >
                Lock profile (only show basic information to recruiters)
              </label>
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

            <!-- Cities -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Preferred Cities
              </label>
              <div class="flex flex-wrap gap-2 mb-2">
                @for (city of formData.cities; track city.name) {
                  <span class="inline-flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full text-sm">
                    <img 
                      [src]="'https://flagcdn.com/' + city.countryCode.toLowerCase() + '.svg'"
                      [alt]="city.country"
                      class="w-4 h-4 rounded-sm"
                    >
                    {{city.name}}
                    <button 
                      (click)="removeCity(city)"
                      class="text-blue-600 hover:text-blue-800"
                    >×</button>
                  </span>
                }
              </div>
              <select 
                (change)="addCity($event)"
                class="w-full p-2 border rounded-md"
              >
                <option value="">Add a city...</option>
                @for (city of availableCities; track city.name) {
                  <option [value]="city.name">{{city.name}} ({{city.country}})</option>
                }
              </select>
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
                multiple
              >
                @for (location of workLocations; track location.value) {
                  <option [value]="location.value">{{location.label}}</option>
                }
              </select>
            </div>

            <!-- Contract Types -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Contract Types
              </label>
              <select
                [(ngModel)]="formData.contractTypes"
                name="contractTypes"
                class="w-full p-2 border rounded-md"
                multiple
              >
                @for (type of contractTypes; track type.value) {
                  <option [value]="type.value">{{type.label}}</option>
                }
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
              >
              </textarea>
            </div>

            <!-- LinkedIn Message -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Message for Recruiters (will be posted on LinkedIn)
              </label>
              <editor
                [(ngModel)]="formData.description"
                name="description"
                [init]="editorConfig"
                class="min-h-[200px]"
              ></editor>
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
    workLocations: [] as string[],
    contractTypes: [] as string[],
    additionalMobilityInfo: '',
    description: '',
    contractType: 'freelance',
    isLocked: false,
    cities: [] as City[]
  };

  workLocations = [
    { value: 'remote', label: 'Full Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'onsite', label: 'On-site' }
  ];

  contractTypes = [
    { value: 'freelance', label: 'Freelance' },
    { value: 'cdi', label: 'CDI' },
    { value: 'cdd', label: 'CDD' },
    { value: 'subcontracting', label: 'Sub-contracting' }
  ];

  availableCities: City[] = [
    { name: 'Paris', country: 'France', countryCode: 'FR' },
    { name: 'London', country: 'United Kingdom', countryCode: 'GB' },
    { name: 'Berlin', country: 'Germany', countryCode: 'DE' },
    { name: 'Madrid', country: 'Spain', countryCode: 'ES' },
    { name: 'Amsterdam', country: 'Netherlands', countryCode: 'NL' },
    { name: 'Brussels', country: 'Belgium', countryCode: 'BE' },
    { name: 'Milan', country: 'Italy', countryCode: 'IT' },
    { name: 'Zurich', country: 'Switzerland', countryCode: 'CH' }
  ];

  editorConfig = {
    base_url: '/tinymce',
    suffix: '.min',
    height: 300,
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | formatselect | ' +
      'bold italic backcolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | help'
  };

  addCity(event: Event) {
    const select = event.target as HTMLSelectElement;
    const cityName = select.value;
    if (cityName) {
      const city = this.availableCities.find(c => c.name === cityName);
      if (city && !this.formData.cities.some(c => c.name === city.name)) {
        this.formData.cities.push(city);
      }
      select.value = '';
    }
  }

  removeCity(city: City) {
    this.formData.cities = this.formData.cities.filter(c => c.name !== city.name);
  }

  get availableWorkLocations() {
    return this.workLocations.filter(
      location => !this.formData.workLocations.includes(location.value)
    );
  }

  get availableContractTypes() {
    return this.contractTypes.filter(
      type => !this.formData.contractTypes.includes(type.value)
    );
  }

  addWorkLocation(event: Event) {
    const select = event.target as HTMLSelectElement;
    const locationValue = select.value;
    if (locationValue && !this.formData.workLocations.includes(locationValue)) {
      this.formData.workLocations.push(locationValue);
    }
    select.value = '';
  }

  removeWorkLocation(locationValue: string) {
    this.formData.workLocations = this.formData.workLocations.filter(
      value => value !== locationValue
    );
  }

  addContractType(event: Event) {
    const select = event.target as HTMLSelectElement;
    const typeValue = select.value;
    if (typeValue && !this.formData.contractTypes.includes(typeValue)) {
      this.formData.contractTypes.push(typeValue);
    }
    select.value = '';
  }

  removeContractType(typeValue: string) {
    this.formData.contractTypes = this.formData.contractTypes.filter(
      value => value !== typeValue
    );
  }

  getWorkLocationLabel(value: string): string {
    return this.workLocations.find(l => l.value === value)?.label || value;
  }

  getContractTypeLabel(value: string): string {
    return this.contractTypes.find(t => t.value === value)?.label || value;
  }

  ngOnInit() {
    if (this.consultant) {
      this.formData = {
        status: this.consultant.status,
        startDate: this.consultant.availability.startDate.toISOString().split('T')[0],
        workLocation: this.consultant.workLocation,
        workLocations: [this.consultant.workLocation],
        additionalMobilityInfo: this.consultant.additionalMobilityInfo || '',
        contractTypes: [this.consultant.contractType],
        description: this.consultant.description,
        contractType: this.consultant.contractType,
        isLocked: this.consultant.isLocked,
        cities: []
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