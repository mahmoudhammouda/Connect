import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const recruiterGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  
  const currentUser = userService.getCurrentUser()();
  
  if (!currentUser) {
    router.navigate(['/board']);
    return false;
  }
  
  // Allow access for recruiters and business developers
  if (currentUser.role !== 'recruiter' && currentUser.role !== 'business_developer') {
    router.navigate(['/board']);
    return false;
  }
  
  return true;
};
