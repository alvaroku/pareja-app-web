import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/usuario.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUserValue;
  const requiredRoles = route.data['roles'] as UserRole[];

  if (!currentUser) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredRoles && !requiredRoles.includes(currentUser.role)) {
    router.navigate(['/inicio']);
    return false;
  }

  return true;
};
