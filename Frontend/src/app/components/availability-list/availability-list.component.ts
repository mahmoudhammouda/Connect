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
  
  // Tab state
  activeTab: 'available' | 'mine' | 'public' | 'requests' | 'subcontractors' = 'available';

  // Pagination
  pageSize = 10;
  currentPage = 1;
  isLoading = false;
  hasMoreItems = true;

  // Search and filter state
  searchQuery = '';
  selectedMobility = '';
  selectedSeniority = '';
  @Input() selectedCountry = '';
  filteredAvailabilities: Availability[] = [];

  // Modal state
  showLoginModal = false;
  showAvailabilityForm = false;
  showConnectionDialog = false;
  connectionMessage = '';
  selectedConsultant: Availability | null = null;
  selectedAvailability: Availability | null = null;
  expandedId: string | null = null;
  activeDropdownId: string | null = null;
  initialLoadComplete = false;

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

  // Sample Availabilities (25 total)
  availabilities: Availability[] = [
    {
      id: '1',
      reference: 'SE-001',
      role: 'Software Engineer',
      expertise: ['React', 'Node.js', 'TypeScript'],
      seniority: 'more_than_10',
      cities: [
        { name: 'Paris', country: 'France', countryCode: 'fr' },
        { name: 'Lyon', country: 'France', countryCode: 'fr' }
      ],
      mobility: 'on-site',
      workLocation: 'hybrid',
      dailyRate: 650,
      description: 'Experienced software engineer with focus on front-end technologies and modern JavaScript frameworks.',
      availability: {
        startDate: new Date('2023-09-01'),
        isFullRemote: false
      },
      preferences: ['Modern tech stack', 'Collaborative environment'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '2',
      reference: 'UX-001',
      role: 'UX/UI Designer',
      expertise: ['Figma', 'Adobe XD', 'User Research', 'Interaction Design'],
      seniority: 'more_than_10',
      cities: [
        { name: 'London', country: 'United Kingdom', countryCode: 'gb' },
        { name: 'Remote', country: 'United Kingdom', countryCode: 'gb' }
      ],
      mobility: 'remote',
      workLocation: 'hybrid',
      dailyRate: 550,
      description: 'Creative designer specializing in creating intuitive digital experiences across multiple platforms.',
      availability: {
        startDate: new Date('2023-08-15'),
        isFullRemote: true
      },
      preferences: ['Creative teams', 'User-centric companies'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '3',
      reference: 'DEVOPS-001',
      role: 'DevOps Engineer',
      expertise: ['AWS', 'Kubernetes', 'Docker', 'CI/CD', 'Terraform'],
      seniority: 'more_than_10',
      cities: [
        { name: 'Berlin', country: 'Germany', countryCode: 'de' },
        { name: 'Hamburg', country: 'Germany', countryCode: 'de' },
        { name: 'Remote', country: 'Germany', countryCode: 'de' }
      ],
      mobility: 'remote',
      workLocation: 'remote',
      dailyRate: 750,
      description: 'Specialized in cloud infrastructure and deployment automation. Expert in containerization and orchestration.',
      availability: {
        startDate: new Date('2023-07-01'),
        isFullRemote: true
      },
      preferences: ['Tech-driven companies', 'Cloud-first organizations'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '4',
      reference: 'DS-001',
      role: 'Data Scientist',
      expertise: ['Python', 'Machine Learning', 'TensorFlow', 'Data Visualization'],
      seniority: 'between_3_and_10',
      cities: [
        { name: 'Barcelona', country: 'Spain', countryCode: 'es' },
        { name: 'Madrid', country: 'Spain', countryCode: 'es' }
      ],
      mobility: 'on-site',
      workLocation: 'onsite',
      dailyRate: 600,
      description: 'Data science professional with experience in predictive modeling and AI solutions for various business domains.',
      availability: {
        startDate: new Date('2023-09-15'),
        isFullRemote: false
      },
      preferences: ['Data-driven companies', 'Research opportunities'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '5',
      reference: 'DEV-005',
      role: 'DevOps Engineer',
      expertise: ['Kubernetes', 'AWS', 'Jenkins', 'Docker'],
      seniority: 'between_3_and_10',
      cities: [
        { name: 'Berlin', country: 'Germany', countryCode: 'de' }
      ],
      mobility: 'hybrid',
      workLocation: 'hybrid',
      dailyRate: 620,
      description: 'DevOps specialist with experience in CI/CD pipeline optimization and cloud infrastructure management.',
      availability: {
        startDate: new Date('2023-08-15'),
        isFullRemote: false
      },
      preferences: ['Startups', 'Technology companies'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: true,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '6',
      reference: 'BE-001',
      role: 'Backend Developer',
      expertise: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL'],
      seniority: 'more_than_10',
      cities: [
        { name: 'Milan', country: 'Italy', countryCode: 'it' },
        { name: 'Remote', country: 'Italy', countryCode: 'it' }
      ],
      mobility: 'hybrid',
      workLocation: 'hybrid',
      dailyRate: 650,
      description: 'Specialized in designing and implementing scalable backend systems using Java and related technologies.',
      availability: {
        startDate: new Date('2023-09-01'),
        isFullRemote: false
      },
      preferences: ['Enterprise projects', 'Tech companies'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '7',
      reference: 'FE-001',
      role: 'Frontend Developer',
      expertise: ['Vue.js', 'JavaScript', 'CSS3', 'Responsive Design'],
      seniority: 'between_3_and_10',
      cities: [
        { name: 'Brussels', country: 'Belgium', countryCode: 'be' }
      ],
      mobility: 'on-site',
      workLocation: 'onsite',
      dailyRate: 550,
      description: 'Frontend specialist with a passion for creating beautiful and functional user interfaces.',
      availability: {
        startDate: new Date('2023-08-15'),
        isFullRemote: false
      },
      preferences: ['UI-focused teams', 'Modern frameworks'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '8',
      reference: 'MOB-001',
      role: 'Mobile Developer',
      expertise: ['React Native', 'iOS', 'Android', 'Swift', 'Kotlin'],
      seniority: 'more_than_10',
      cities: [
        { name: 'Zurich', country: 'Switzerland', countryCode: 'ch' },
        { name: 'Geneva', country: 'Switzerland', countryCode: 'ch' }
      ],
      mobility: 'hybrid',
      workLocation: 'hybrid',
      dailyRate: 700,
      description: 'Expert in cross-platform mobile development with experience in native and hybrid technologies.',
      availability: {
        startDate: new Date('2023-10-01'),
        isFullRemote: false
      },
      preferences: ['Mobile-first companies', 'Innovative products'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '9',
      reference: 'SEC-009',
      role: 'Security Architect',
      expertise: ['Cybersecurity', 'Penetration Testing', 'OWASP', 'Security Compliance'],
      seniority: 'more_than_10',
      cities: [
        { name: 'Lyon', country: 'France', countryCode: 'fr' }
      ],
      mobility: 'hybrid',
      workLocation: 'hybrid',
      dailyRate: 780,
      description: 'Cybersecurity expert with experience in designing secure architectures and conducting security assessments for enterprise applications.',
      availability: {
        startDate: new Date('2023-09-15'),
        isFullRemote: false
      },
      preferences: ['Banking', 'Insurance', 'Critical infrastructure'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: true,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '10',
      reference: 'FS-001',
      role: 'Full Stack Developer',
      expertise: ['Angular', '.NET Core', 'SQL Server', 'Azure'],
      seniority: 'more_than_10',
      cities: [
        { name: 'London', country: 'United Kingdom', countryCode: 'gb' },
        { name: 'Manchester', country: 'United Kingdom', countryCode: 'gb' }
      ],
      mobility: 'hybrid',
      workLocation: 'hybrid',
      dailyRate: 675,
      description: 'Full stack developer with expertise in Microsoft technologies and modern JavaScript frameworks.',
      availability: {
        startDate: new Date('2023-08-01'),
        isFullRemote: false
      },
      preferences: ['Enterprise clients', 'Long-term contracts'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '11',
      reference: 'BA-001',
      role: 'Business Analyst',
      expertise: ['Requirements Gathering', 'Process Mapping', 'Stakeholder Management'],
      seniority: 'more_than_10',
      cities: [
        { name: 'Berlin', country: 'Germany', countryCode: 'de' },
        { name: 'Remote', country: 'Germany', countryCode: 'de' }
      ],
      mobility: 'remote',
      workLocation: 'remote',
      dailyRate: 620,
      description: 'Experienced analyst bridging the gap between business needs and technical implementation.',
      availability: {
        startDate: new Date('2023-09-15'),
        isFullRemote: true
      },
      preferences: ['Financial sector', 'Digital transformation'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '12',
      reference: 'SEC-001',
      role: 'Security Specialist',
      expertise: ['Penetration Testing', 'OWASP', 'Security Audits', 'Compliance'],
      seniority: 'more_than_10',
      cities: [
        { name: 'Madrid', country: 'Spain', countryCode: 'es' }
      ],
      mobility: 'hybrid',
      workLocation: 'hybrid',
      dailyRate: 780,
      description: 'Cybersecurity expert with focus on web application security and compliance regulations.',
      availability: {
        startDate: new Date('2023-10-01'),
        isFullRemote: false
      },
      preferences: ['Security-focused companies', 'Regulated industries'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '13',
      reference: 'PROD-001',
      role: 'Product Manager',
      expertise: ['Product Strategy', 'Roadmapping', 'User Stories', 'Go-to-Market'],
      seniority: 'more_than_10',
      cities: [
        { name: 'Amsterdam', country: 'Netherlands', countryCode: 'nl' },
        { name: 'Utrecht', country: 'Netherlands', countryCode: 'nl' }
      ],
      mobility: 'hybrid',
      workLocation: 'hybrid',
      dailyRate: 710,
      description: 'Strategic product manager with experience bringing digital products from concept to market.',
      availability: {
        startDate: new Date('2023-09-15'),
        isFullRemote: false
      },
      preferences: ['Product companies', 'Growth-stage startups'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '14',
      reference: 'CLOUD-001',
      role: 'Cloud Architect',
      expertise: ['AWS', 'Azure', 'Google Cloud', 'Serverless'],
      seniority: 'more_than_10',
      cities: [
        { name: 'Rome', country: 'Italy', countryCode: 'it' },
        { name: 'Remote', country: 'Italy', countryCode: 'it' }
      ],
      mobility: 'remote',
      workLocation: 'remote',
      dailyRate: 790,
      description: 'Cloud infrastructure expert specializing in designing scalable and resilient architectures.',
      availability: {
        startDate: new Date('2023-08-01'),
        isFullRemote: true
      },
      preferences: ['Cloud-native companies', 'Digital transformation'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '15',
      reference: 'BA-015',
      role: 'Business Analyst',
      expertise: ['Requirements Gathering', 'Process Mapping', 'Stakeholder Management', 'Agile'],
      seniority: 'between_3_and_10',
      cities: [
        { name: 'Zurich', country: 'Switzerland', countryCode: 'ch' }
      ],
      mobility: 'on-site',
      workLocation: 'onsite',
      dailyRate: 550,
      description: 'Business analyst specialized in bridging the gap between business needs and technical solutions. Strong analytical skills with experience in enterprise projects.',
      availability: {
        startDate: new Date('2023-09-01'),
        isFullRemote: false
      },
      preferences: ['Financial services', 'Insurance', 'Corporate environment'],
      status: 'immediate',
      contractType: 'cdd',
      isActive: true,
      isLocked: true,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '16',
      reference: 'AI-001',
      role: 'AI/ML Engineer',
      expertise: ['Python', 'Deep Learning', 'Natural Language Processing', 'Computer Vision'],
      seniority: 'more_than_10',
      cities: [
        { name: 'Zurich', country: 'Switzerland', countryCode: 'ch' }
      ],
      mobility: 'hybrid',
      workLocation: 'hybrid',
      dailyRate: 800,
      description: 'Artificial intelligence expert with focus on practical business applications of machine learning.',
      availability: {
        startDate: new Date('2023-09-01'),
        isFullRemote: false
      },
      preferences: ['AI-focused companies', 'Research opportunities'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '17',
      reference: 'EMB-001',
      role: 'Embedded Systems Engineer',
      expertise: ['C/C++', 'Arduino', 'IoT', 'Hardware Interfaces'],
      seniority: 'more_than_10',
      cities: [
        { name: 'Lyon', country: 'France', countryCode: 'fr' },
        { name: 'Grenoble', country: 'France', countryCode: 'fr' }
      ],
      mobility: 'on-site',
      workLocation: 'onsite',
      dailyRate: 680,
      description: 'Specialized in firmware development and embedded software for connected devices.',
      availability: {
        startDate: new Date('2023-10-15'),
        isFullRemote: false
      },
      preferences: ['IoT companies', 'Hardware manufacturers'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '18',
      reference: 'LEAD-001',
      role: 'Technical Lead',
      expertise: ['Team Leadership', 'Architecture', 'Mentoring', 'Technical Planning'],
      seniority: 'more_than_10',
      cities: [
        { name: 'Manchester', country: 'United Kingdom', countryCode: 'gb' },
        { name: 'Remote', country: 'United Kingdom', countryCode: 'gb' }
      ],
      mobility: 'hybrid',
      workLocation: 'hybrid',
      dailyRate: 750,
      description: 'Experienced tech lead with a track record of successfully guiding development teams.',
      availability: {
        startDate: new Date('2023-09-01'),
        isFullRemote: false
      },
      preferences: ['Scale-ups', 'Technology companies'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '19',
      reference: 'DBA-001',
      role: 'Database Administrator',
      expertise: ['Oracle', 'PostgreSQL', 'MySQL', 'Performance Tuning'],
      seniority: 'more_than_10',
      cities: [
        { name: 'Munich', country: 'Germany', countryCode: 'de' },
        { name: 'Remote', country: 'Germany', countryCode: 'de' }
      ],
      mobility: 'remote',
      workLocation: 'remote',
      dailyRate: 650,
      description: 'Expert in database management, optimization, and data migration strategies.',
      availability: {
        startDate: new Date('2023-10-01'),
        isFullRemote: true
      },
      preferences: ['Enterprise companies', 'Financial institutions'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '20',
      reference: 'SYS-001',
      role: 'Systems Architect',
      expertise: ['Enterprise Architecture', 'System Integration', 'Scalability'],
      seniority: 'more_than_10',
      cities: [
        { name: 'Barcelona', country: 'Spain', countryCode: 'es' },
        { name: 'Valencia', country: 'Spain', countryCode: 'es' }
      ],
      mobility: 'hybrid',
      workLocation: 'hybrid',
      dailyRate: 730,
      description: 'Experienced architect specializing in large-scale distributed systems.',
      availability: {
        startDate: new Date('2023-11-01'),
        isFullRemote: false
      },
      preferences: ['Enterprise organizations', 'Digital transformation'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '21',
      reference: 'GAME-001',
      role: 'Game Developer',
      expertise: ['Unity3D', 'C#', 'Game Design', '3D Graphics'],
      seniority: 'between_3_and_10',
      cities: [
        { name: 'Milan', country: 'Italy', countryCode: 'it' }
      ],
      mobility: 'on-site',
      workLocation: 'onsite',
      dailyRate: 620,
      description: 'Game development specialist focusing on immersive experiences and multiplayer games.',
      availability: {
        startDate: new Date('2023-09-01'),
        isFullRemote: false
      },
      preferences: ['Game studios', 'Entertainment companies'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '22',
      reference: 'PERF-001',
      role: 'Performance Engineer',
      expertise: ['Load Testing', 'Optimization', 'JMeter', 'System Monitoring'],
      seniority: 'more_than_10',
      cities: [
        { name: 'Amsterdam', country: 'Netherlands', countryCode: 'nl' },
        { name: 'Remote', country: 'Netherlands', countryCode: 'nl' }
      ],
      mobility: 'remote',
      workLocation: 'remote',
      dailyRate: 670,
      description: 'Specialized in identifying and resolving performance bottlenecks in complex systems.',
      availability: {
        startDate: new Date('2023-10-15'),
        isFullRemote: true
      },
      preferences: ['High-traffic platforms', 'E-commerce'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '23',
      reference: 'AR-001',
      role: 'AR/VR Developer',
      expertise: ['ARKit', 'Unity', 'WebXR', '3D Modeling'],
      seniority: 'between_3_and_10',
      cities: [
        { name: 'Brussels', country: 'Belgium', countryCode: 'be' },
        { name: 'Antwerp', country: 'Belgium', countryCode: 'be' }
      ],
      mobility: 'hybrid',
      workLocation: 'hybrid',
      dailyRate: 630,
      description: 'Specialized in augmented and virtual reality applications for various industries.',
      availability: {
        startDate: new Date('2023-09-15'),
        isFullRemote: false
      },
      preferences: ['Immersive tech companies', 'Metaverse projects'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '24',
      reference: 'NET-001',
      role: 'Network Engineer',
      expertise: ['Cisco', 'Network Security', 'VPN', 'MPLS'],
      seniority: 'more_than_10',
      cities: [
        { name: 'Geneva', country: 'Switzerland', countryCode: 'ch' }
      ],
      mobility: 'on-site',
      workLocation: 'onsite',
      dailyRate: 700,
      description: 'Network infrastructure specialist with expertise in securing enterprise networks.',
      availability: {
        startDate: new Date('2023-10-01'),
        isFullRemote: false
      },
      preferences: ['Multinational corporations', 'Financial institutions'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    },
    {
      id: '25',
      reference: 'ERP-001',
      role: 'ERP Consultant',
      expertise: ['SAP', 'Oracle EBS', 'Business Process', 'Integration'],
      seniority: 'more_than_10',
      cities: [
        { name: 'Paris', country: 'France', countryCode: 'fr' },
        { name: 'Remote', country: 'France', countryCode: 'fr' }
      ],
      mobility: 'hybrid',
      workLocation: 'hybrid',
      dailyRate: 720,
      description: 'Enterprise software consultant specializing in ERP implementation and customization.',
      availability: {
        startDate: new Date('2023-09-01'),
        isFullRemote: false
      },
      preferences: ['Manufacturing', 'Supply chain', 'Corporate environments'],
      status: 'immediate',
      contractType: 'freelance',
      isActive: true,
      isLocked: false,
      isSubcontractor: false,
      phoneValidated: true,
      emailValidated: true,
      linkedinValidated: true
    }
  ];

  get isRecruiter() {
    return this.currentUser?.role === 'recruiter' || this.currentUser?.role === 'business_developer';
  }

  constructor() {
    this.setupInfiniteScroll();
  }

  ngOnInit() {
    this.filteredAvailabilities = this.availabilities.slice(0, this.pageSize);
    
    // If user is a consultant and viewing their own availabilities tab, set the tab
    if (this.currentUser?.role === 'consultant') {
      this.activeTab = 'mine';
    }
    
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
    this.initialLoadComplete = true;
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

  initiateConnect(event: Event, availabilityId: string): void {
    // Prevent row click propagation
    event.stopPropagation();
    
    const availability = this.availabilities.find(a => a.id === availabilityId);
    
    // If user is not logged in, show login modal
    if (!this.currentUser) {
      // Save the availability ID that the user wants to connect with
      localStorage.setItem('pendingConnectionId', availabilityId);
      
      // Show the login modal to authenticate
      this.showLoginModal = true;
      return;
    }
    
    // For recruiters with locked profiles, show connection request dialog
    if (this.isRecruiter && availability && availability.isLocked) {
      this.selectedConsultant = availability;
      this.connectionMessage = '';
      this.showConnectionDialog = true;
      return;
    }
    
    // For all other cases (e.g., unlocked profiles), proceed with direct connection
    this.connectWithConsultant(availabilityId);
  }
  
  connectWithConsultant(availabilityId: string): void {
    // Here you would implement the direct connection logic
    console.log(`User ${this.currentUser?.id} is connecting with availability ${availabilityId}`);
    
    // Show success message
    // this.toastr.success('Connected successfully with consultant!');
  }
  
  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  handleLoginEvent(user: User): void {
    this.closeLoginModal();
    
    // Get the pending connection ID
    const pendingConnectionId = localStorage.getItem('pendingConnectionId');
    
    if (pendingConnectionId) {
      // Here you would implement the actual connection logic
      console.log(`User ${user.id} is connecting with availability ${pendingConnectionId}`);
      
      // Clear the pending connection
      localStorage.removeItem('pendingConnectionId');
    }
  }
  
  sendConnectionRequest(): void {
    if (!this.connectionMessage.trim() || !this.selectedConsultant || !this.currentUser) {
      return;
    }
    
    // Here you would make an API call to send the connection request
    // For example:
    // this.connectionService.sendRequest({
    //   consultantId: this.selectedConsultant.id,
    //   message: this.connectionMessage,
    //   requesterId: this.currentUser.id
    // }).subscribe(...)
    
    // For now, just log it
    console.log('Connection request sent:', {
      consultant: this.selectedConsultant,
      message: this.connectionMessage,
      requester: this.currentUser
    });
    
    // Show success message
    // this.toastr.success('Connection request sent successfully. You will be notified when the consultant responds.');
    
    // Close dialog
    this.showConnectionDialog = false;
    this.selectedConsultant = null;
    this.connectionMessage = '';
  }

  handleLinkedInConnect(event: Event, availability: Availability): void {
    event.stopPropagation();
    if (!this.currentUser) {
      this.showLoginModal = true;
      return;
    }
    window.open('https://www.linkedin.com/in/profile', '_blank');
  }

  toggleDetails(id: string): void {
    this.expandedId = this.expandedId === id ? null : id;
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
      preferences: [],
      description: formData.description,
      contractType: formData.contractType,
      status: 'immediate', 
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

  setActiveTab(tab: 'available' | 'mine') {
    this.activeTab = tab;
    this.filterAvailabilities();
  }
}