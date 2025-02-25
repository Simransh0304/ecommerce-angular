import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import { CartService, AuthService } from './core';
import { LoadingSpinnerComponent } from './shared';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LoadingSpinnerComponent],
  template: `
    <app-loading-spinner></app-loading-spinner>

    <header class="main-header">
      <nav class="nav-container">
        <a routerLink="/" class="logo">E-Shop</a>
        <ul class="nav-links">
          <li><a routerLink="/products" routerLinkActive="active">Products</a></li>
          <li>
            <a routerLink="/cart" routerLinkActive="active" class="cart-link">
              Cart
              <span class="cart-count" *ngIf="cartItemCount$ | async as count">
                {{ count }}
              </span>
            </a>
          </li>
          <li *ngIf="!(isAuthenticated$ | async)">
            <a routerLink="/auth/login" routerLinkActive="active">Login</a>
          </li>
          <li *ngIf="isAuthenticated$ | async">
            <button class="logout-btn" (click)="logout()">Logout</button>
          </li>
        </ul>
      </nav>
    </header>

    <main class="main-content">
      <router-outlet></router-outlet>
    </main>

    <footer class="main-footer">
      <p>&copy; 2025 E-Shop. All rights reserved.</p>
    </footer>
  `,
  styles: [`
    .main-header {
      background: #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-links a {
      color: #333;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .nav-links a:hover, .nav-links a.active {
      color: #007bff;
    }

    .cart-link {
      position: relative;
    }

    .cart-count {
      position: absolute;
      top: -8px;
      right: -12px;
      background: #007bff;
      color: white;
      border-radius: 50%;
      padding: 2px 6px;
      font-size: 0.75rem;
    }

    .logout-btn {
      background: none;
      border: none;
      padding: 0;
      color: #333;
      font-weight: 500;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .logout-btn:hover {
      color: #007bff;
    }

    .main-content {
      max-width: 1200px;
      margin: 80px auto 2rem;
      padding: 0 1rem;
      min-height: calc(100vh - 160px);
    }

    .main-footer {
      background: #f8f9fa;
      padding: 1rem;
      text-align: center;
      color: #666;
    }

    @media (max-width: 768px) {
      .nav-links {
        gap: 1rem;
      }
    }
  `]
})
export class AppComponent {
  cartItemCount$;
  isAuthenticated$;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {
    this.cartItemCount$ = this.cartService.getItemCount();
    this.isAuthenticated$ = this.authService.currentUser$.pipe(
      map((user: any) => !!user)
    );
  }

  logout(): void {
    this.authService.logout();
  }
}
