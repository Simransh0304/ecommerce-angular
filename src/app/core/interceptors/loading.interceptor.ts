import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, finalize } from 'rxjs';

// Create a global loading subject
export const loadingSubject = new BehaviorSubject<boolean>(false);

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // Set loading state to true before the request
  loadingSubject.next(true);

  // Return the request and set loading to false when complete
  return next(req).pipe(
    finalize(() => {
      loadingSubject.next(false);
    })
  );
};
