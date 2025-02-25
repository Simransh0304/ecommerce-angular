import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if ([401, 403].includes(error.status)) {
        // Auto logout if 401 or 403 response returned from api
        authService.logout();
        router.navigate(['/auth/login']);
        return throwError(() => new Error('Unauthorized'));
      }

      const errorMessage = error.error?.message || error.statusText || 'An error occurred';
      console.error('API Error:', error);
      return throwError(() => new Error(errorMessage));
    })
  );
};
