import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuthenticated().pipe(
    tap(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: state.url }
        });
      }
    })
  );
};
