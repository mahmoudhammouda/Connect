import { Component, AfterViewInit, ViewEncapsulation, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultantPostComponent } from '../consultant-post/consultant-post.component';
import { RecruiterPostComponent } from '../recruiter-post/recruiter-post.component';

interface PostData {
  type: 'consultant' | 'recruiter';
  name: string;
  role: string;
  message: string;
  hashtags: string;
  likes: number;
  comments: number;
  shares: number;
  avatarUrl: string | null;
}

@Component({
  selector: 'app-post-carousel',
  standalone: true,
  imports: [CommonModule, ConsultantPostComponent, RecruiterPostComponent],
  templateUrl: './post-carousel.component.html',
  styleUrls: ['./post-carousel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PostCarouselComponent implements AfterViewInit {
  @Input() openLoginFunction: () => void = () => {};
  
  currentSlide = 0;
  slideWidth = 0;
  slidesToShow = 2;
  
  posts: PostData[] = [
    {
      type: 'consultant',
      name: 'Marie Dupont',
      role: 'Senior Java Developer',
      message: `Hello connections! I'm excited to share that I'll be available for new opportunities starting next month. With over 8 years of Java experience specializing in Spring Boot and microservices architecture, I'm looking for challenging projects where I can make an impact.\n\nI prefer fully remote opportunities but am open to hybrid arrangements in the Paris area. Please reach out if you know of any fitting roles!`,
      hashtags: '#JavaDeveloper #Microservices #SpringBoot #AvailableForWork #RemoteWork',
      likes: 68,
      comments: 12,
      shares: 5,
      avatarUrl: 'https://randomuser.me/api/portraits/women/12.jpg'
    },
    {
      type: 'recruiter',
      name: 'Thomas Martin',
      role: 'IT Recruitment Specialist at TechTalent',
      message: `🔥 Exciting opportunity for a Senior Cloud Architect! 🔥\n\nMy client, a leading fintech company, is looking for an experienced Cloud Architect with AWS expertise to join their growing team. This is a 6-month contract with possibility of extension, hybrid working model (2 days in Paris office).\n\nKey skills: AWS, Terraform, Kubernetes, CI/CD, Python/Java`,
      hashtags: '#CloudArchitect #AWS #Kubernetes #Fintech #ParisJobs #Hiring',
      likes: 42,
      comments: 8,
      shares: 15,
      avatarUrl: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    {
      type: 'consultant',
      name: 'Lucas Dubois',
      role: 'Full Stack Developer',
      message: `Available now for new projects! After 5 successful years with my previous client, I'm looking for a challenging full-stack position. React, Node.js, and MongoDB are my specialties, with experience in AWS and Docker.\n\nOpen to 100% remote positions across Europe. Let's connect if you're looking for a developer who can handle both front and back-end with equal expertise!`,
      hashtags: '#FullStack #React #NodeJS #Remote #Developer',
      likes: 43,
      comments: 7,
      shares: 3,
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      type: 'recruiter',
      name: 'Sophie Renaud',
      role: 'Tech Recruiter at InnovateHR',
      message: `We're looking for a DevOps Engineer for an exciting startup revolutionizing the FinTech space!\n\nMust have experience with: Kubernetes, Terraform, AWS, CI/CD pipelines\n\nThis is a permanent position with competitive salary and excellent benefits. Hybrid work model with only 1 day per week in our beautiful Paris office.`,
      hashtags: '#DevOps #Kubernetes #AWS #Hiring #TechJobs #Paris',
      likes: 35,
      comments: 11,
      shares: 8,
      avatarUrl: 'https://randomuser.me/api/portraits/women/28.jpg'
    },
    {
      type: 'consultant',
      name: 'Emma Laurent',
      role: 'UX/UI Designer',
      message: `After 3 years working for a major e-commerce platform, I'm seeking new design challenges! I specialize in creating intuitive, accessible interfaces that delight users and drive business results.\n\nMy expertise includes: Figma, Adobe XD, user research, design systems\n\nAvailable for full-time positions or consulting projects starting June 2025.`,
      hashtags: '#UXDesign #UIDesigner #UserExperience #AvailableForWork',
      likes: 56,
      comments: 14,
      shares: 9,
      avatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
    {
      type: 'recruiter',
      name: 'Alexandre Moreau',
      role: 'Senior Technical Recruiter at TechForce',
      message: `URGENT: Looking for a Senior React Native Developer for a 12-month contract (possible extension) with a health tech company.\n\nRequirements:\n- 4+ years of React Native experience\n- Experience with health/medical apps\n- Knowledge of HIPAA/GDPR compliance\n\nCompetitive daily rate! Start date: immediate.`,
      hashtags: '#ReactNative #MobileDev #Healthcare #ContractWork #HighPaying',
      likes: 29,
      comments: 6,
      shares: 10,
      avatarUrl: 'https://randomuser.me/api/portraits/men/77.jpg'
    }
  ];

  @HostListener('window:resize')
  onResize() {
    this.calculateSlidesPerView();
    this.calculateSlideWidth();
    this.equalizeCardHeights();
  }

  handlePostAction() {
    this.openLoginFunction();
  }

  ngAfterViewInit() {
    // Initialize carousel
    setTimeout(() => {
      this.calculateSlidesPerView();
      this.calculateSlideWidth();
      this.equalizeCardHeights();
    }, 100);
  }

  calculateSlidesPerView() {
    // Responsive behavior - adjust slidesToShow based on screen width
    if (window.innerWidth < 768) {
      this.slidesToShow = 1;
    } else {
      this.slidesToShow = 2;
    }
  }

  calculateSlideWidth() {
    const slidesContainer = document.querySelector('.slides-container') as HTMLElement;
    if (slidesContainer) {
      this.slideWidth = slidesContainer.offsetWidth / this.slidesToShow;
      
      // Apply width to slides
      const slides = document.querySelectorAll('.slide');
      slides.forEach(slide => {
        (slide as HTMLElement).style.width = `${this.slideWidth}px`;
      });
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  nextSlide() {
    if (this.currentSlide < this.posts.length - this.slidesToShow) {
      this.currentSlide++;
    }
  }

  goToSlide(index: number) {
    if (index >= 0 && index <= this.posts.length - this.slidesToShow) {
      this.currentSlide = index;
    }
  }

  equalizeCardHeights() {
    setTimeout(() => {
      const slides = document.querySelectorAll('.slide');
      
      if (!slides || slides.length === 0) return;
      
      // Reset heights first
      slides.forEach(el => {
        (el as HTMLElement).style.height = 'auto';
      });
      
      // Find maximum height
      let maxHeight = 0;
      slides.forEach(el => {
        const height = (el as HTMLElement).offsetHeight;
        maxHeight = Math.max(maxHeight, height);
      });
      
      // Apply maximum height to all slides
      if (maxHeight > 0) {
        slides.forEach(el => {
          (el as HTMLElement).style.height = `${maxHeight}px`;
          
          // Find all card components within this slide and set their height too
          const cards = el.querySelectorAll('.bg-white.rounded-lg');
          cards.forEach(card => {
            (card as HTMLElement).style.height = `${maxHeight}px`;
          });
        });
      }
    }, 500);
  }
}
