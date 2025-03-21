import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OpenPosition } from '../../models/open-position.model';
import { User } from '../../models/user.model';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-position-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginModalComponent],
  templateUrl: './position-list.component.html'
})
export class PositionListComponent {
  @Input() currentUser: User | null = null;
  
  // Pagination
  pageSize = 10;
  currentPage = 1;
  searchQuery = '';
  @Input() selectedCountry = '';
  selectedSeniority = '';
  expandedId: string | null = null;
  isLoading = false;
  hasMoreItems = true;
  filteredPositions: OpenPosition[] = [];
  
  // UI state
  showLoginModal = false;
  initialLoadComplete = false;

  positions: OpenPosition[] = [
    {
      id: '1',
      reference: 'MISS-001',
      title: 'Senior React Developer',
      description: 'Looking for a senior React developer with strong TypeScript experience to join our fintech project. The ideal candidate should have experience with large-scale applications and microservices architecture.',
      requiredExpertise: ['React', 'TypeScript', 'Redux', 'Node.js', 'AWS'],
      seniority: 'more_than_10',
      workLocation: 'hybrid',
      cities: [
        { name: 'Paris', country: 'France', countryCode: 'FR' }
      ],
      startDate: new Date('2024-04-01'),
      contractType: 'freelance',
      postedBy: {
        id: '1',
        firstName: 'Sophie',
        lastName: 'Martin',
        photoUrl: 'https://ui-avatars.com/api/?name=Sophie+Martin',
        company: 'TechRecruit Pro'
      },
      postedDate: new Date('2024-03-01'),
      isActive: true
    },
    {
      id: '2',
      reference: 'MISS-002',
      title: 'DevOps Engineer',
      description: 'Seeking an experienced DevOps engineer to help us scale our cloud infrastructure and implement best practices for CI/CD.',
      requiredExpertise: ['Kubernetes', 'AWS', 'Terraform', 'Docker', 'Jenkins'],
      seniority: 'between_3_and_10',
      workLocation: 'remote',
      cities: [
        { name: 'Lyon', country: 'France', countryCode: 'FR' }
      ],
      startDate: new Date('2024-04-15'),
      contractType: 'cdi',
      postedBy: {
        id: '2',
        firstName: 'John',
        lastName: 'Smith',
        photoUrl: 'https://ui-avatars.com/api/?name=John+Smith',
        company: 'Cloud Solutions Ltd'
      },
      postedDate: new Date('2024-03-05'),
      isActive: true
    },
    {
      id: '3',
      reference: 'MISS-003',
      title: 'Full Stack Java Developer',
      description: 'Looking for a Full Stack Java developer with Spring Boot and Angular experience for a long-term project.',
      requiredExpertise: ['Java', 'Spring Boot', 'Angular', 'PostgreSQL', 'REST APIs'],
      seniority: 'more_than_10',
      workLocation: 'hybrid',
      cities: [
        { name: 'Bordeaux', country: 'France', countryCode: 'FR' }
      ],
      startDate: new Date('2024-04-10'),
      contractType: 'freelance',
      postedBy: {
        id: '3',
        firstName: 'Anna',
        lastName: 'Weber',
        photoUrl: 'https://ui-avatars.com/api/?name=Anna+Weber',
        company: 'Tech Solutions GmbH'
      },
      postedDate: new Date('2024-03-08'),
      isActive: true
    },
    {
      id: '4',
      reference: 'MISS-004',
      title: 'Data Engineer',
      description: 'Seeking a Data Engineer to help build and maintain our data pipeline infrastructure.',
      requiredExpertise: ['Python', 'Apache Spark', 'AWS', 'Airflow', 'SQL'],
      seniority: 'between_3_and_10',
      workLocation: 'remote',
      startDate: new Date('2024-04-20'),
      contractType: 'cdi',
      postedBy: {
        id: '4',
        firstName: 'Marie',
        lastName: 'Dubois',
        photoUrl: 'https://ui-avatars.com/api/?name=Marie+Dubois',
        company: 'DataTech Solutions'
      },
      postedDate: new Date('2024-03-10'),
      isActive: true
    },
    {
      id: '5',
      reference: 'MISS-005',
      title: 'Frontend Developer',
      description: 'Looking for a Frontend Developer with strong Vue.js experience for an exciting e-commerce project.',
      requiredExpertise: ['Vue.js', 'TypeScript', 'Tailwind CSS', 'Jest', 'Webpack'],
      seniority: 'less_than_3',
      workLocation: 'onsite',
      cities: [
        { name: 'Toulouse', country: 'France', countryCode: 'FR' }
      ],
      startDate: new Date('2024-04-05'),
      contractType: 'cdd',
      postedBy: {
        id: '5',
        firstName: 'Carlos',
        lastName: 'Garcia',
        photoUrl: 'https://ui-avatars.com/api/?name=Carlos+Garcia',
        company: 'Web Innovators'
      },
      postedDate: new Date('2024-03-12'),
      isActive: true
    },
    {
      id: '6',
      reference: 'MISS-006',
      title: 'Cloud Architect',
      description: 'Seeking an experienced Cloud Architect to lead our cloud transformation initiatives.',
      requiredExpertise: ['AWS', 'Azure', 'Kubernetes', 'Terraform', 'Microservices'],
      seniority: 'more_than_10',
      workLocation: 'hybrid',
      cities: [
        { name: 'Lille', country: 'France', countryCode: 'FR' }
      ],
      startDate: new Date('2024-05-01'),
      contractType: 'freelance',
      postedBy: {
        id: '6',
        firstName: 'Jan',
        lastName: 'de Vries',
        photoUrl: 'https://ui-avatars.com/api/?name=Jan+de+Vries',
        company: 'Cloud Masters'
      },
      postedDate: new Date('2024-03-15'),
      isActive: true
    },
    {
      id: '7',
      reference: 'MISS-007',
      title: 'Mobile Developer',
      description: 'Looking for a Mobile Developer with React Native expertise for a healthcare application.',
      requiredExpertise: ['React Native', 'TypeScript', 'Redux', 'Jest', 'Firebase'],
      seniority: 'between_3_and_10',
      workLocation: 'remote',
      startDate: new Date('2024-04-25'),
      contractType: 'cdi',
      postedBy: {
        id: '7',
        firstName: 'Emma',
        lastName: 'Brown',
        photoUrl: 'https://ui-avatars.com/api/?name=Emma+Brown',
        company: 'Health Tech Solutions'
      },
      postedDate: new Date('2024-03-18'),
      isActive: true
    },
    {
      id: '8',
      reference: 'MISS-008',
      title: 'Backend Developer',
      description: 'Seeking a Backend Developer with Node.js and MongoDB experience for a social media platform.',
      requiredExpertise: ['Node.js', 'MongoDB', 'Express', 'GraphQL', 'Redis'],
      seniority: 'between_3_and_10',
      workLocation: 'hybrid',
      cities: [
        { name: 'Nice', country: 'France', countryCode: 'FR' }
      ],
      startDate: new Date('2024-04-30'),
      contractType: 'freelance',
      postedBy: {
        id: '8',
        firstName: 'Marco',
        lastName: 'Rossi',
        photoUrl: 'https://ui-avatars.com/api/?name=Marco+Rossi',
        company: 'Social Tech'
      },
      postedDate: new Date('2024-03-20'),
      isActive: true
    },
    {
      id: '9',
      reference: 'MISS-009',
      title: 'Security Engineer',
      description: 'Looking for a Security Engineer to help strengthen our application security practices.',
      requiredExpertise: ['OWASP', 'Penetration Testing', 'Security Auditing', 'DevSecOps'],
      seniority: 'more_than_10',
      workLocation: 'onsite',
      cities: [
        { name: 'Strasbourg', country: 'France', countryCode: 'FR' }
      ],
      startDate: new Date('2024-05-15'),
      contractType: 'cdi',
      postedBy: {
        id: '9',
        firstName: 'Thomas',
        lastName: 'Dubois',
        photoUrl: 'https://ui-avatars.com/api/?name=Thomas+Dubois',
        company: 'SecureNet'
      },
      postedDate: new Date('2024-03-22'),
      isActive: true
    },
    {
      id: '10',
      reference: 'MISS-010',
      title: 'ML Engineer',
      description: 'Seeking an ML Engineer with experience in NLP and computer vision applications.',
      requiredExpertise: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision'],
      seniority: 'more_than_10',
      workLocation: 'remote',
      startDate: new Date('2024-05-10'),
      contractType: 'freelance',
      postedBy: {
        id: '10',
        firstName: 'Sarah',
        lastName: 'Johnson',
        photoUrl: 'https://ui-avatars.com/api/?name=Sarah+Johnson',
        company: 'AI Solutions'
      },
      postedDate: new Date('2024-03-25'),
      isActive: true
    },
    {
      id: '11',
      reference: 'MISS-011',
      title: 'UI/UX Designer',
      description: 'Looking for a UI/UX Designer with experience in design systems and user research.',
      requiredExpertise: ['Figma', 'Adobe XD', 'User Research', 'Design Systems', 'Prototyping'],
      seniority: 'between_3_and_10',
      workLocation: 'hybrid',
      cities: [
        { name: 'Zurich', country: 'Switzerland', countryCode: 'CH' }
      ],
      startDate: new Date('2024-05-05'),
      contractType: 'cdi',
      postedBy: {
        id: '11',
        firstName: 'Lisa',
        lastName: 'Mueller',
        photoUrl: 'https://ui-avatars.com/api/?name=Lisa+Mueller',
        company: 'Design Hub'
      },
      postedDate: new Date('2024-03-28'),
      isActive: true
    },
    {
      id: '12',
      reference: 'MISS-012',
      title: 'Blockchain Developer',
      description: 'Seeking a Blockchain Developer with Solidity experience for a DeFi project.',
      requiredExpertise: ['Solidity', 'Web3.js', 'Smart Contracts', 'Ethereum', 'DeFi'],
      seniority: 'more_than_10',
      workLocation: 'remote',
      startDate: new Date('2024-05-20'),
      contractType: 'freelance',
      postedBy: {
        id: '12',
        firstName: 'Alex',
        lastName: 'Wilson',
        photoUrl: 'https://ui-avatars.com/api/?name=Alex+Wilson',
        company: 'Blockchain Ventures'
      },
      postedDate: new Date('2024-03-30'),
      isActive: true
    },
    {
      id: '13',
      reference: 'MISS-013',
      title: 'SRE Engineer',
      description: 'Looking for an SRE Engineer to help improve our system reliability and observability.',
      requiredExpertise: ['Kubernetes', 'Prometheus', 'Grafana', 'SLOs', 'Infrastructure as Code'],
      seniority: 'between_3_and_10',
      workLocation: 'hybrid',
      cities: [
        { name: 'Paris', country: 'France', countryCode: 'FR' }
      ],
      startDate: new Date('2024-05-25'),
      contractType: 'cdi',
      postedBy: {
        id: '13',
        firstName: 'Pierre',
        lastName: 'Laurent',
        photoUrl: 'https://ui-avatars.com/api/?name=Pierre+Laurent',
        company: 'ReliableTech'
      },
      postedDate: new Date('2024-04-01'),
      isActive: true
    },
    {
      id: '14',
      reference: 'MISS-014',
      title: 'Performance Engineer',
      description: 'Seeking a Performance Engineer to optimize our web application performance.',
      requiredExpertise: ['Performance Testing', 'JMeter', 'Lighthouse', 'Web Vitals', 'Load Testing'],
      seniority: 'more_than_10',
      workLocation: 'remote',
      startDate: new Date('2024-06-01'),
      contractType: 'freelance',
      postedBy: {
        id: '14',
        firstName: 'David',
        lastName: 'Anderson',
        photoUrl: 'https://ui-avatars.com/api/?name=David+Anderson',
        company: 'Performance Pro'
      },
      postedDate: new Date('2024-04-05'),
      isActive: true
    },
    {
      id: '15',
      reference: 'MISS-015',
      title: 'Technical Lead',
      description: 'Looking for a Technical Lead to manage our development team and drive technical decisions.',
      requiredExpertise: ['Team Leadership', 'Architecture', 'Agile', 'Code Review', 'Mentoring'],
      seniority: 'more_than_10',
      workLocation: 'hybrid',
      cities: [
        { name: 'London', country: 'United Kingdom', countryCode: 'GB' }
      ],
      startDate: new Date('2024-05-30'),
      contractType: 'cdi',
      postedBy: {
        id: '15',
        firstName: 'James',
        lastName: 'Taylor',
        photoUrl: 'https://ui-avatars.com/api/?name=James+Taylor',
        company: 'Tech Leaders'
      },
      postedDate: new Date('2024-04-08'),
      isActive: true
    }
  ];

  constructor() {
    // Initialize filtered positions with all positions to ensure search works for everyone
    this.filteredPositions = this.positions.slice(0, this.pageSize);
    this.initialLoadComplete = true;
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
      const newItems = this.positions.slice(start, end);
      
      if (newItems.length > 0) {
        this.filteredPositions = [...this.filteredPositions, ...newItems];
        this.currentPage++;
      } else {
        this.hasMoreItems = false;
      }
      
      this.isLoading = false;
    }, 500);
  }

  toggleDetails(id: string): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  filterPositions(): void {
    this.currentPage = 1;
    this.hasMoreItems = true;
    
    const filtered = this.positions.filter(position => {
      const matchesSearch = !this.searchQuery || 
        position.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        position.requiredExpertise.some(skill => 
          skill.toLowerCase().includes(this.searchQuery.toLowerCase())
        );

      const matchesCountry = !this.selectedCountry || 
        position.cities?.some(city => city.countryCode === this.selectedCountry);

      const matchesSeniority = !this.selectedSeniority || 
        position.seniority === this.selectedSeniority;

      return matchesSearch && matchesCountry && matchesSeniority;
    }).slice(0, this.pageSize);
    
    this.filteredPositions = filtered;
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

  getSeniorityText(seniority: string): string {
    switch (seniority) {
      case 'less_than_3':
        return '< 3 years';
      case 'between_3_and_10':
        return '3-10 years';
      case 'more_than_10':
        return '10+ years';
      default:
        return seniority;
    }
  }

  initiateConnect(event: Event, positionId: string): void {
    // Prevent row click propagation
    event.stopPropagation();
    
    // Save the position ID that the user wants to connect with
    localStorage.setItem('pendingPositionConnectionId', positionId);
    
    // Show the login modal to authenticate
    this.showLoginModal = true;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  handleLoginEvent(user: User): void {
    this.closeLoginModal();
    
    // Get the pending connection ID
    const pendingPositionId = localStorage.getItem('pendingPositionConnectionId');
    
    if (pendingPositionId) {
      // Here you would implement the actual connection logic
      console.log(`User ${user.id} is connecting with position ${pendingPositionId}`);
      
      // Clear the pending connection
      localStorage.removeItem('pendingPositionConnectionId');
    }
  }
}