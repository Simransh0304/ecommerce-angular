import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.module')
      .then(m => m.ProductsModule),
    title: 'Products - E-Shop'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes')
      .then(m => m.routes),
    title: 'Authentication - E-Shop'
  },
  {
    path: 'cart',
    loadChildren: () => import('./features/cart/cart.module')
      .then(m => m.CartModule),
    title: 'Cart - E-Shop'
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/cart/checkout/checkout.component')
      .then(m => m.CheckoutComponent),
    canActivate: [authGuard],
    title: 'Checkout - E-Shop'
  },
  {
    path: '**',
    redirectTo: 'products'
  }
];
