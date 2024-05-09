import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, map, of } from 'rxjs';
import { inject } from '@angular/core';

export const AdminGuard: CanActivateFn = (route, state) => {
  var isAdmin = true;

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAdmin().pipe(
    map((response) => {
      isAdmin = response;
      return isAdmin;
    }),
    catchError((error) => {
      router.navigate(['/auth/unauthorized']);
      return of(false);
    })
  );
};
