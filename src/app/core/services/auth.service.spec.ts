import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, User, LoginCredentials } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let jwtHelper: jasmine.SpyObj<JwtHelperService>;

  beforeEach(() => {
    jwtHelper = jasmine.createSpyObj('JwtHelperService', ['isTokenExpired']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: JwtHelperService, useValue: jwtHelper }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    const mockCredentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      token: 'mock-token'
    };

    it('should store user data and emit currentUser on successful login', () => {
      service.login(mockCredentials).subscribe(user => {
        expect(user).toEqual(mockUser);
        expect(localStorage.getItem(environment.authConfig.tokenName))
          .toBe(JSON.stringify(mockUser));
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${environment.authConfig.apiPath}/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockUser);
    });

    it('should handle login error', () => {
      const errorMessage = 'Invalid credentials';

      service.login(mockCredentials).subscribe({
        error: error => {
          expect(error.error).toBe(errorMessage);
          expect(localStorage.getItem(environment.authConfig.tokenName)).toBeNull();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${environment.authConfig.apiPath}/login`);
      req.flush({ message: errorMessage }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('isAuthenticated', () => {
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      token: 'mock-token'
    };

    it('should return true for valid token', async () => {
      localStorage.setItem(environment.authConfig.tokenName, JSON.stringify(mockUser));
      jwtHelper.isTokenExpired.and.returnValue(Promise.resolve(false));

      const isAuth = await firstValueFrom(service.isAuthenticated());
      expect(isAuth).toBe(true);
    });

    it('should return false for expired token', async () => {
      localStorage.setItem(environment.authConfig.tokenName, JSON.stringify(mockUser));
      jwtHelper.isTokenExpired.and.returnValue(Promise.resolve(true));

      const isAuth = await firstValueFrom(service.isAuthenticated());
      expect(isAuth).toBe(false);
    });

    it('should return false when no user is stored', async () => {
      const isAuth = await firstValueFrom(service.isAuthenticated());
      expect(isAuth).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear stored user data and emit null', () => {
      const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        token: 'mock-token'
      };

      localStorage.setItem(environment.authConfig.tokenName, JSON.stringify(mockUser));

      service.logout();

      expect(localStorage.getItem(environment.authConfig.tokenName)).toBeNull();
      service.currentUser$.subscribe(user => {
        expect(user).toBeNull();
      });
    });
  });
});
