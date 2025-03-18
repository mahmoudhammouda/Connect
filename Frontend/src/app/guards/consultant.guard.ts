import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const consultantGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  
  const currentUser = userService.getCurrentUser()();
  
  if (!currentUser) {
    router.navigate(['/board']);
    return false;
  }
  
  if (currentUser.role !== 'consultant') {
    router.navigate(['/board']);
    return false;
  }
  
  return true;
};
