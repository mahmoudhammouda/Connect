import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Availability } from '../../models/availability.model';
import { AvailabilityFormComponent } from '../availability-form/availability-form.component';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { User } from '../../models/user.model';
import { inject } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-availability-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginModalComponent, AvailabilityFormComponent, ClickOutsideDirective],
  templateUrl: './availability-list.component.html',
  styleUrls: ['./availability-list.component.scss']
})
export class AvailabilityListComponent {
  // Pagination
  pageSize = 10;
  currentPage = 1;
  isLoading = false;
  hasMoreItems = true;

  // Tab state
  activeTab: 'available' | 'mine' = 'available';
  activeHeroTab: 'consultant' | 'recruiter' = 'consultant';

  // Search and filter state
  searchQuery = '';
  selectedMobility = '';
  selectedSeniority = '';
  selectedCountry = '';
  filteredAvailabilities: Availability[] = [];
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

  getCountryName(code: string): string {
    return this.uniqueCountries.find(c => c.code === code.toLowerCase())?.name || '';
  }

  // Modal state
  showLoginModal = false;
  showAvailabilityForm = false;
  selectedAvailability: Availability | null = null;
  expandedId: string | null = null;
  activeDropdownId: string | null = null;

  private userService = inject(UserService);

  get currentUser() {
    return this.userService.getCurrentUser()();
  }

  get isRecruiter() {
    return this.currentUser?.role === 'recruiter' || this.currentUser?.role === 'business_developer';
  }

  // LinkedIn related methods
  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  handleLoginEvent(userData: any): void {
    this.userService.setCurrentUser(userData);
    this.closeLoginModal();
  }

  handleRowClick(event: Event, availabilityId: string): void {
    // Get the clicked element
    const target = event.target as HTMLElement;
    const availability = this.availabilities.find((c: Availability) => c.id === availabilityId);
    
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
    // Always set consultant tab for freelancers
    this.activeHeroTab = 'consultant';
    
    // Always set activeTab to 'available' for non-authenticated users
    if (!this.currentUser) {
      this.activeTab = 'available';
    }

    // Hide recruiter tab for freelancers
    if (this.currentUser?.role === 'freelance') {
      this.activeHeroTab = 'consultant';
    }
    
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
    this.setupInfiniteScroll();
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
    if (!this.currentUser) {
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
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: false,
      status: 'immediate',
      preferences: [
        'Startup environment',
        'Flexible hours',
        'International teams'
      ],
      description: `Hello [Recruiter Name],
I'm reaching out to let you know that I'll be available in two weeks for a new project as a .NET Solutions Architect. With 17 years in designing and implementing enterprise solutions, I specialize in Cloud & Microservices (Azure), API design, and large-scale system modernization. I'd love to explore potential opportunities with you!
#SolutionsArchitect #.NET #Azure #Microservices #Cloud #AvailableSoon`,
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
        'Security focus',
        'Enterprise projects'
      ],
      description: `Hi [Recruiter Name],
I'm excited to share that I'll be free in about two weeks for a new assignment. My background includes 17 years of expertise in .NET, Cloud architectures, and Event-Driven solutions. I've led projects modernizing legacy systems and implementing scalable enterprise solutions. Let's connect and see how I can support your clients!
#Architect #NET #Cloud #EventDriven #Opportunity`,
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
      description: `Dear [Recruiter Name],
I'm ready to take on fresh challenges in approximately two weeks. I bring extensive experience in architecting .NET Core solutions, designing Microservices on Azure, and guiding teams under Agile methodologies. Looking forward to discussing how we can collaborate on your next big project!
#Architect #NETCore #Azure #Agile #Microservices`,
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
      description: `Hello [Recruiter Name],
I wanted to let you know that I have upcoming availability for a Solutions Architect role in the .NET ecosystem. My background spans 17 years of delivering robust enterprise architectures, focusing on Cloud-based microservices, API management, and Agile leadership. I'd love to chat about potential roles you have open.
#SolutionsArchitect #NET #Cloud #AvailableSoon`,
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
      description: `Hi [Recruiter Name],
I'm currently planning my next assignment, available in two weeks. I excel in .NET architecture, Cloud migrations (Azure), and implementing secure, scalable systems. If you're looking for someone to drive enterprise modernization and lead technical teams, let's discuss!
#CloudComputing #NETArchitect #Azure #Microservices`,
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
      description: `Dear [Recruiter Name],
I'll be free shortly and would love to bring my 17 years of .NET and Cloud experience to your clients. I specialize in event-driven architecture, microservices, and enterprise security. Let's connect and explore how I can contribute to your upcoming projects!
#EventDriven #Microservices #NETExpert #RemoteWork #AvailableIn2Weeks`,
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
      description: `Hello [Recruiter Name],
I'm writing to let you know that I'm wrapping up my current mission and will be available for new opportunities soon. My expertise includes .NET Core, Azure DevOps, and high-performance enterprise systems. Please feel free to reach out if you're looking for a senior architect to strengthen your team.
#SolutionsArchitect #DotNet #AzureDevOps #HiringNow`,
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
      description: `Hi [Recruiter Name],
I'm an experienced .NET Solutions Architect, ready for new challenges in about two weeks. My focus areas include Cloud & Microservices (Azure), API-driven solutions, and legacy modernization. I'd be glad to collaborate with your firm to design and deploy cutting-edge tech solutions.
#AvailableSoon #Architect #Microservices #Azure #Agile`,
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
      description: `Hello [Recruiter Name],
I'm reaching out to inform you of my upcoming availability. Over 17 years, I've built expertise in .NET frameworks, Cloud environments, and complex enterprise integrations. Let me know if you have roles that need a seasoned architect adept at creating scalable, secure systems.
#OpenForNewProjects #CloudArchitecture #.NET #Scalability`,
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
      description: `Dear [Recruiter Name],
I'll be free in two weeks to join a new venture as a .NET Solutions Architect. I specialize in microservices, Azure-based environments, and leading Agile teams toward successful product deliveries. If this aligns with your needs, let's discuss further!
#SolutionsArchitect #NETFramework #Azure #AgileTeams #TechLeadership`,
      contractType: 'cdi',
      isLocked: false,
      isSubcontractor: true,
      isActive: true
    },
    {
      id: '13',
      reference: 'AVAIL-013',
      role: 'Data Platform Architect',
      seniority: 'more_than_10',
      mobility: 'Remote',
      expertise: ['Data Architecture', 'Big Data', 'Apache Spark', 'Databricks', 'Data Lakes'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-04-15'),
        isFullRemote: true
      },
      status: 'immediate',
      preferences: ['Data Platform Design', 'Analytics Infrastructure'],
      description: 'Senior Data Platform Architect with expertise in designing and implementing large-scale data solutions.',
      contractType: 'freelance',
      isLocked: false,
      isSubcontractor: false,
      isActive: true
    },
    {
      id: '14',
      reference: 'AVAIL-014',
      role: 'ML Engineering Lead',
      seniority: 'more_than_10',
      mobility: 'Hybrid',
      expertise: ['Machine Learning', 'MLOps', 'TensorFlow', 'PyTorch', 'Kubernetes'],
      workLocation: 'hybrid',
      availability: {
        startDate: new Date('2024-05-01'),
        isFullRemote: false
      },
      status: 'soon',
      preferences: ['AI/ML Infrastructure', 'Team Leadership'],
      description: 'Machine Learning Engineering Lead specializing in MLOps and scalable AI systems.',
      contractType: 'freelance',
      isLocked: false,
      isSubcontractor: true,
      isActive: true
    },
    {
      id: '15',
      reference: 'AVAIL-015',
      role: 'Site Reliability Engineer',
      seniority: 'between_3_and_10',
      mobility: 'Remote',
      expertise: ['SRE', 'Observability', 'Prometheus', 'Grafana', 'SLOs'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-04-10'),
        isFullRemote: true
      },
      status: 'immediate',
      preferences: ['Platform Engineering', 'Reliability'],
      description: 'SRE focused on building reliable and scalable systems with strong observability practices.',
      contractType: 'cdi',
      isLocked: false,
      isSubcontractor: false,
      isActive: true
    },
    {
      id: '16',
      reference: 'AVAIL-016',
      role: 'API Platform Architect',
      seniority: 'more_than_10',
      mobility: 'Remote',
      expertise: ['API Design', 'GraphQL', 'REST', 'API Gateway', 'Microservices'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-05-15'),
        isFullRemote: true
      },
      status: 'soon',
      preferences: ['API Strategy', 'Platform Design'],
      description: 'API Platform Architect specializing in designing scalable and secure API architectures.',
      contractType: 'freelance',
      isLocked: true,
      isSubcontractor: false,
      isActive: true
    },
    {
      id: '17',
      reference: 'AVAIL-017',
      role: 'Performance Engineer',
      seniority: 'between_3_and_10',
      mobility: 'Hybrid',
      expertise: ['Performance Testing', 'Load Testing', 'JMeter', 'K6', 'Gatling'],
      workLocation: 'hybrid',
      availability: {
        startDate: new Date('2024-04-20'),
        isFullRemote: false
      },
      status: 'immediate',
      preferences: ['Performance Optimization', 'Scalability'],
      description: 'Performance Engineer focused on optimizing system performance and scalability.',
      contractType: 'cdi',
      isLocked: false,
      isSubcontractor: false,
      isActive: true
    },
    {
      id: '18',
      reference: 'AVAIL-018',
      role: 'Cloud Native Architect',
      seniority: 'more_than_10',
      mobility: 'Remote',
      expertise: ['Kubernetes', 'Service Mesh', 'GitOps', 'Cloud Native', 'Istio'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-05-01'),
        isFullRemote: true
      },
      status: 'soon',
      preferences: ['Cloud Native Architecture', 'Container Platforms'],
      description: 'Cloud Native Architect specializing in Kubernetes and service mesh architectures.',
      contractType: 'freelance',
      isLocked: false,
      isSubcontractor: true,
      isActive: true
    },
    {
      id: '19',
      reference: 'AVAIL-019',
      role: 'DevSecOps Engineer',
      seniority: 'between_3_and_10',
      mobility: 'Remote',
      expertise: ['Security Automation', 'CI/CD Security', 'Container Security', 'SAST/DAST'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-04-15'),
        isFullRemote: true
      },
      status: 'immediate',
      preferences: ['Security Automation', 'Pipeline Security'],
      description: 'DevSecOps Engineer focusing on embedding security in the development pipeline.',
      contractType: 'cdi',
      isLocked: false,
      isSubcontractor: false,
      isActive: true
    },
    {
      id: '20',
      reference: 'AVAIL-020',
      role: 'Blockchain Architect',
      seniority: 'more_than_10',
      mobility: 'Remote',
      expertise: ['Blockchain', 'Smart Contracts', 'Web3', 'DeFi', 'Ethereum'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-05-10'),
        isFullRemote: true
      },
      status: 'soon',
      preferences: ['DeFi Projects', 'Web3 Development'],
      description: 'Blockchain Architect specializing in DeFi and Web3 applications.',
      contractType: 'freelance',
      isLocked: true,
      isSubcontractor: false,
      isActive: true
    },
    {
      id: '21',
      reference: 'AVAIL-021',
      role: 'Edge Computing Architect',
      seniority: 'more_than_10',
      mobility: 'Hybrid',
      expertise: ['Edge Computing', 'IoT', '5G', 'Distributed Systems'],
      workLocation: 'hybrid',
      availability: {
        startDate: new Date('2024-04-25'),
        isFullRemote: false
      },
      status: 'immediate',
      preferences: ['Edge Solutions', 'IoT Platforms'],
      description: 'Edge Computing Architect focusing on distributed edge computing solutions.',
      contractType: 'freelance',
      isLocked: false,
      isSubcontractor: true,
      isActive: true
    },
    {
      id: '22',
      reference: 'AVAIL-022',
      role: 'Low-Code Platform Architect',
      seniority: 'more_than_10',
      mobility: 'Remote',
      expertise: ['Low-Code', 'Mendix', 'OutSystems', 'Power Platform'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-05-05'),
        isFullRemote: true
      },
      status: 'soon',
      preferences: ['Low-Code Development', 'Enterprise Platforms'],
      description: 'Low-Code Platform Architect specializing in enterprise low-code solutions.',
      contractType: 'cdi',
      isLocked: false,
      isSubcontractor: false,
      isActive: true
    },
    {
      id: '23',
      reference: 'AVAIL-023',
      role: 'Quantum Computing Engineer',
      seniority: 'more_than_10',
      mobility: 'Remote',
      expertise: ['Quantum Algorithms', 'Qiskit', 'Q#', 'Quantum ML'],
      workLocation: 'remote',
      availability: {
        startDate: new Date('2024-05-20'),
        isFullRemote: true
      },
      status: 'soon',
      preferences: ['Quantum Research', 'Algorithm Development'],
      description: 'Quantum Computing Engineer specializing in quantum algorithms and quantum machine learning.',
      contractType: 'freelance',
      isLocked: false,
      isSubcontractor: false,
      isActive: true
    },
    {
      id: '24',
      reference: 'AVAIL-024',
      role: 'AR/VR Developer',
      seniority: 'between_3_and_10',
      mobility: 'Hybrid',
      expertise: ['Unity', 'Unreal Engine', 'ARKit', 'VR Development'],
      workLocation: 'hybrid',
      availability: {
        startDate: new Date('2024-05-15'),
        isFullRemote: false
      },
      status: 'immediate',
      preferences: ['AR/VR Development', 'Game Engines'],
      description: 'AR/VR Developer with expertise in creating immersive experiences.',
      contractType: 'cdi',
      isLocked: false,
      isSubcontractor: false,
      isActive: true
    },
    {
      id: '25',
      reference: 'AVAIL-025',
      role: 'Robotics Engineer',
      seniority: 'more_than_10',
      mobility: 'Hybrid',
      expertise: ['ROS', 'Computer Vision', 'Motion Planning', 'Robotics Control'],
      workLocation: 'hybrid',
      availability: {
        startDate: new Date('2024-05-25'),
        isFullRemote: false
      },
      status: 'soon',
      preferences: ['Industrial Robotics', 'Automation'],
      description: 'Robotics Engineer specializing in industrial automation and control systems.',
      contractType: 'freelance',
      isLocked: false,
      isSubcontractor: true,
      isActive: true
    }
  ];
    }