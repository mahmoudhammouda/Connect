import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OpenPosition } from '../../models/open-position.model';

@Component({
  selector: 'app-open-positions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './open-positions.component.html',
  styleUrls: ['./open-positions.component.scss']
})
export class OpenPositionsComponent {
  // Search and filter state
  searchQuery = '';
  selectedCountry = '';
  selectedSeniority = '';
  filteredPositions: OpenPosition[] = [];

  // Mock data
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
      title: 'Cloud Architect',
      description: 'Seeking an experienced Cloud Architect to lead our cloud transformation initiative. Must have extensive experience with AWS and microservices architecture.',
      requiredExpertise: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'Microservices'],
      seniority: 'more_than_10',
      workLocation: 'remote',
      startDate: new Date('2024-04-15'),
      contractType: 'cdi',
      postedBy: {
        id: '2',
        firstName: 'Jean',
        lastName: 'Dupont',
        photoUrl: 'https://ui-avatars.com/api/?name=Jean+Dupont',
        company: 'Digital Solutions'
      },
      postedDate: new Date('2024-03-05'),
      isActive: true
    }
  ];

  constructor() {
    this.filteredPositions = this.positions;
  }

  filterPositions(): void {
    this.filteredPositions = this.positions.filter(position => {
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
    });
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