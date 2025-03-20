import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consultant-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consultant-post.component.html',
  styleUrls: ['./consultant-post.component.scss']
})
export class ConsultantPostComponent {
  @Input() name: string = 'Marie Dupont';
  @Input() role: string = 'Senior Java Developer';
  @Input() message: string = `Hello connections! I'm excited to share that I'll be available for new opportunities starting next month. With over 8 years of Java experience specializing in Spring Boot and microservices architecture, I'm looking for challenging projects where I can make an impact.
  
I prefer fully remote opportunities but am open to hybrid arrangements in the Paris area. Please reach out if you know of any fitting roles!`;
  @Input() hashtags: string = '#JavaDeveloper #Microservices #SpringBoot #AvailableForWork #RemoteWork';
  @Input() likes: number = 68;
  @Input() comments: number = 12;
  @Input() shares: number = 5;
  @Input() avatarUrl: string | null = null;
  @Input() onUnlockProfileClick: () => void = () => {};

  onUnlockClick() {
    this.onUnlockProfileClick();
  }
}
