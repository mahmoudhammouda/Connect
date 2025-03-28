import { Component, ElementRef, ViewChild, OnDestroy, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Déclaration pour l'API Chrome
declare namespace chrome {
  namespace tabs {
    function query(queryInfo: any, callback: (tabs: any[]) => void): void;
    function update(tabId: number, updateProperties: { url?: string }): void;
  }
}

interface Consultant {
  id: string;
  role: string;
  linkedinUrl: string;
  phone: string | null;
  email: string | null;
  locked: boolean;
  type: string;
  skills: string[];
  experience: 'less_than_3' | 'between_3_and_10' | 'more_than_10';
  phoneValidated: boolean;
  emailValidated: boolean;
  linkedinValidated: boolean;
  availability: 'available' | 'soon' | 'unavailable';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-4 bg-gray-100 min-h-screen flex flex-col pr-6">
      <!-- Search and Filter Bar -->
      <div class="sticky top-0 bg-white z-10 mb-6 p-4 rounded-lg shadow-md border border-gray-100">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="col-span-1 md:col-span-1">
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <span class="material-icons text-base">search</span>
              </span>
              <input 
                type="text" 
                [(ngModel)]="searchQuery"
                (ngModelChange)="filterConsultants()"
                placeholder="Rechercher par rôle, compétence..."
                class="w-full py-2.5 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
            </div>
          </div>
          <div>
            <div class="relative">
              <select 
                [(ngModel)]="selectedType"
                (ngModelChange)="filterConsultants()"
                class="w-full py-2.5 pl-10 pr-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="">Tous les types</option>
                <option value="Freelance">Freelance</option>
                <option value="Permanent">Permanent</option>
              </select>
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span class="material-icons text-gray-400 text-base">business</span>
              </div>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <span class="material-icons text-base">expand_more</span>
              </div>
            </div>
          </div>
          <div>
            <div class="relative">
              <select 
                [(ngModel)]="selectedExperience"
                (ngModelChange)="filterConsultants()"
                class="w-full py-2.5 pl-10 pr-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="">Tous les niveaux d'expérience</option>
                <option value="less_than_3">< 3 ans</option>
                <option value="between_3_and_10">3-10 ans</option>
                <option value="more_than_10">10+ ans</option>
              </select>
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span class="material-icons text-gray-400 text-base">work_history</span>
              </div>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <span class="material-icons text-base">expand_more</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Horizontal Scrolling Container -->
      <div class="overflow-x-auto">
        <table class="min-w-full table-fixed border-separate border-spacing-y-3 bg-gray-100">
          <tbody>
            <tr 
              *ngFor="let consultant of displayedConsultants"
              class="hover:bg-gray-50 transition-colors duration-150 relative shadow-md rounded-lg overflow-hidden border border-gray-100 mb-3 bg-white"
            >
              <td class="px-3 py-4 whitespace-nowrap relative border-r border-gray-100 w-16">
                <div class="flex flex-col items-center justify-center">
                  <span 
                    class="material-icons text-sm"
                    [class]="consultant.locked ? 'text-red-500' : 'text-green-500'"
                    [title]="getLockTitle(consultant)"
                  >{{getLockIcon(consultant)}}</span>
                  <span class="text-xs text-gray-400 mt-1">#{{consultant.id.substring(0, 4)}}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                <div class="font-medium text-gray-900 truncate max-w-[200px] flex items-center gap-2">
                  <!-- Availability indicator (like Teams) -->
                  <div 
                    class="w-3 h-3 rounded-full"
                    [ngClass]="{
                      'bg-green-500': consultant.availability === 'available',
                      'bg-yellow-500': consultant.availability === 'soon',
                      'bg-red-500': consultant.availability === 'unavailable'
                    }"
                    [title]="getAvailabilityTitle(consultant)"
                  ></div>
                  {{consultant.role}}
                </div>
                <!-- Skills on second line -->
                <div class="flex flex-wrap gap-1 mt-1 items-center">
                  <!-- Seniority indicator -->
                  <div class="flex gap-0.5 mr-2">
                    <div *ngIf="consultant.experience === 'less_than_3'" class="flex gap-0.5">
                      <div class="w-1.5 h-4 bg-blue-500 rounded"></div>
                      <div class="w-1.5 h-4 bg-gray-200 rounded"></div>
                      <div class="w-1.5 h-4 bg-gray-200 rounded"></div>
                    </div>
                    <div *ngIf="consultant.experience === 'between_3_and_10'" class="flex gap-0.5">
                      <div class="w-1.5 h-4 bg-blue-500 rounded"></div>
                      <div class="w-1.5 h-4 bg-blue-500 rounded"></div>
                      <div class="w-1.5 h-4 bg-gray-200 rounded"></div>
                    </div>
                    <div *ngIf="consultant.experience === 'more_than_10'" class="flex gap-0.5">
                      <div class="w-1.5 h-4 bg-blue-500 rounded"></div>
                      <div class="w-1.5 h-4 bg-blue-500 rounded"></div>
                      <div class="w-1.5 h-4 bg-blue-500 rounded"></div>
                    </div>
                  </div>
                  <span *ngFor="let skill of consultant.skills.slice(0, 3)" class="bg-gray-100 px-1.5 py-0 rounded-sm text-xs text-gray-700">
                    {{skill}}
                  </span>
                  <span *ngIf="consultant.skills.length > 3" class="text-gray-500 text-xs">+{{consultant.skills.length - 3}}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3 justify-end">
                  <!-- Action buttons group - visible on desktop -->
                  <div class="hidden sm:flex items-center gap-3">
                    <!-- LinkedIn button -->
                    <button
                      class="w-6 h-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                      (click)="openLinkedIn(consultant.linkedinUrl)"
                      title="Voir le profil LinkedIn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </button>
                    
                    <!-- Phone button -->
                    <button
                      class="w-6 h-6 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
                      [class.opacity-50]="!consultant.phoneValidated"
                      [disabled]="!consultant.phoneValidated"
                      (click)="showPhone(consultant.phone)"
                      title="Appeler"
                    >
                      <span class="material-icons text-xs">phone</span>
                    </button>
                    
                    <!-- Email button -->
                    <button
                      class="w-6 h-6 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center"
                      [class.opacity-50]="!consultant.emailValidated"
                      [disabled]="!consultant.emailValidated"
                      (click)="sendEmail(consultant.email)"
                      title="Envoyer un email"
                    >
                      <span class="material-icons text-xs">email</span>
                    </button>
                  </div>
                  
                  <!-- Dropdown button - visible on mobile -->
                  <div class="relative sm:hidden">
                    <button
                      class="w-6 h-6 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
                      (click)="toggleDropdown(consultant.id, $event)"
                      title="Plus d'actions"
                    >
                      <span class="material-icons text-xs">more_vert</span>
                    </button>
                    
                    <!-- Dropdown menu -->
                    <div 
                      *ngIf="dropdownOpen[consultant.id]"
                      class="absolute z-10 bg-white shadow-md rounded-lg p-2 w-48 right-0 top-full mt-1 dropdown-menu"
                    >
                      <button 
                        class="block w-full text-left py-2 px-4 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
                        (click)="openLinkedIn(consultant.linkedinUrl)"
                      >
                        <span class="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="white" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                        </span>
                        Voir le profil LinkedIn
                      </button>
                      <button 
                        class="block w-full text-left py-2 px-4 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
                        [class.opacity-50]="!consultant.phoneValidated"
                        [disabled]="!consultant.phoneValidated"
                        (click)="showPhone(consultant.phone)"
                      >
                        <span class="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <span class="material-icons text-white" style="font-size: 10px;">phone</span>
                        </span>
                        Appeler
                      </button>
                      <button 
                        class="block w-full text-left py-2 px-4 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
                        [class.opacity-50]="!consultant.emailValidated"
                        [disabled]="!consultant.emailValidated"
                        (click)="sendEmail(consultant.email)"
                      >
                        <span class="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                          <span class="material-icons text-white" style="font-size: 10px;">email</span>
                        </span>
                        Envoyer un email
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Loading Indicator for Infinite Scroll -->
        <div *ngIf="isLoadingMore && hasMoreConsultants" class="flex justify-center mt-4 mb-6">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

      </div>

      <!-- Loading Indicator -->
      <div *ngIf="isLoading" class="flex justify-center items-center py-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    </div>
  `,
  styles: [`
    /* Styles pour l'application */
    :host {
      display: block;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #2c3e50;
      background-color: #f3f6f8; /* Couleur de fond similaire à LinkedIn */
      min-height: 100vh;
    }
    
    /* Animations et effets */
    .hover\:bg-gray-50:hover {
      background-color: #f9fafb;
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
      .container {
        padding: 0.5rem;
        padding-right: 1.5rem;
      }
    }
    
    /* Styles pour l'extension Chrome */
    :host {
      height: 100vh;
      overflow-y: auto;
    }
    
    .container {
      min-height: 100vh;
      padding-right: 1.5rem !important; /* Espace pour la barre de défilement */
    }
    
    /* Styles pour la barre de défilement */
    ::-webkit-scrollbar {
      width: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `]
})
export class AppComponent {
  title = 'connect-extension-app';
  
  // Vérifier si nous sommes dans un navigateur
  private isBrowser: boolean;
  
  // Filtres
  searchQuery: string = '';
  selectedType: string = '';
  selectedExperience: string = '';
  
  // États de chargement
  isLoading: boolean = false;
  isLoadingMore: boolean = false;
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5; // Réduire pour voir plus facilement le chargement
  hasMoreConsultants: boolean = true;
  
  // Listes de consultants
  allConsultants: Consultant[] = [];
  filteredConsultants: Consultant[] = [];
  displayedConsultants: Consultant[] = [];

  // État du menu déroulant pour chaque consultant
  dropdownOpen: { [key: string]: boolean } = {};
  
  // Détecte si l'écran est en mode mobile
  isMobileView: boolean = false;
  
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.generateConsultants();
    this.filterConsultants();
    
    // Configurer le défilement pour l'extension Chrome
    if (this.isBrowser) {
      // Utiliser un délai pour s'assurer que le DOM est prêt
      setTimeout(() => {
        this.setupScrollListener();
        this.checkScreenSize();
      }, 500);
      
      // Écouter les changements de taille d'écran
      window.addEventListener('resize', this.checkScreenSize.bind(this));
    }
  }
  
  // Vérifie la taille de l'écran pour déterminer si on est en mode mobile
  checkScreenSize() {
    this.isMobileView = window.innerWidth < 640; // 640px est la limite pour sm dans Tailwind
  }
  
  // Ouvre ou ferme le menu déroulant pour un consultant
  toggleDropdown(consultantId: string, event: Event) {
    event.stopPropagation(); // Empêche la propagation de l'événement
    
    // Ferme tous les autres menus déroulants
    Object.keys(this.dropdownOpen).forEach(id => {
      if (id !== consultantId) {
        this.dropdownOpen[id] = false;
      }
    });
    
    // Bascule l'état du menu pour ce consultant
    this.dropdownOpen[consultantId] = !this.dropdownOpen[consultantId];
  }
  
  // Ferme tous les menus déroulants
  closeAllDropdowns(event: Event) {
    if (event.target instanceof Element) {
      const target = event.target as Element;
      if (target.closest('.dropdown-menu') || target.closest('button[title="Plus d\'actions"]')) {
        return;
      }
    }
    Object.keys(this.dropdownOpen).forEach(id => {
      this.dropdownOpen[id] = false;
    });
  }
  
  // Configure l'écouteur de défilement pour l'extension Chrome
  setupScrollListener() {
    // Ajouter un écouteur d'événement de défilement à la fenêtre et au document
    window.addEventListener('scroll', this.handleScroll.bind(this));
    document.addEventListener('scroll', this.handleScroll.bind(this));
    
    // Ajouter un écouteur d'événement pour fermer les menus déroulants lors d'un clic en dehors
    document.addEventListener('click', this.closeAllDropdowns.bind(this));
    
    // Également vérifier périodiquement si nous sommes près du bas
    // Cela aide dans les environnements où les événements de défilement peuvent ne pas se déclencher correctement
    setInterval(() => {
      this.checkScrollPosition();
    }, 1000);
  }
  
  // Vérifie si nous sommes près du bas de la page
  checkScrollPosition() {
    if (!this.isBrowser || this.isLoadingMore || !this.hasMoreConsultants) {
      return;
    }
    
    const scrollHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
    
    const scrollTop = Math.max(
      window.pageYOffset,
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
    
    const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    
    // Si nous sommes à moins de 200px du bas
    if (scrollHeight - scrollTop - clientHeight < 200) {
      this.loadMoreConsultants();
    }
  }

  // Écouteur d'événement de défilement
  handleScroll() {
    this.checkScrollPosition();
  }
  
  // Génère une liste de consultants fictifs
  generateConsultants() {
    const roles = [
      'Développeur Frontend Angular', 'Développeur Backend Java', 'DevOps Engineer', 
      'Data Scientist', 'UX Designer', 'Product Owner', 'Scrum Master', 
      'Développeur Full Stack', 'Architecte Solution', 'Ingénieur QA',
      'Développeur React', 'Développeur Node.js', 'Développeur Python',
      'Architecte Cloud', 'Ingénieur Big Data', 'Développeur Mobile',
      'Administrateur Système', 'Développeur .NET', 'Chef de Projet IT',
      'Consultant Cybersécurité'
    ];
    
    const types = ['Freelance', 'Permanent'];
    
    const experiences = ['less_than_3', 'between_3_and_10', 'more_than_10'];
    
    const availabilities = ['available', 'soon', 'unavailable'];
    
    const skillsPool = [
      'Angular', 'React', 'Vue.js', 'JavaScript', 'TypeScript', 'HTML', 'CSS',
      'Java', 'Spring', 'Python', 'Django', 'Flask', 'Node.js', 'Express',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Git',
      'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
      'REST API', 'GraphQL', 'Microservices', 'TDD', 'Agile', 'Scrum',
      '.NET', 'C#', 'PHP', 'Laravel', 'Ruby', 'Rails', 'Go', 'Rust',
      'Mobile', 'iOS', 'Android', 'React Native', 'Flutter', 'Kotlin', 'Swift',
      'UI/UX', 'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator',
      'DevOps', 'Jenkins', 'Terraform', 'Ansible', 'Prometheus', 'Grafana',
      'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP',
      'Big Data', 'Hadoop', 'Spark', 'Kafka', 'ELK Stack', 'Tableau', 'Power BI'
    ];
    
    // Génère 40 consultants
    for (let i = 1; i <= 40; i++) {
      const randomRole = roles[Math.floor(Math.random() * roles.length)];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomExperience = experiences[Math.floor(Math.random() * experiences.length)];
      const randomAvailability = availabilities[Math.floor(Math.random() * availabilities.length)];
      
      // Génère 2-6 compétences aléatoires
      const numSkills = Math.floor(Math.random() * 5) + 2;
      const shuffledSkills = [...skillsPool].sort(() => 0.5 - Math.random());
      const randomSkills = shuffledSkills.slice(0, numSkills);
      
      // Génère des valeurs aléatoires pour les validations
      const phoneValidated = Math.random() > 0.3;
      const emailValidated = Math.random() > 0.3;
      const linkedinValidated = Math.random() > 0.2;
      const locked = Math.random() > 0.7;
      
      this.allConsultants.push({
        id: `C${i.toString().padStart(3, '0')}`,
        role: randomRole,
        linkedinUrl: 'https://www.linkedin.com/in/example-profile/',
        phone: phoneValidated ? '+33 6 12 34 56 78' : null,
        email: emailValidated ? 'consultant@example.com' : null,
        locked: locked,
        type: randomType,
        skills: randomSkills,
        experience: randomExperience as any,
        phoneValidated: phoneValidated,
        emailValidated: emailValidated,
        linkedinValidated: linkedinValidated,
        availability: randomAvailability as any
      });
    }
  }
  
  // Filtre les consultants selon les critères de recherche
  filterConsultants() {
    this.isLoading = true;
    
    // Simule un délai de chargement
    setTimeout(() => {
      this.filteredConsultants = this.allConsultants.filter(consultant => {
        // Filtre par terme de recherche
        const searchMatch = !this.searchQuery || 
          consultant.role.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          consultant.skills.some(skill => skill.toLowerCase().includes(this.searchQuery.toLowerCase()));
        
        // Filtre par type
        const typeMatch = !this.selectedType || consultant.type === this.selectedType;
        
        // Filtre par expérience
        const experienceMatch = !this.selectedExperience || consultant.experience === this.selectedExperience;
        
        return searchMatch && typeMatch && experienceMatch;
      });
      
      this.currentPage = 1;
      this.loadConsultantsPage();
      this.isLoading = false;
    }, 300);
  }
  
  // Charge une page de consultants
  loadConsultantsPage() {
    const startIndex = 0;
    const endIndex = this.currentPage * this.itemsPerPage;
    
    this.displayedConsultants = this.filteredConsultants.slice(startIndex, endIndex);
    this.hasMoreConsultants = endIndex < this.filteredConsultants.length;
    
    // Afficher des informations de débogage dans la console
    console.log(`Consultants chargés: ${this.displayedConsultants.length} sur ${this.filteredConsultants.length}`);
    console.log(`Page actuelle: ${this.currentPage}, Plus de consultants: ${this.hasMoreConsultants}`);
  }
  
  // Charge plus de consultants
  loadMoreConsultants() {
    // Éviter les chargements multiples
    if (this.isLoadingMore) {
      return;
    }
    
    this.isLoadingMore = true;
    console.log("Chargement de plus de consultants...");
    
    // Simule un délai de chargement
    setTimeout(() => {
      this.currentPage++;
      this.loadConsultantsPage();
      this.isLoadingMore = false;
      console.log("Chargement terminé.");
    }, 800);
  }
  
  // Ouvre le profil LinkedIn
  openLinkedIn(url: string) {
    // Ne rien faire si nous ne sommes pas dans un navigateur
    if (!this.isBrowser) return;
    
    // Méthode sécurisée pour ouvrir un lien
    try {
      // Vérifier si nous sommes dans une extension Chrome
      if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
        // Utiliser l'API chrome.tabs de manière sécurisée
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          if (tabs && tabs.length > 0) {
            chrome.tabs.update(tabs[0].id, { url: url });
          } else {
            window.open(url, '_blank');
          }
        });
      } else {
        // Fallback si nous ne sommes pas dans une extension Chrome
        window.open(url, '_blank');
      }
    } catch (e) {
      // En cas d'erreur, utiliser la méthode standard
      window.open(url, '_blank');
    }
  }
  
  // Affiche le numéro de téléphone
  showPhone(phone: string | null) {
    if (!this.isBrowser || !phone) return;
    
    alert(`Numéro de téléphone: ${phone}`);
  }
  
  // Envoie un email
  sendEmail(email: string | null) {
    if (!this.isBrowser || !email) return;
    
    window.open(`mailto:${email}`);
  }
  
  // Obtient l'icône de verrouillage
  getLockIcon(consultant: Consultant): string {
    return consultant.locked ? 'lock' : 'lock_open';
  }
  
  // Obtient le titre de l'icône de verrouillage
  getLockTitle(consultant: Consultant): string {
    return consultant.locked ? 'Profil verrouillé' : 'Profil déverrouillé';
  }
  
  // Obtient le titre de l'indicateur de disponibilité
  getAvailabilityTitle(consultant: Consultant): string {
    switch (consultant.availability) {
      case 'available':
        return 'Disponible immédiatement';
      case 'soon':
        return 'Disponible prochainement';
      case 'unavailable':
        return 'Non disponible';
      default:
        return '';
    }
  }
}
