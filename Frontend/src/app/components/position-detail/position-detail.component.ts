import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenPosition } from '../../models/open-position.model';

@Component({
  selector: 'app-position-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './position-detail.component.html'
})
export class PositionDetailComponent {
  @Input() position!: OpenPosition;

  getSeniorityText(seniority: string): string {
    switch (seniority) {
      case 'less_than_3':
        return 'Less than 3 years';
      case 'between_3_and_10':
        return '3 to 10 years';
      case 'more_than_10':
        return 'More than 10 years';
      default:
        return 'Not specified';
    }
  }

  getCityName(): string {
    if (this.position.cities && this.position.cities.length > 0) {
      return this.position.cities[0].name;
    }
    return 'Unknown';
  }

  getCountryName(): string {
    if (this.position.cities && this.position.cities.length > 0) {
      return this.position.cities[0].country;
    }
    return 'Unknown';
  }

  hasCityData(): boolean {
    return Boolean(this.position.cities && this.position.cities.length > 0);
  }

  formatDate(date: Date): string {
    if (!date) return 'Not specified';
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    return new Date(date).toLocaleDateString('en-US', options);
  }
}
