import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartSubject.next(JSON.parse(storedCart));
    }
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
    this.cartSubject.next(items);
  }

  addToCart(product: Product, quantity: number = 1, variant?: { size?: string; color?: string }): void {
    const currentItems = this.cartSubject.value;
    const existingItemIndex = currentItems.findIndex(
      item => item.product.id === product.id &&
      JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (existingItemIndex > -1) {
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += quantity;
      this.saveCart(updatedItems);
    } else {
      this.saveCart([...currentItems, { product, quantity, variant }]);
    }
  }

  removeFromCart(product: Product, variant?: { size?: string; color?: string }): void {
    const currentItems = this.cartSubject.value;
    const updatedItems = currentItems.filter(
      item => item.product.id !== product.id ||
      JSON.stringify(item.variant) !== JSON.stringify(variant)
    );
    this.saveCart(updatedItems);
  }

  updateQuantity(product: Product, quantity: number, variant?: { size?: string; color?: string }): void {
    if (quantity <= 0) {
      this.removeFromCart(product, variant);
      return;
    }

    const currentItems = this.cartSubject.value;
    const updatedItems = currentItems.map(item => {
      if (item.product.id === product.id &&
          JSON.stringify(item.variant) === JSON.stringify(variant)) {
        return { ...item, quantity };
      }
      return item;
    });
    this.saveCart(updatedItems);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getTotal(): Observable<number> {
    return new Observable(subscriber => {
      this.cart$.subscribe(items => {
        const total = items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
        subscriber.next(total);
      });
    });
  }

  getItemCount(): Observable<number> {
    return new Observable(subscriber => {
      this.cart$.subscribe(items => {
        const count = items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        subscriber.next(count);
      });
    });
  }
}
