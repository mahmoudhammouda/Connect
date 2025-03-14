import { Component, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AvailabilityListComponent } from './app/components/availability-list/availability-list.component';
import { AvailabilityRequestsComponent } from './app/components/availability-requests/availability-requests.component';



const routes: Routes = [
  { path: 'availabilities', component: AvailabilityListComponent },
  { path: 'requests', component: AvailabilityRequestsComponent },
  { path: '', redirectTo: '/availabilities', pathMatch: 'full' }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between h-16">
            <div class="flex">
              <div class="flex-shrink-0 flex items-center">
                <h1 class="text-xl font-bold">FactConnect</h1>
              </div>
              <div class="hidden sm:ml-6 sm:flex sm:space-x-6">
                <a routerLink="/availabilities" 
                   routerLinkActive="border-b-2 border-blue-500"
                   class="inline-flex items-center px-1 pt-1 text-gray-900">
                  Available Experts
                </a>
                <a routerLink="/requests"
                   routerLinkActive="border-b-2 border-blue-500"
                   class="inline-flex items-center px-1 pt-1 text-gray-900">
                  Expertise Requests
                </a>
              </div>
            </div>
            <div class="flex items-center">
              <button class="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium">
                Login with LinkedIn
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class App {
  name = 'FactConnect';
}

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(RouterModule.forRoot(routes))
  ]
}).catch(err => console.error(err));