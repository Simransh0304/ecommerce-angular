import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { User } from '../../../core/services/auth.service';
import { CartItem, CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-cart-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  total$: Observable<number>;
  isAuthenticated$: Observable<boolean>;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {
    this.cartItems$ = this.cartService.cart$;
    this.total$ = this.cartService.getTotal();
    this.isAuthenticated$ = this.authService.currentUser$.pipe(
      map((user: User | null) => !!user)
    );
  }

  ngOnInit(): void {}

  updateQuantity(item: CartItem, quantity: number): void {
    this.cartService.updateQuantity(item.product, quantity, item.variant);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.product, item.variant);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  getVariantText(item: CartItem): string {
    if (!item.variant) return '';

    const parts = [];
    if (item.variant.size) parts.push(`Size: ${item.variant.size}`);
    if (item.variant.color) parts.push(`Color: ${item.variant.color}`);

    return parts.join(', ');
  }
}
