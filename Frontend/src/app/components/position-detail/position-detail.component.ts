import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OpenPosition } from '../../models/open-position.model';

@Component({
  selector: 'app-position-detail',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './position-detail.component.html'
})
export class PositionDetailComponent {
  @Input() position!: OpenPosition;

  formatDate(date: Date): string {
    return new DatePipe('en-US').transform(date, 'dd MMM yyyy') || '';
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

  hasCityData(): boolean {
    return !!this.position.cities && this.position.cities.length > 0;
  }

  getCityName(): string {
    if (this.position.cities && this.position.cities.length > 0) {
      return this.position.cities[0].name;
    }
    return '';
  }
}
