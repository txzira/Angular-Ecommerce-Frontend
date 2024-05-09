import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { UserService } from '../../services/user/user/user.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  var isAuthenticated = true;

  const authService = inject(AuthService);
  const userService = inject(UserService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map((response) => {
      isAuthenticated = response;
      return isAuthenticated;
    }),
    catchError((error) => {
      router.navigate(['/auth/unauthorized']);
      userService.logoutUser();
      authService.logout().subscribe();
      return of(false);
    })
  );
};
