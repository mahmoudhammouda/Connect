import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { Availability } from '../../models/availability.model';

interface City {
  name: string;
  country: string;
  countryCode: string;
}

@Component({
  selector: 'app-availability-form',
  standalone: true,
  imports: [CommonModule, FormsModule, EditorModule],
  templateUrl: './availability-form.component.html',
  styleUrls: ['./availability-form.component.scss']
})
export class AvailabilityFormComponent {
  @Input() isOpen = false;
  @Input() availability: Availability | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  today = new Date().toISOString().split('T')[0];

  formData = {
    status: 'immediate',
    startDate: this.today,
    workLocations: [] as string[],
    contractTypes: [] as string[],
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
    skin_url: 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/skins/ui/oxide',
    content_css: 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/skins/content/default/content.min.css',
    readonly: false,
    height: 300,
    menubar: 'edit format',
    plugins: [
      'lists', 'link', 'image', 'charmap',
      'searchreplace', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    toolbar: [
      'undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor',
      'alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent',
      'removeformat | help'
    ],
    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px; }',
    statusbar: true,
    resize: true,
    branding: false,
    promotion: false
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
    if (this.availability) {
      this.formData = {
        status: this.availability.status,
        startDate: this.availability.availability.startDate.toISOString().split('T')[0],
        workLocations: [this.availability.workLocation],
        contractTypes: [this.availability.contractType],
        description: this.availability.description,
        contractType: this.availability.contractType,
        isLocked: this.availability.isLocked,
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