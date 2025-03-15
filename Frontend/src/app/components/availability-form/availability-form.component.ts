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

  removeLanguage(langName: string) {
    this.formData.languages = this.formData.languages.filter(l => l.name !== langName);
  }

  addLanguage(event: Event) {
    const select = event.target as HTMLSelectElement;
    const index = select.selectedIndex;
    if (index > 0) { // Skip the first "Add a language..." option
      const lang = this.availableLanguages[index - 1];
      if (!this.formData.languages.some(l => l.name === lang.name)) {
        this.formData.languages.push({ ...lang });
      }
      select.selectedIndex = 0;
    }
  }

  isLanguageSelected(langName: string): boolean {
    return this.formData.languages.some(l => l.name === langName);
  }

  today = new Date().toISOString().split('T')[0];

  formData = {
    status: 'immediate',
    startDate: this.today,
    expertise: [] as string[],
    role: '',
    jobPreferences: [] as string[],
    dailyRate: 0,
    yearsOfExperience: 0,
    languages: [] as Array<{ name: string; level: string }>,
    linkedinUrl: '',
    hidePhone: true,
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

  expertiseCategories = [
    { 
      name: 'Tech',
      subcategories: [
        {
          name: 'Languages & Frameworks',
          skills: ['Angular', '.NET', 'React', 'Vue.js', 'Node.js', 'Python', 'Java', 'Spring']
        },
        {
          name: 'Cloud & Databases',
          skills: ['AWS', 'Azure', 'GCP', 'MongoDB', 'PostgreSQL', 'MySQL']
        }
      ]
    },
    {
      name: 'Product',
      subcategories: [
        {
          name: 'Product Management',
          skills: ['Agile', 'Scrum', 'Product Strategy', 'User Research']
        }
      ]
    }
  ];

  allExpertise: string[] = [];

  constructor() {
    // Flatten all expertise into a single array
    this.expertiseCategories.forEach(category => {
      category.subcategories.forEach(subcat => {
        this.allExpertise = [...this.allExpertise, ...subcat.skills];
      });
    });
    this.allExpertise.sort();
  }

  toggleExpertise(skill: string): void {
    const index = this.formData.expertise.indexOf(skill);
    if (index === -1 && this.formData.expertise.length < 4) {
      this.formData.expertise.push(skill);
    } else if (index !== -1) {
      this.formData.expertise.splice(index, 1);
    }
  }

  handleExpertiseChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select.value) {
      this.toggleExpertise(select.value);
      select.value = '';
    }
  }

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

  availableLanguages = [
    { name: 'English', level: 'Professional' },
    { name: 'French', level: 'Professional' },
    { name: 'Arabic', level: 'Professional' },
    { name: 'Spanish', level: 'Professional' },
    { name: 'German', level: 'Professional' }
  ];

  availableRoles = [
    'Administrateur·rice de base de données (Oracle, Sybase, Sqlserver...)',
    'Administrateur·rice d\'application (progiciel ERP, CRM, SIRH ...)',
    'Administrateur·rice système Unix (linux...)',
    'Administrateur·rice réseaux',
    'Administrateur·rice sécurité',
    'Administrateur·rice de site Web (webmaster)',
    'Administrateur·rice système Windows',
    'Business analyst',
    'Analyste programmeur·euse',
    'Lead developer / Tech lead',
    'Architecte technique',
    'Développeur·euse .Net (C# ...)',
    'Développeur·euse fullstack'
  ];

  editorConfig = {
    skin_url: 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/skins/ui/oxide',
    content_css: 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/skins/content/default/content.min.css',
    readonly: false,
    height: 300,
    menubar: false,
    plugins: [
      'lists'
    ],
    toolbar: [
      'bold italic underline | bullist numlist | removeformat'
    ],
    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px; }',
    statusbar: false,
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

  isPreferred(job: string): boolean {
    return this.formData.jobPreferences.includes(job);
  }

  toggleJobPreference(job: string): void {
    const index = this.formData.jobPreferences.indexOf(job);
    if (index === -1 && this.formData.jobPreferences.length < 3) {
      this.formData.jobPreferences.push(job);
    } else if (index !== -1) {
      this.formData.jobPreferences.splice(index, 1);
    }
  }

  ngOnInit() {
    if (this.availability) {
      this.formData = {
        expertise: this.availability.expertise || [],
        role: this.availability.role,
        status: this.availability.status,
        jobPreferences: this.availability.jobPreferences || [],
        linkedinUrl: this.availability.linkedinUrl || '',
        dailyRate: this.availability.dailyRate || 0,
        yearsOfExperience: this.availability.yearsOfExperience || 0,
        languages: this.availability.languages || [],
        hidePhone: this.availability.hidePhone || true,
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

  fetchLinkedInProfile() {
    // This would integrate with LinkedIn OAuth in a real implementation
    console.log('Fetching LinkedIn profile...');
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