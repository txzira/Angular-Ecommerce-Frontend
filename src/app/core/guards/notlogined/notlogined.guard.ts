import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user/user/user.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const NotLoginedGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.getUser().pipe(
    map((response) => {
      if (response === null) {
        return true;
      }
      router.navigate(['/']);

      return false;
    })
  );
};
