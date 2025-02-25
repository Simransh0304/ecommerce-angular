import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CartItem, CartService } from '../../../core/services/cart.service';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems$: Observable<CartItem[]>;
  total$: Observable<number>;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService
  ) {
    this.cartItems$ = this.cartService.cart$;
    this.total$ = this.cartService.getTotal();

    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?1?\d{9,15}$/)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      this.submitting = true;
      // Here you would typically call a service to process the order
      this.cartItems$.subscribe(items => {
        console.log('Order submitted:', {
          shippingInfo: this.checkoutForm.value,
          items
        });

        // For demo purposes, we'll just clear the cart and show success
        setTimeout(() => {
          this.cartService.clearCart();
          // Navigate to success page or show success message
          this.submitting = false;
        }, 1500);
      });

    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.checkoutForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return `${controlName} is required`;
    if (control.errors['minlength']) {
      const minLength = control.errors['minlength'].requiredLength;
      return `${controlName} must be at least ${minLength} characters`;
    }
    if (control.errors['email']) return 'Invalid email format';
    if (control.errors['pattern']) {
      if (controlName === 'zipCode') return 'Invalid ZIP code format';
      if (controlName === 'phone') return 'Invalid phone number format';
    }

    return '';
  }

  formatControlName(name: string): string {
    return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }
}
