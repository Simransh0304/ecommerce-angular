import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs';
import {
  categoriesData,
  Product,
  ProductFilters,
  ProductService,
} from '../../../core/services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  filterForm: FormGroup;
  products$!: Observable<Product[]>;

   categories$: Observable<categoriesData[]>;
   filteredProducts$: Observable<Product[]> = this.products$;
   filteredProducts: Product[] = []; // Store paginated data
allProducts: Product[] = []; // Full list of products
currentPage: number = 1;
itemsPerPage: number = 12;
totalItems: number = 0; // Store total items count

  

  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      title: [''],
      category: [''],
      minPrice: [''],
      maxPrice: [''],
      sort: [''],
    });

    this.categories$ = this.productService.getCategories();
    console.log(this.categories$);

  
  }

  ngOnInit(): void {
    // Subscribe to form changes and update products with sorting
    this.products$ = this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((filters: ProductFilters) =>
        this.productService.getProducts({
          ...filters,
          page: this.currentPage,
          limit: this.itemsPerPage,
        })
      )
    );

    // Initial products load
    this.products$ = this.productService.getProducts();
    this.applyFilters(); 
    this.filteredProducts$.subscribe(products => {
      this.allProducts = products;
      this.totalItems = this.allProducts.length; // Update total items count
      this.updatePagination();
    });
  }

  applyFilters(): void {
    const { category, title, minPrice, maxPrice } = this.filterForm.value;
  
    this.filteredProducts$ = this.products$.pipe(
      map(products =>
        products.filter(product =>
          
          (!category || Object.values(product.category)[1].toLowerCase() === category.toLowerCase()) &&
          (!title || product.title.toLowerCase().includes(title.toLowerCase())) &&
          (!minPrice || product.price >= minPrice) &&
          (!maxPrice || product.price <= maxPrice)
        )
      )
    );
  
  }
  

  resetFilters(): void {
    this.filterForm.reset({ category: '', title: '', minPrice: '', maxPrice: '' });
    this.applyFilters();
  }
  getCategoryNames(categories: any): string {
    if (!categories) return ''; // Handle null/undefined
  
    // If `categories` is an object, convert it to an array
    const categoryArray = Array.isArray(categories) ? categories : Object.values(categories);
  
    return  categoryArray[1];
    console.log(categoryArray);
  }
  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredProducts = this.allProducts.slice(start, end);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }
  

}
