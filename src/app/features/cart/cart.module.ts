import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { inject } from '@angular/core';

// Auth guard function
const authGuard = () => {
  const authService = inject(AuthService);
  return authService.isAuthenticated() ? true : ['/auth/login'];
};

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./cart-list/cart-list.component').then(m => m.CartListComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [() => authGuard()]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartModule { }
