import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Availability } from '../../models/availability.model';
import { AvailabilityFormComponent } from '../availability-form/availability-form.component';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-availability-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginModalComponent, AvailabilityFormComponent, ClickOutsideDirective],
  template: `
    <div class="p-4">
      <div class="flex justify-between items-center mb-4">
        <div class="flex gap-4 border-b">
          <button 
            (click)="activeTab = 'available'"
            [class]="activeTab === 'available' ? 
              'text-blue-600 border-b-2 border-blue-600 py-2 px-1 -mb-px font-medium' : 
              'text-gray-500 py-2 px-1 font-medium hover:text-gray-700'"
          >
            Available Experts
          </button>
          <button 
            (click)="activeTab = 'mine'"
            [class]="activeTab === 'mine' ? 
              'text-blue-600 border-b-2 border-blue-600 py-2 px-1 -mb-px font-medium' : 
              'text-gray-500 py-2 px-1 font-medium hover:text-gray-700'"
          >
            My Availabilities
          </button>
        </div>
      </div>
      
      <!-- Add Availability Button -->
      <div class="mb-4">
        <button 
          (click)="openAvailabilityForm()"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
        >
          <span class="material-icons text-sm">add</span>
          Share Your Availability
        </button>
      </div>
      
      <!-- Search and Filter Bar -->
      <div class="sticky top-0 bg-white z-10 mb-4 p-4 border-b" *ngIf="activeTab === 'available'">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="col-span-1 md:col-span-2">
            <input 
              type="text" 
              [(ngModel)]="searchQuery"
              (ngModelChange)="filterAvailabilities()"
              placeholder="Search by role, expertise..."
              class="w-full p-2 border rounded-lg"
            >
          </div>
          <div>
            <select 
              [(ngModel)]="selectedMobility"
              (ngModelChange)="filterAvailabilities()"
              class="w-full p-2 border rounded-lg"
            >
              <option value="">All Locations</option>
              @for (mobility of uniqueMobilities; track mobility) {
                <option [value]="mobility">{{mobility}}</option>
              }
            </select>
          </div>
          <div>
            <select 
              [(ngModel)]="selectedSeniority"
              (ngModelChange)="filterAvailabilities()"
              class="w-full p-2 border rounded-lg"
            >
              <option value="">All Experience Levels</option>
              <option value="less_than_3">< 3 years</option>
              <option value="between_3_and_10">3-10 years</option>
              <option value="more_than_10">10+ years</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Horizontal Scrolling Container -->
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50" *ngIf="activeTab === 'available'">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobility</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Top Skills</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            @for (availability of activeTab === 'available' ? filteredAvailabilities : myAvailabilities; track availability.id) {
              <tr 
                (click)="handleRowClick($event, availability.id)"
                class="hover:bg-gray-50 cursor-pointer transition-all duration-150 shadow-sm mb-2 bg-white"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{availability.reference}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div class="relative group">
                      <div [class]="getStatusDotClass(availability.status)" title="{{getStatusText(availability.status)}}"></div>
                    </div>
                    @if (availability.isSubcontractor) {
                      <div class="relative group">
                        <span class="material-icons text-orange-500 text-lg">business</span>
                      </div>
                    }
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium text-gray-900">{{availability.role}}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex gap-0.5">
                    @if (availability.seniority === 'less_than_3') {
                      <div class="w-1.5 h-4 bg-blue-500 rounded"></div>
                      <div class="w-1.5 h-4 bg-gray-200 rounded"></div>
                      <div class="w-1.5 h-4 bg-gray-200 rounded"></div>
                    } @else if (availability.seniority === 'between_3_and_10') {
                      <div class="w-1.5 h-4 bg-blue-500 rounded"></div>
                      <div class="w-1.5 h-4 bg-blue-500 rounded"></div>
                      <div class="w-1.5 h-4 bg-gray-200 rounded"></div>
                    } @else {
                      <div class="w-1.5 h-4 bg-blue-500 rounded"></div>
                      <div class="w-1.5 h-4 bg-blue-500 rounded"></div>
                      <div class="w-1.5 h-4 bg-blue-500 rounded"></div>
                    }
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getContractClass(availability.contractType)">
                    {{getContractText(availability.contractType)}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{availability.mobility}}
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    @for (skill of availability.expertise.slice(0, 3); track skill) {
                      <span class="bg-blue-100 px-2 py-0.5 rounded-full text-xs">
                        {{skill}}
                      </span>
                    }
                    @if (availability.expertise.length > 3) {
                      <span class="text-gray-500 text-xs">+{{availability.expertise.length - 3}}</span>
                    }
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-center">
                    <span class="material-icons text-gray-600">
                      {{availability.isLocked ? 'lock' : 'lock_open'}}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2 justify-end">
                    @if (activeTab === 'mine') {
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          class="sr-only peer"
                          [checked]="availability.isActive"
                          (change)="toggleAvailability($event, availability)"
                          (click)="$event.stopPropagation()"
                        >
                        <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                      <div class="relative" clickOutside (clickOutside)="activeDropdownId = null">
                        <button
                          (click)="toggleDropdown($event, availability.id)"
                          class="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 relative"
                          title="More actions"
                        >
                          <span class="material-icons text-gray-600">more_vert</span>
                        </button>
                        
                        <!-- Dropdown Menu -->
                        @if (activeDropdownId === availability.id) {
                          <div 
                            class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                          >
                            <div class="py-1" role="menu">
                              <button
                                (click)="openAvailabilityForm(availability); $event.stopPropagation()"
                                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                role="menuitem"
                              >
                                <span class="material-icons text-gray-600 text-base">edit</span>
                                Edit
                              </button>
                              <button
                                (click)="deleteAvailability(availability); $event.stopPropagation()"
                                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                role="menuitem"
                              >
                                <span class="material-icons text-red-600 text-base">delete</span>
                                Delete
                              </button>
                            </div>
                          </div>
                        }
                      </div>
                    }
                    
                    @if (activeTab === 'available') {
                      <button 
                        class="p-1.5 rounded-full hover:bg-blue-50 transition-colors duration-200 relative group"
                        title="Connect on LinkedIn"
                        (click)="handleLinkedInConnect($event, availability)"
                      >
                        <span class="material-icons text-blue-600">
                          {{availability.isLocked ? 'person_add' : 'launch'}}
                        </span>
                        <div class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                          {{availability.isLocked ? 'Request Connection' : 'View LinkedIn Profile'}}
                        </div>
                      </button>
                    }
                  </div>
                </td>
              </tr>
              @if (expandedId === availability.id) {
                <tr>
                  <td colspan="9" class="px-6 py-4 bg-gray-50 shadow-inner">
                    <div class="text-sm text-gray-700 space-y-4">
                      <div class="flex items-start gap-2">
                        <span class="material-icons text-blue-600">post</span>
                        <div>
                          <div class="font-medium text-blue-600 mb-1">LinkedIn Post</div>
                          <p>{{availability.description}}</p>
                          <div class="mt-2 text-xs text-gray-500 flex items-center gap-1">
                            <span class="material-icons text-sm">schedule</span>
                            Posted 2 days ago on LinkedIn
                          </div>
                        </div>
                      </div>

                      <div class="mt-2">
                        <span class="font-semibold">Preferences:</span>
                        <ul class="list-disc list-inside mt-1">
                          @for (pref of availability.preferences; track pref) {
                            <li class="text-gray-600">{{pref}}</li>
                          }
                        </ul>
                      </div>
                      @if (availability.additionalMobilityInfo) {
                        <div class="mt-2">
                          <span class="font-semibold">Additional Mobility Information:</span>
                          <p class="text-gray-600 mt-1">{{availability.additionalMobilityInfo}}</p>
                        </div>
                      }
                      @if (availability.expertise.length > 3) {
                        <div class="mt-2">
                          <span class="font-semibold">All Skills:</span>
                          <div class="flex flex-wrap gap-1 mt-1">
                            @for (skill of availability.expertise; track skill) {
                              <span class="bg-blue-100 px-2 py-0.5 rounded-full text-xs">
                                {{skill}}
                              </span>
                            }
                          </div>
                        </div>
                      }
                      
                      @if (!availability.isLocked) {
                        <div class="mt-4 flex gap-2">
                          <button 
                            class="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-1"
                            (click)="openAvailabilityForm(availability); $event.stopPropagation()"
                          >
                            <span class="material-icons text-sm">edit</span>
                            Update Availability
                          </button>
                          <button 
                            class="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200 flex items-center gap-1"
                            (click)="shareOnLinkedIn($event, availability)"
                          >
                            <span class="material-icons text-sm">share</span>
                            Share on LinkedIn
                          </button>
                        </div>
                      }
                    </div>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-4 flex items-center justify-between" *ngIf="activeTab === 'available'">
        <div class="flex items-center gap-2">
          <select class="border rounded p-1">
            <option>10 per page</option>
            <option>25 per page</option>
            <option>50 per page</option>
          </select>
        </div>
        <div class="flex gap-2">
          <button class="px-3 py-1 border rounded">Previous</button>
          <button class="px-3 py-1 border rounded bg-blue-500 text-white">1</button>
          <button class="px-3 py-1 border rounded">2</button>
          <button class="px-3 py-1 border rounded">3</button>
          <button class="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>

    <!-- LinkedIn Login Modal -->
    <app-modal
      [isOpen]="showLoginModal"
      (closeModal)="closeLoginModal()"
      (login)="handleLinkedInLogin()"
    ></app-modal>

    <!-- Availability Form Modal -->
    <app-availability-form
      [isOpen]="showAvailabilityForm"
      [availability]="selectedAvailability"
      (closeModal)="closeAvailabilityForm()"
      (save)="handleAvailabilitySubmit($event)"
    ></app-availability-form>
  `
})
export class AvailabilityListComponent {
  // Tab state
  activeTab: 'available' | 'mine' = 'available';

  // Search and filter state
  searchQuery = '';
  selectedMobility = '';
  selectedSeniority = '';
  filteredAvailabilities: Availability[] = [];
  uniqueMobilities: string[] = [];

  // Modal state
  showLoginModal = false;
  showAvailabilityForm = false;
  selectedAvailability: Availability | null = null;
  isLinkedInLoggedIn = false;
  expandedId: string | null = null;
  activeDropdownId: string | null = null;

  // LinkedIn related methods
  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  handleLinkedInLogin(): void {
    this.isLinkedInLoggedIn = true;
    this.showLoginModal = false;
  }

  handleRowClick(event: Event, availabilityId: string): void {
    // Get the clicked element
    const target = event.target as HTMLElement;
    const availability = this.myAvailabilities.find(c => c.id === availabilityId);
    
    // Check if the click was on or inside an interactive element
    const isInteractiveElement = target.closest('button, input, select, label, .material-icons, .clickable-element');
    
    // Only toggle if:
    // 1. We clicked directly on the row or a non-interactive cell
    // 2. In My Availabilities tab, the availability must not be locked
    if (!isInteractiveElement && 
        (this.activeTab === 'available' || 
         (this.activeTab === 'mine' && availability && !availability.isLocked))) {
      this.toggleDetails(availabilityId);
    }
  }

  constructor() {
    this.filteredAvailabilities = this.availabilities;
    this.uniqueMobilities = Array.from(new Set(this.availabilities.map(c => c.mobility))).sort();
    this.filterAvailabilities();
  }

  filterAvailabilities(): void {
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

      const matchesMobility = !this.selectedMobility || 
        availability.mobility === this.selectedMobility;

      const matchesSeniority = !this.selectedSeniority || 
        availability.seniority === this.selectedSeniority;

      return matchesSearch && matchesMobility && matchesSeniority;
    });
  }

  toggleDetails(id: string): void {
    this.expandedId = this.expandedId === id ? null : id;
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
    // Create new availability if no availability selected
    if (!this.selectedAvailability) {
      this.createNewAvailability(formData);
    } else if (this.selectedAvailability) {
      const index = this.myAvailabilities.findIndex(c => c.id === this.selectedAvailability!.id);
      if (index !== -1) {
        this.myAvailabilities[index] = {
          ...this.myAvailabilities[index],
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

  toggleAvailability(event: Event, availability: Availability): void {
    event.stopPropagation();
    const target = event.target as HTMLInputElement;
    // Update active status
    availability.isActive = target.checked;
    // Lock/unlock the availability based on active status
    availability.isLocked = !target.checked;
    
    // If we're deactivating, collapse any expanded details
    if (!target.checked && this.expandedId === availability.id) {
      this.expandedId = null;
    }
    
    this.filterAvailabilities();
  }

  handleLinkedInConnect(event: Event, availability: Availability): void {
    event.stopPropagation();
    if (!this.isLinkedInLoggedIn) {
      this.showLoginModal = true;
      return;
    }
    window.open('https://www.linkedin.com/in/profile', '_blank');
  }

  getStatusDotClass(status: string): string {
    const baseClasses = 'w-3 h-3 rounded-full';
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

  shareOnLinkedIn(event: Event, availability: Availability): void {
    event.stopPropagation();
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
  }

  private createNewAvailability(formData: any): void {
    const newAvailability: Availability = {
      id: (this.myAvailabilities.length + 1).toString(),
      reference: `AVAIL-${(this.myAvailabilities.length + 1).toString().padStart(3, '0')}`,
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
    this.myAvailabilities.unshift(newAvailability);
  }

  toggleDropdown(event: Event, availabilityId: string): void {
    event.stopPropagation();
    this.activeDropdownId = this.activeDropdownId === availabilityId ? null : availabilityId;
  }

  deleteAvailability(availability: Availability): void {
    const index = this.myAvailabilities.findIndex(c => c.id === availability.id);
    if (index !== -1) {
      this.myAvailabilities.splice(index, 1);
    }
    this.activeDropdownId = null;
  }

  // Data arrays
  availabilities: Availability[] = [
    {
      id: '1',
      reference: 'AVAIL-001',
      role: 'Full Stack Developer',
      seniority: 'between_3_and_10',
      mobility: 'Remote',
      expertise: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-03-15'),
        isFullRemote: true
      },
      status: 'immediate',
      preferences: [
        'Startup environment',
        'Flexible hours',
        'International teams'
      ],
      description: 'Full stack developer with 5 years of experience',
      contractType: 'freelance',
      isLocked: false,
      isSubcontractor: false,
      isActive: true,
      additionalMobilityInfo: 'Available for occasional on-site meetings in Paris'
    },
    {
      id: '2',
      reference: 'AVAIL-002',
      role: 'DevOps Engineer',
      seniority: 'more_than_10',
      mobility: 'Hybrid',
      expertise: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Jenkins'],
      workLocation: 'hybrid',
      availability: {
        startDate: new Date('2024-04-01'),
        isFullRemote: false
      },
      status: 'soon',
      preferences: [
        'Cloud infrastructure',
        'CI/CD implementation',
        'Security focus'
      ],
      description: 'Senior DevOps engineer with extensive cloud experience',
      contractType: 'freelance',
      isLocked: true,
      isSubcontractor: true,
      isActive: true
    },
    {
      id: '4',
      reference: 'AVAIL-004',
      role: 'Data Engineer',
      seniority: 'more_than_10',
      mobility: 'Remote',
      expertise: ['Python', 'Spark', 'Hadoop', 'AWS', 'Data Warehousing'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-03-25'),
        isFullRemote: true
      },
      status: 'immediate',
      preferences: ['Big data projects', 'Data pipeline optimization'],
      description: 'Senior data engineer with expertise in big data technologies',
      contractType: 'freelance',
      isLocked: false,
      isSubcontractor: false,
      isActive: true
    },
    {
      id: '5',
      reference: 'AVAIL-005',
      role: 'Cloud Architect',
      seniority: 'more_than_10',
      mobility: 'Hybrid',
      expertise: ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes'],
      workLocation: 'hybrid',
      availability: {
        startDate: new Date('2024-04-15'),
        isFullRemote: false
      },
      status: 'soon',
      preferences: ['Cloud migration', 'Multi-cloud strategies'],
      description: 'Cloud architect with multi-cloud expertise',
      contractType: 'cdi',
      isLocked: true,
      isSubcontractor: true,
      isActive: true
    },
    {
      id: '6',
      reference: 'AVAIL-006',
      role: 'Mobile Developer',
      seniority: 'between_3_and_10',
      mobility: 'On-site',
      expertise: ['React Native', 'iOS', 'Android', 'Flutter'],
      workLocation: 'onsite',
      availability: {
        startDate: new Date('2024-03-30'),
        isFullRemote: false
      },
      status: 'immediate',
      preferences: ['Mobile development', 'Cross-platform apps'],
      description: 'Mobile developer specializing in cross-platform development',
      contractType: 'freelance',
      isLocked: false,
      isSubcontractor: false,
      isActive: true
    },
    {
      id: '7',
      reference: 'AVAIL-007',
      role: 'Security Engineer',
      seniority: 'more_than_10',
      mobility: 'Remote',
      expertise: ['Penetration Testing', 'Security Auditing', 'OWASP'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-04-10'),
        isFullRemote: true
      },
      status: 'soon',
      preferences: ['Security architecture', 'Compliance frameworks'],
      description: 'Security engineer with focus on application security',
      contractType: 'cdi',
      isLocked: true,
      isSubcontractor: false,
      isActive: true
    },
    {
      id: '3',
      reference: 'AVAIL-003',
      role: 'Frontend Developer',
      seniority: 'less_than_3',
      mobility: 'On-site',
      expertise: ['React', 'Vue.js', 'TailwindCSS', 'TypeScript'],
      workLocation: 'onsite',
      availability: {
        startDate: new Date('2024-03-20'),
        isFullRemote: false
      },
      status: 'immediate',
      preferences: [
        'Modern frontend',
        'UI/UX focus',
        'Agile teams'
      ],
      description: 'Frontend developer specializing in modern JavaScript frameworks',
      contractType: 'cdi',
      isLocked: false,
      isSubcontractor: false,
      isActive: true
    },
    {
      id: '8',
      reference: 'AVAIL-008',
      role: 'AI/ML Engineer',
      seniority: 'more_than_10',
      mobility: 'Remote',
      expertise: ['TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'MLOps'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-04-05'),
        isFullRemote: true
      },
      status: 'soon',
      preferences: ['AI research', 'Machine learning projects'],
      description: 'Senior AI/ML engineer specializing in deep learning',
      contractType: 'freelance',
      isLocked: false,
      isSubcontractor: false,
      isActive: true
    },
    {
      id: '9',
      reference: 'AVAIL-009',
      role: 'Blockchain Developer',
      seniority: 'between_3_and_10',
      mobility: 'Remote',
      expertise: ['Solidity', 'Web3.js', 'Smart Contracts', 'DeFi'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-03-28'),
        isFullRemote: true
      },
      status: 'immediate',
      preferences: ['DeFi projects', 'Blockchain platforms'],
      description: 'Blockchain developer with DeFi expertise',
      contractType: 'freelance',
      isLocked: true,
      isSubcontractor: false,
      isActive: true
    },
    {
      id: '10',
      reference: 'AVAIL-010',
      role: 'SRE Engineer',
      seniority: 'more_than_10',
      mobility: 'Hybrid',
      expertise: ['Kubernetes', 'Prometheus', 'Grafana', 'SLO/SLI'],
      workLocation: 'hybrid',
      availability: {
        startDate: new Date('2024-04-12'),
        isFullRemote: false
      },
      status: 'soon',
      preferences: ['SRE practices', 'Observability'],
      description: 'Site Reliability Engineer with focus on observability',
      contractType: 'cdi',
      isLocked: false,
      isSubcontractor: true,
      isActive: true
    }
  ];

  myAvailabilities: Availability[] = [
    {
      id: '4',
      reference: 'AVAIL-004',
      role: 'Technical Lead',
      seniority: 'more_than_10',
      mobility: 'Remote',
      expertise: ['Architecture', 'Team Leadership', 'Node.js', 'React', 'AWS'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-03-15'),
        isFullRemote: true
      },
      status: 'immediate',
      preferences: ['Remote-first teams', 'Technical mentorship'],
      description: 'Technical lead with experience in building and leading remote development teams',
      contractType: 'freelance',
      isLocked: false,
      isSubcontractor: false,
      isActive: true
    },
    {
      id: '5',
      reference: 'AVAIL-005',
      role: 'Solution Architect',
      seniority: 'more_than_10',
      mobility: 'Hybrid',
      expertise: ['System Design', 'Cloud Architecture', 'Enterprise Integration'],
      workLocation: 'hybrid',
      availability: {
        startDate: new Date('2024-04-01'),
        isFullRemote: false
      },
      status: 'soon',
      preferences: ['Enterprise projects', 'Architecture modernization'],
      description: 'Solution architect specializing in enterprise architecture and system integration',
      contractType: 'cdi',
      isLocked: false,
      isSubcontractor: true,
      isActive: true
    },
    {
      id: '6',
      reference: 'AVAIL-006',
      role: 'Backend Lead',
      seniority: 'more_than_10',
      mobility: 'Remote',
      expertise: ['Java', 'Spring Boot', 'Microservices', 'Kafka'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-03-25'),
        isFullRemote: true
      },
      status: 'immediate',
      preferences: ['Microservices architecture', 'High-performance systems'],
      description: 'Backend lead specializing in Java ecosystem',
      contractType: 'freelance',
      isLocked: false,
      isSubcontractor: false,
      isActive: true
    },
    {
      id: '7',
      reference: 'AVAIL-007',
      role: 'UI/UX Designer',
      seniority: 'between_3_and_10',
      mobility: 'Hybrid',
      expertise: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
      workLocation: 'hybrid',
      availability: {
        startDate: new Date('2024-04-01'),
        isFullRemote: false
      },
      status: 'soon',
      preferences: ['User-centered design', 'Design systems'],
      description: 'UI/UX designer with focus on user experience',
      contractType: 'cdi',
      isLocked: false,
      isSubcontractor: true,
      isActive: true
    },
    {
      id: '8',
      reference: 'AVAIL-008',
      role: 'DevOps Lead',
      seniority: 'more_than_10',
      mobility: 'Remote',
      expertise: ['Kubernetes', 'AWS', 'CI/CD', 'GitOps'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-03-20'),
        isFullRemote: true
      },
      status: 'immediate',
      preferences: ['Infrastructure automation', 'Cloud-native'],
      description: 'DevOps lead with extensive cloud experience',
      contractType: 'freelance',
      isLocked: false,
      isSubcontractor: false,
      isActive: true
    },
    {
      id: '9',
      reference: 'AVAIL-009',
      role: 'Data Scientist',
      seniority: 'between_3_and_10',
      mobility: 'Remote',
      expertise: ['Python', 'R', 'Machine Learning', 'Statistics'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-04-05'),
        isFullRemote: true
      },
      status: 'soon',
      preferences: ['Data analysis', 'Statistical modeling'],
      description: 'Data scientist specializing in predictive analytics',
      contractType: 'freelance',
      isLocked: false,
      isSubcontractor: false,
      isActive: true
    },
    {
      id: '10',
      reference: 'AVAIL-010',
      role: 'Performance Engineer',
      seniority: 'more_than_10',
      mobility: 'Hybrid',
      expertise: ['JMeter', 'LoadRunner', 'Performance Testing'],
      workLocation: 'hybrid',
      availability: {
        startDate: new Date('2024-03-28'),
        isFullRemote: false
      },
      status: 'immediate',
      preferences: ['Performance optimization', 'Load testing'],
      description: 'Performance engineer focused on scalability',
      contractType: 'cdi',
      isLocked: false,
      isSubcontractor: true,
      isActive: true
    }
  ];
}