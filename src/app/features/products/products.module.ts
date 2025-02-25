import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsModule { }
