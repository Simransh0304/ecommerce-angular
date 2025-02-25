import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, map, of, lastValueFrom } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  email: string;
  name: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}${environment.authConfig.apiPath}`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem(environment.authConfig.tokenName);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.checkTokenAndSetUser(user);
    }
  }

  private async checkTokenAndSetUser(user: User | null): Promise<void> {
    if (user && user.token) {
      const isExpired = await lastValueFrom(from(Promise.resolve(this.jwtHelper.isTokenExpired(user.token))));
      if (!isExpired) {
        this.currentUserSubject.next(user);
        return;
      }
    }
    this.logout();
  }

  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials).pipe(
      map(user => {
        localStorage.setItem(environment.authConfig.tokenName, JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  register(credentials: RegisterCredentials): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, credentials);
  }

  logout(): void {
    localStorage.removeItem(environment.authConfig.tokenName);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): Observable<boolean> {
    const user = this.currentUserSubject.value;
    if (!user || !user.token) {
      return of(false);
    }

    return from(Promise.resolve(this.jwtHelper.isTokenExpired(user.token))).pipe(
      map(isExpired => !isExpired)
    );
  }

  getToken(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.token : null;
  }
}
