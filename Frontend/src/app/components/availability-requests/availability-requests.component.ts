import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecruiterRequest } from '../../models/recruiter-request.model';

@Component({
  selector: 'app-recruiter-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './availability-requests.component.html',
  styleUrls: ['./availability-requests.component.scss']
})
export class AvailabilityRequestsComponent {
  requests: RecruiterRequest[] = []; // This will be populated from a service
}