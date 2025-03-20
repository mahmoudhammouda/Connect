import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recruiter-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recruiter-post.component.html',
  styleUrls: ['./recruiter-post.component.scss']
})
export class RecruiterPostComponent {
  @Input() name: string = 'Thomas Martin';
  @Input() role: string = 'IT Recruitment Specialist at TechTalent';
  @Input() message: string = `🔥 Exciting opportunity for a Senior Cloud Architect! 🔥

My client, a leading fintech company, is looking for an experienced Cloud Architect with AWS expertise to join their growing team. This is a 6-month contract with possibility of extension, hybrid working model (2 days in Paris office).

Key skills: AWS, Terraform, Kubernetes, CI/CD, Python/Java`;
  @Input() hashtags: string = '#CloudArchitect #AWS #Kubernetes #Fintech #ParisJobs #Hiring';
  @Input() likes: number = 42;
  @Input() comments: number = 8;
  @Input() shares: number = 15;
  @Input() avatarUrl: string | null = null;
  @Input() onApplyButtonClick: () => void = () => {};

  onApplyClick() {
    this.onApplyButtonClick();
  }
}
