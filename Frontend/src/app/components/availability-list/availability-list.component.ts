import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Availability } from '../../models/availability.model';
import { AvailabilityFormComponent } from '../availability-form/availability-form.component';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-availability-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginModalComponent, AvailabilityFormComponent, ClickOutsideDirective],
  templateUrl: './availability-list.component.html',
  styleUrls: ['./availability-list.component.scss']
})
export class AvailabilityListComponent {
  @Input() currentUser: User | null = null;
  @Input() availabilities: Availability[] = [];
  @Input() activeTab: 'available' | 'mine' | 'public' | 'requests' | 'subcontractors' = 'available';

  // Pagination
  pageSize = 10;
  currentPage = 1;
  isLoading = false;
  hasMoreItems = true;

  // Search and filter state
  searchQuery = '';
  selectedMobility = '';
  selectedSeniority = '';
  selectedCountry = '';
  filteredAvailabilities: Availability[] = [];

  // Modal state
  showLoginModal = false;
  showAvailabilityForm = false;
  selectedAvailability: Availability | null = null;
  expandedId: string | null = null;
  activeDropdownId: string | null = null;

  // Update country codes to match flag CDN requirements
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

  get isRecruiter() {
    return this.currentUser?.role === 'recruiter' || this.currentUser?.role === 'business_developer';
  }

  constructor() {
    this.setupInfiniteScroll();
  }

  ngOnInit() {
    this.filteredAvailabilities = this.availabilities.slice(0, this.pageSize);
    // Extract unique countries from cities
    const countries = new Set<string>();
    this.availabilities.forEach(availability => {
      availability.cities?.forEach(city => {
        countries.add(JSON.stringify({ code: city.countryCode, name: city.country }));
      });
    });
    this.uniqueCountries = Array.from(countries).map(c => JSON.parse(c))
      .sort((a, b) => a.name.localeCompare(b.name));
    this.filterAvailabilities();
  }

  private setupInfiniteScroll(): void {
    window.addEventListener('scroll', () => {
      if (this.isLoading || !this.hasMoreItems) return;

      const threshold = 50; // pixels from bottom
      const position = window.scrollY + window.innerHeight;
      const height = document.documentElement.scrollHeight;

      if (position > height - threshold) {
        this.loadMoreItems();
      }
    });
  }

  private loadMoreItems(): void {
    this.isLoading = true;
    
    // Simulate API call delay
    setTimeout(() => {
      const start = this.currentPage * this.pageSize;
      const end = start + this.pageSize;
      const newItems = this.availabilities.slice(start, end);
      
      if (newItems.length > 0) {
        this.filteredAvailabilities = [...this.filteredAvailabilities, ...newItems];
        this.currentPage++;
      } else {
        this.hasMoreItems = false;
      }
      
      this.isLoading = false;
    }, 500);
  }

  filterAvailabilities(): void {
    this.currentPage = 1;
    this.hasMoreItems = true;
    
    this.filteredAvailabilities = this.availabilities.filter(availability => {
      // First check if the availability is active
      if (!availability.isActive) {
        return false;
      }

      const matchesSearch = !this.searchQuery || 
        availability.role.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        availability.expertise.some(skill => 
          skill.toLowerCase().includes(this.searchQuery.toLowerCase())
        );

      const matchesCountry = !this.selectedCountry || 
        availability.cities?.some(city => city.countryCode === this.selectedCountry);

      const matchesSeniority = !this.selectedSeniority || 
        availability.seniority === this.selectedSeniority;

      return matchesSearch && matchesCountry && matchesSeniority;
    }).slice(0, this.pageSize);
  }

  getCountryName(code: string): string {
    return this.uniqueCountries.find(c => c.code === code.toLowerCase())?.name || '';
  }

  handleRowClick(event: Event, availabilityId: string): void {
    const target = event.target as HTMLElement;
    const availability = this.availabilities.find((c: Availability) => c.id === availabilityId);
    
    const isInteractiveElement = target.closest('button, input, select, label, .material-icons, .clickable-element');
    
    if (!isInteractiveElement && 
        (this.activeTab === 'available' || 
         (this.activeTab === 'mine' && availability && !availability.isLocked))) {
      this.toggleDetails(availabilityId);
    }
  }

  toggleDetails(id: string): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  handleLinkedInConnect(event: Event, availability: Availability): void {
    event.stopPropagation();
    if (!this.currentUser) {
      this.showLoginModal = true;
      return;
    }
    window.open('https://www.linkedin.com/in/profile', '_blank');
  }

  toggleAvailability(event: Event, availability: Availability): void {
    event.stopPropagation();
    const target = event.target as HTMLInputElement;
    availability.isActive = target.checked;
    availability.isLocked = !target.checked;
    
    if (!target.checked && this.expandedId === availability.id) {
      this.expandedId = null;
    }
    
    this.filterAvailabilities();
  }

  toggleDropdown(event: Event, availabilityId: string): void {
    event.stopPropagation();
    this.activeDropdownId = this.activeDropdownId === availabilityId ? null : availabilityId;
  }

  deleteAvailability(availability: Availability): void {
    const index = this.availabilities.findIndex(c => c.id === availability.id);
    if (index !== -1) {
      this.availabilities.splice(index, 1);
    }
    this.activeDropdownId = null;
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
    } else if (this.selectedAvailability) {
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
    this.filterAvailabilities();
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
      isActive: true
    };
    this.availabilities.unshift(newAvailability);
  }

  getStatusDotClass(status: string): string {
    const baseClasses = 'w-3 h-3 rounded-full';
    switch (status) {
      case 'immediate':
        return `${baseClasses} bg-yellow-400`;
      case 'soon':
        return `${baseClasses} bg-yellow-300`;
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

  getContractClass(contractType: string): string {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (contractType) {
      case 'cdi':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'freelance':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'cdd':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      default:
        return baseClasses;
    }
  }

  getContractText(contractType: string): string {
    switch (contractType) {
      case 'cdi':
        return 'CDI';
      case 'freelance':
        return 'Freelance';
      case 'cdd':
        return 'CDD';
      default:
        return contractType;
    }
  }
}