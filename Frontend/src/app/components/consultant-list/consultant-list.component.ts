import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Consultant } from '../../models/consultant.model';
import { ModalComponent } from '../modal/modal.component';
import { AvailabilityFormComponent } from '../availability-form/availability-form.component';

@Component({
  selector: 'app-consultant-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, AvailabilityFormComponent],
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
            Available Consultants
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
              (ngModelChange)="filterConsultants()"
              placeholder="Search by role, expertise..."
              class="w-full p-2 border rounded-lg"
            >
          </div>
          <div>
            <select 
              [(ngModel)]="selectedMobility"
              (ngModelChange)="filterConsultants()"
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
              (ngModelChange)="filterConsultants()"
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
            @for (consultant of activeTab === 'available' ? filteredConsultants : myAvailabilities; track consultant.id) {
              <tr 
                (click)="toggleDetails(consultant.id)"
                class="hover:bg-gray-50 cursor-pointer transition-all duration-150 shadow-sm mb-2 bg-white"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{consultant.reference}}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div class="relative group">
                      <div [class]="getStatusDotClass(consultant.status)" title="{{getStatusText(consultant.status)}}"></div>
                    </div>
                    @if (consultant.isSubcontractor) {
                      <div class="relative group">
                        <span class="material-icons text-orange-500 text-lg">business</span>
                      </div>
                    }
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium text-gray-900">{{consultant.role}}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex gap-0.5">
                    @if (consultant.seniority === 'less_than_3') {
                      <div class="w-1.5 h-4 bg-blue-500 rounded"></div>
                      <div class="w-1.5 h-4 bg-gray-200 rounded"></div>
                      <div class="w-1.5 h-4 bg-gray-200 rounded"></div>
                    } @else if (consultant.seniority === 'between_3_and_10') {
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
                  <span [class]="getContractClass(consultant.contractType)">
                    {{getContractText(consultant.contractType)}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{consultant.mobility}}
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    @for (skill of consultant.expertise.slice(0, 3); track skill) {
                      <span class="bg-blue-100 px-2 py-0.5 rounded-full text-xs">
                        {{skill}}
                      </span>
                    }
                    @if (consultant.expertise.length > 3) {
                      <span class="text-gray-500 text-xs">+{{consultant.expertise.length - 3}}</span>
                    }
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-center">
                    <span class="material-icons text-gray-600">
                      {{consultant.isLocked ? 'lock' : 'lock_open'}}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2 justify-end">
                    @if (activeTab === 'mine') {
                      <div class="flex items-center gap-4">
                        <button 
                          (click)="openAvailabilityForm(consultant); $event.stopPropagation()"
                          class="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
                          title="Edit"
                        >
                          <span class="material-icons text-gray-600">edit</span>
                        </button>
                        <button 
                          (click)="deleteAvailability(consultant); $event.stopPropagation()"
                          class="p-1.5 rounded-full hover:bg-red-100 transition-colors duration-200"
                          title="Delete"
                        >
                          <span class="material-icons text-red-600">delete</span>
                        </button>
                      </div>
                    }
                    
                    @if (activeTab === 'available') {
                      <button 
                        class="p-1.5 rounded-full hover:bg-blue-50 transition-colors duration-200 relative group"
                        title="Connect on LinkedIn"
                        (click)="handleLinkedInConnect($event, consultant)"
                      >
                        <span class="material-icons text-blue-600">
                          {{consultant.isLocked ? 'person_add' : 'launch'}}
                        </span>
                        <div class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                          {{consultant.isLocked ? 'Request Connection' : 'View LinkedIn Profile'}}
                        </div>
                      </button>
                    }
                  </div>
                </td>
              </tr>
              @if (expandedId === consultant.id) {
                <tr>
                  <td colspan="9" class="px-6 py-4 bg-gray-50 shadow-inner">
                    <div class="text-sm text-gray-700 space-y-4">
                      <div class="flex items-start gap-2">
                        <span class="material-icons text-blue-600">post</span>
                        <div>
                          <div class="font-medium text-blue-600 mb-1">LinkedIn Post</div>
                          <p>{{consultant.description}}</p>
                          <div class="mt-2 text-xs text-gray-500 flex items-center gap-1">
                            <span class="material-icons text-sm">schedule</span>
                            Posted 2 days ago on LinkedIn
                          </div>
                        </div>
                      </div>

                      <div class="mt-2">
                        <span class="font-semibold">Preferences:</span>
                        <ul class="list-disc list-inside mt-1">
                          @for (pref of consultant.preferences; track pref) {
                            <li class="text-gray-600">{{pref}}</li>
                          }
                        </ul>
                      </div>
                      @if (consultant.additionalMobilityInfo) {
                        <div class="mt-2">
                          <span class="font-semibold">Additional Mobility Information:</span>
                          <p class="text-gray-600 mt-1">{{consultant.additionalMobilityInfo}}</p>
                        </div>
                      }
                      @if (consultant.expertise.length > 3) {
                        <div class="mt-2">
                          <span class="font-semibold">All Skills:</span>
                          <div class="flex flex-wrap gap-1 mt-1">
                            @for (skill of consultant.expertise; track skill) {
                              <span class="bg-blue-100 px-2 py-0.5 rounded-full text-xs">
                                {{skill}}
                              </span>
                            }
                          </div>
                        </div>
                      }
                      
                      @if (!consultant.isLocked) {
                        <div class="mt-4 flex gap-2">
                          <button 
                            class="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-1"
                            (click)="openAvailabilityForm(consultant); $event.stopPropagation()"
                          >
                            <span class="material-icons text-sm">edit</span>
                            Update Availability
                          </button>
                          <button 
                            class="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200 flex items-center gap-1"
                            (click)="shareOnLinkedIn($event, consultant)"
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
      [consultant]="selectedConsultant"
      (closeModal)="closeAvailabilityForm()"
      (save)="handleAvailabilitySubmit($event)"
    ></app-availability-form>
  `
})
export class ConsultantListComponent {
  consultants: Consultant[] = [
    {
      id: '1',
      reference: 'CONS-001',
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
        'International teams',
        'Product-driven companies',
        'Agile methodologies'
      ],
      description: 'Full stack developer with 5 years of experience specializing in React and Node.js. Led development of multiple successful SaaS products. Strong focus on clean code and scalable architecture. Experienced in microservices and cloud-native development. Looking for a challenging role in an innovative startup.',
      contractType: 'freelance',
      isLocked: false,
      isSubcontractor: false,
      additionalMobilityInfo: 'Available for occasional on-site meetings in Paris'
    },
    {
      id: '2',
      reference: 'CONS-002',
      role: 'DevOps Engineer',
      seniority: 'more_than_10',
      mobility: 'Hybrid',
      expertise: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Jenkins', 'GitOps'],
      workLocation: 'hybrid',
      availability: {
        startDate: new Date('2024-04-01'),
        isFullRemote: false
      },
      status: 'soon',
      preferences: [
        'Large-scale infrastructure',
        'Cloud-native projects',
        'CI/CD implementation',
        'Infrastructure automation',
        'Security-first approach'
      ],
      description: 'Senior DevOps engineer with 12+ years of experience in cloud infrastructure and automation. Implemented CI/CD pipelines for Fortune 500 companies. Reduced deployment time by 80% through automation. Expert in Kubernetes orchestration and cloud-native architectures. Seeking opportunities to build robust, scalable infrastructure.',
      contractType: 'cdi',
      isLocked: true,
      isSubcontractor: true
    },
    {
      id: '3',
      reference: 'CONS-003',
      role: 'Frontend Developer',
      seniority: 'less_than_3',
      mobility: 'On-site',
      expertise: ['Angular', 'TypeScript', 'Tailwind CSS', 'RxJS'],
      workLocation: 'onsite',
      availability: {
        startDate: new Date('2024-03-20'),
        isFullRemote: false
      },
      status: 'immediate',
      preferences: [
        'Modern frontend frameworks',
        'UI/UX focused',
        'Mentorship opportunities',
        'Design system implementation',
        'Performance optimization'
      ],
      description: 'Frontend developer with 2 years of experience in Angular and modern web technologies. Passionate about creating beautiful, responsive interfaces. Contributed to open-source projects and design systems. Strong foundation in web accessibility and performance optimization. Looking for a role to grow and learn from experienced developers.',
      contractType: 'cdd',
      isLocked: false,
      isSubcontractor: false
    },
    {
      id: '4',
      reference: 'CONS-004',
      role: 'Backend Developer',
      seniority: 'between_3_and_10',
      mobility: 'Remote',
      expertise: ['Java', 'Spring Boot', 'PostgreSQL', 'Microservices'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-05-01'),
        isFullRemote: true
      },
      status: 'soon',
      preferences: [
        'Backend architecture',
        'High-performance systems',
        'Domain-driven design',
        'Event-driven architecture',
        'Microservices patterns'
      ],
      description: 'Backend developer with 6 years of expertise in Java and Spring ecosystem. Designed and implemented scalable microservices handling millions of daily transactions. Experienced in event-driven architecture and domain-driven design. Strong advocate for clean code and test-driven development. Seeking a role focused on building robust, scalable backend systems.',
      contractType: 'freelance',
      isLocked: false,
      isSubcontractor: true
    },
    {
      id: '5',
      reference: 'CONS-005',
      role: 'Data Engineer',
      seniority: 'more_than_10',
      mobility: 'Hybrid',
      expertise: ['Python', 'Spark', 'Hadoop', 'AWS', 'Data Warehousing'],
      workLocation: 'hybrid',
      availability: {
        startDate: new Date('2024-03-25'),
        isFullRemote: false
      },
      status: 'immediate',
      preferences: [
        'Big data projects',
        'Data pipeline optimization',
        'Real-time processing',
        'Data governance',
        'Machine learning integration'
      ],
      description: 'Senior data engineer with 15 years of experience in building enterprise-scale data solutions. Expert in designing and optimizing data pipelines processing petabytes of data. Implemented real-time processing solutions for financial institutions. Strong background in data governance and security. Looking for challenging big data projects.',
      contractType: 'cdi',
      isLocked: true,
      isSubcontractor: false
    },
    {
      id: '6',
      reference: 'CONS-006',
      role: 'Cloud Architect',
      seniority: 'more_than_10',
      mobility: 'Remote',
      expertise: ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-04-15'),
        isFullRemote: true
      },
      status: 'soon',
      preferences: [
        'Cloud migration',
        'Multi-cloud strategies',
        'Cost optimization',
        'Cloud security',
        'Enterprise architecture'
      ],
      description: 'Cloud architect with 12+ years of experience across AWS, Azure, and GCP. Led successful cloud migrations for enterprise clients with $10M+ infrastructure budgets. Expert in designing resilient, cost-effective multi-cloud solutions. Strong focus on security and compliance. Seeking opportunities to architect complex cloud solutions.',
      contractType: 'freelance',
      isLocked: false,
      isSubcontractor: true
    },
    {
      id: '7',
      reference: 'CONS-007',
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
      preferences: [
        'Cross-platform development',
        'Native performance',
        'Mobile UX',
        'App store optimization',
        'Offline-first design'
      ],
      description: 'Mobile developer with 5 years of experience in both native and cross-platform development. Created successful apps with millions of downloads. Expert in optimizing mobile performance and creating smooth user experiences. Strong understanding of app store guidelines and submission processes. Looking for challenging mobile projects.',
      contractType: 'cdi',
      isLocked: true,
      isSubcontractor: false
    },
    {
      id: '8',
      reference: 'CONS-008',
      role: 'Security Engineer',
      seniority: 'more_than_10',
      mobility: 'Hybrid',
      expertise: ['Penetration Testing', 'Security Auditing', 'OWASP', 'Compliance'],
      workLocation: 'hybrid',
      availability: {
        startDate: new Date('2024-04-10'),
        isFullRemote: false
      },
      status: 'soon',
      preferences: [
        'Security architecture',
        'Compliance frameworks',
        'DevSecOps implementation',
        'Security training',
        'Threat modeling'
      ],
      description: 'Security engineer with 15+ years in application and infrastructure security. CISSP certified. Led security programs for Fortune 100 companies. Expert in implementing DevSecOps practices and conducting security training. Strong background in compliance (ISO 27001, SOC 2, GDPR). Looking for roles to enhance organization-wide security posture.',
      contractType: 'freelance',
      isLocked: false,
      isSubcontractor: true
    },
    {
      id: '9',
      reference: 'CONS-009',
      role: 'UI/UX Designer',
      seniority: 'between_3_and_10',
      mobility: 'Remote',
      expertise: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-03-18'),
        isFullRemote: true
      },
      status: 'immediate',
      preferences: [
        'User-centered design',
        'Design systems',
        'Accessibility',
        'Design thinking',
        'User research'
      ],
      description: 'UI/UX designer with 7 years of experience creating intuitive digital experiences. Led design system implementation for major e-commerce platforms. Conducted extensive user research and usability testing. Strong focus on accessibility and inclusive design. Looking for opportunities to create impactful user experiences.',
      contractType: 'cdd',
      isLocked: true,
      isSubcontractor: false
    },
    {
      id: '10',
      reference: 'CONS-010',
      role: 'Product Manager',
      seniority: 'more_than_10',
      mobility: 'Hybrid',
      expertise: ['Agile', 'Product Strategy', 'User Stories', 'Roadmapping'],
      workLocation: 'hybrid',
      availability: {
        startDate: new Date('2024-05-01'),
        isFullRemote: false
      },
      status: 'soon',
      preferences: [
        'Agile environment',
        'Product innovation',
        'Data-driven decisions',
        'Customer discovery',
        'Growth strategy'
      ],
      description: 'Product manager with 12+ years of experience launching successful B2B and B2C products. Led products generating $50M+ annual revenue. Strong background in agile methodologies and data-driven decision making. Experience in both startup and enterprise environments. Seeking opportunity to drive product strategy and innovation.',
      contractType: 'cdi',
      isLocked: false,
      isSubcontractor: false
    }
  ];

  myAvailabilities: Consultant[] = [
    {
      id: '11',
      reference: 'CONS-011',
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
      description: 'Technical lead with experience in building and leading remote development teams.',
      contractType: 'freelance',
      isLocked: false,
      isSubcontractor: false
    },
    {
      id: '12',
      reference: 'CONS-012',
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
      description: 'Solution architect specializing in enterprise architecture and system integration.',
      contractType: 'cdi',
      isLocked: false,
      isSubcontractor: true
    },
    {
      id: '13',
      reference: 'CONS-013',
      role: 'Frontend Lead',
      seniority: 'between_3_and_10',
      mobility: 'Remote',
      expertise: ['Vue.js', 'React', 'Design Systems', 'Performance Optimization'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-03-20'),
        isFullRemote: true
      },
      status: 'immediate',
      preferences: ['Frontend architecture', 'Performance-focused'],
      description: 'Frontend lead developer with expertise in modern JavaScript frameworks.',
      contractType: 'freelance',
      isLocked: false,
      isSubcontractor: false
    },
    {
      id: '14',
      reference: 'CONS-014',
      role: 'DevOps Lead',
      seniority: 'more_than_10',
      mobility: 'Hybrid',
      expertise: ['Kubernetes', 'AWS', 'CI/CD', 'Infrastructure as Code'],
      workLocation: 'hybrid',
      availability: {
        startDate: new Date('2024-04-15'),
        isFullRemote: false
      },
      status: 'soon',
      preferences: ['Cloud-native', 'Infrastructure automation'],
      description: 'DevOps lead with extensive experience in cloud infrastructure and automation.',
      contractType: 'cdi',
      isLocked: false,
      isSubcontractor: true
    },
    {
      id: '15',
      reference: 'CONS-015',
      role: 'Backend Lead',
      seniority: 'more_than_10',
      mobility: 'Remote',
      expertise: ['Python', 'Django', 'FastAPI', 'Microservices'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-03-25'),
        isFullRemote: true
      },
      status: 'immediate',
      preferences: ['API design', 'Scalable systems'],
      description: 'Backend lead specializing in Python ecosystem and microservices architecture.',
      contractType: 'freelance',
      isLocked: false,
      isSubcontractor: false
    },
    {
      id: '16',
      reference: 'CONS-016',
      role: 'Full Stack Lead',
      seniority: 'more_than_10',
      mobility: 'Hybrid',
      expertise: ['Angular', 'Node.js', 'MongoDB', 'Docker'],
      workLocation: 'hybrid',
      availability: {
        startDate: new Date('2024-04-10'),
        isFullRemote: false
      },
      status: 'soon',
      preferences: ['Full stack architecture', 'Team leadership'],
      description: 'Full stack lead with strong experience in both frontend and backend development.',
      contractType: 'cdi',
      isLocked: false,
      isSubcontractor: true
    }
  ];
  showAvailabilityForm = false;
  selectedConsultant: Consultant | null = null;
  isLinkedInLoggedIn = false;

  // Search and filter state
  searchQuery = '';
  selectedMobility = '';
  selectedSeniority = '';
  filteredConsultants: Consultant[] = [];
  activeTab: 'available' | 'mine' = 'available';
  uniqueMobilities: string[] = [];
  activeDropdownId: string | null = null;

  // Other state
  expandedId: string | null = null;
  showLoginModal = false;

  filterConsultants(): void {
    this.filteredConsultants = this.consultants.filter(consultant => {
      const matchesSearch = !this.searchQuery || 
        consultant.role.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        consultant.expertise.some((skill: string) => 
          skill.toLowerCase().includes(this.searchQuery.toLowerCase())
        );

      const matchesMobility = !this.selectedMobility || 
        consultant.mobility === this.selectedMobility;

      const matchesSeniority = !this.selectedSeniority || 
        consultant.seniority === this.selectedSeniority;

      return matchesSearch && matchesMobility && matchesSeniority;
    });
  }

  openAvailabilityForm(consultant: Consultant | null = null) {
    this.selectedConsultant = consultant;
    this.showAvailabilityForm = true;
  }

  constructor() {
    this.filteredConsultants = this.consultants;
    this.myAvailabilities = this.consultants.filter(c => !c.isLocked).slice(0, 5);
    this.uniqueMobilities = Array.from(new Set(this.consultants.map(c => c.mobility))).sort();
  }

  toggleAvailability(event: Event, consultant: Consultant): void {
    const target = event.target as HTMLInputElement;
    const newStatus = target.checked ? 'immediate' : 'inactive';
    const index = this.myAvailabilities.findIndex((c: Consultant) => c.id === consultant.id);
    if (index !== -1) {
      this.myAvailabilities[index] = {
        ...this.myAvailabilities[index],
        status: newStatus
      };
    }
  }

  toggleLock(event: Event, consultant: Consultant): void {
    const target = event.target as HTMLInputElement;
    const index = this.myAvailabilities.findIndex((c: Consultant) => c.id === consultant.id);
    if (index !== -1) {
      this.myAvailabilities[index] = {
        ...this.myAvailabilities[index],
        isLocked: !target.checked
      };
    }
  }

  toggleDropdown(event: Event, consultantId: string): void {
    event.stopPropagation();
    this.activeDropdownId = this.activeDropdownId === consultantId ? null : consultantId;
  }

  deleteAvailability(consultant: Consultant): void {
    if (confirm('Are you sure you want to delete this availability?')) {
      const index = this.myAvailabilities.findIndex((c: Consultant) => c.id === consultant.id);
      if (index !== -1) {
        this.myAvailabilities.splice(index, 1);
      }
    }
    this.activeDropdownId = null;
  }

  toggleDetails(id: string): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  handleLinkedInConnect(event: Event, consultant: Consultant): void {
    event.stopPropagation();
    
    if (this.activeTab === 'available') {
      if (!this.isLinkedInLoggedIn) {
        this.showLoginModal = true;
        return;
      }
  
      if (consultant.isLocked) {
        console.log('Sending connection request to:', consultant.reference);
      } else {
        window.open('https://www.linkedin.com/in/profile', '_blank');
      }
    }
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  handleLinkedInLogin(): void {
    console.log('Initiating LinkedIn login...');
    this.isLinkedInLoggedIn = true;
    this.showLoginModal = false;
  }

  editDescription(event: Event, consultant: Consultant): void {
    event.stopPropagation();
    console.log('Edit description for:', consultant.reference);
  }

  shareOnLinkedIn(event: Event, consultant: Consultant): void {
    event.stopPropagation();
    console.log('Share on LinkedIn:', consultant.reference);
    this.activeDropdownId = null;
  }

  closeAvailabilityForm() {
    this.showAvailabilityForm = false;
    this.selectedConsultant = null;
  }

  handleAvailabilitySubmit(formData: any) {
    if (this.selectedConsultant) {
      const index = this.myAvailabilities.findIndex((c: Consultant) => c.id === this.selectedConsultant!.id);
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
          additionalMobilityInfo: formData.additionalMobilityInfo
        };
      }
    } else {
      const newConsultant: Consultant = {
        id: (this.myAvailabilities.length + 1).toString(),
        reference: `CONS-${(this.myAvailabilities.length + 1).toString().padStart(3, '0')}`,
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
        isLocked: false,
        isSubcontractor: false,
        additionalMobilityInfo: formData.additionalMobilityInfo
      };
      this.myAvailabilities.unshift(newConsultant);
      this.activeTab = 'mine';
    }

    this.filterConsultants();
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
}