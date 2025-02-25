import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, switchMap } from 'rxjs';
import { Product, ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product$!: Observable<Product>;
  variantForm: FormGroup;
  selectedImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private fb: FormBuilder
  ) {
    this.variantForm = this.fb.group({
      size: ['medium', Validators.required],
      color: ['black', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.product$ = this.route.params.pipe(
      switchMap(params => this.productService.getProduct(+params['id']))
    );
  }

  setMainImage(image: string): void {
    this.selectedImage = image;
  }

  addToCart(product: Product): void {
    if (this.variantForm.valid) {
      const variant = {
        size: this.variantForm.get('size')?.value,
        color: this.variantForm.get('color')?.value
      };
      const quantity = this.variantForm.get('quantity')?.value || 1;

      this.cartService.addToCart(product, quantity, variant);
    }
  }
}
