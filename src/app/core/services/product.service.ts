import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  images: string[];

}
export interface categoriesData {
  id: number;
  name: string;
  images: string;
}



export interface ProductFilters {
  category?: string;
  title?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(
    private http: HttpClient,
    private apollo: Apollo
  ) {}

  getProducts(filters: ProductFilters = {}): Observable<Product[]> {
    let params = new HttpParams();

    if (filters.category) {
      params = params.set('category', filters.category);
    }
    if (filters.title) {
      params = params.set('title', filters.title);
    }
    if (filters.minPrice) {
      params = params.set('price_min', filters.minPrice.toString());
    }
    if (filters.maxPrice) {
      params = params.set('price_max', filters.maxPrice.toString());
    }
    if (filters.page) {
      params = params.set('offset', ((filters.page - 1) * (filters.limit || 10)).toString());
    }
    if (filters.limit) {
      params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // getCategories(): Observable<string[]> {
  //   return this.http.get<string[]>(`${environment.apiUrl}/categories`);
  // }
  getCategories(): Observable<categoriesData[]> {
    return this.http.get<categoriesData[]>(`${environment.apiUrl}/categories`);
  }
  
  
  
  
}
