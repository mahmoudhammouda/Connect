import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecruiterRequest } from '../../models/recruiter-request.model';

@Component({
  selector: 'app-recruiter-requests',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-4">Expertise Requests</h2>
      <div class="grid gap-4">
        @for (request of requests; track request.id) {
          <div class="border p-4 rounded-lg shadow">
            <div class="font-bold">Posted: {{request.postedDate | date}}</div>
            <p class="my-2">{{request.description}}</p>
            <div class="mt-2">
              <span class="font-semibold">Required Expertise:</span>
              @for (expertise of request.requiredExpertise; track expertise) {
                <span class="ml-2 bg-green-100 px-2 py-1 rounded-full text-sm">{{expertise}}</span>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class RecruiterRequestsComponent {
  requests: RecruiterRequest[] = []; // This will be populated from a service
}