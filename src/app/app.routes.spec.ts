import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { routes } from './app.routes';
import { AuthService } from './core/services/auth.service';
import { BehaviorSubject } from 'rxjs';

describe('App Routing', () => {
  let router: Router;
  let location: Location;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    authService.currentUser$ = new BehaviorSubject(null);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      providers: [
        { provide: AuthService, useValue: authService }
      ]
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should navigate to products by default', fakeAsync(() => {
    router.navigate(['']);
    tick();
    expect(location.pathname).toBe('/products');
  }));

  it('should guard checkout route when not authenticated', fakeAsync(() => {
    authService.isAuthenticated.and.returnValue(false);
    router.navigate(['/checkout']);
    tick();
    expect(location.pathname).toBe('/auth/login');
  }));

  it('should allow access to checkout when authenticated', fakeAsync(() => {
    authService.isAuthenticated.and.returnValue(true);
    router.navigate(['/checkout']);
    tick();
    expect(location.pathname).toBe('/checkout');
  }));

  it('should allow access to cart without authentication', fakeAsync(() => {
    router.navigate(['/cart']);
    tick();
    expect(location.pathname).toBe('/cart');
  }));
});
