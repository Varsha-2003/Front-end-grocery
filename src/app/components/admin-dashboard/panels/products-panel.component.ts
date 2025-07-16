import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../services/admin-api.service';
import { AuthService } from '../../../services/auth.service';

interface Product {
  productId: number;
  productName: string;
  category: string;
  brand: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  active: boolean;
}

@Component({
  selector: 'app-products-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-panel.component.html',
  styleUrls: ['./products-panel.component.css']
})
export class ProductsPanelComponent {
  products: Product[] = [];
  loading = true;
  error = '';

  showEditForm = false;
  editProduct: Product | null = null;

  constructor(private adminApi: AdminApiService, private authService: AuthService) {
    console.log('ProductsPanelComponent loaded');
    this.fetchProducts();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  fetchProducts() {
    this.loading = true;
    this.adminApi.getProducts({ page: 0, size: 100 }).subscribe({
      next: (res) => {
        this.products = res.content ? res.content : res;
        console.log('Fetched products:', this.products);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  // Remove newProduct object, showAddForm, toggleAddForm, resetNewProduct, addProduct, and related code

  // Toggle product visibility (active/inactive)
  toggleProductActive(product: Product) {
    this.loading = true;
    this.adminApi.setProductActiveStatus(product.productId, !product.active).subscribe({
      next: (updated: Product) => {
        product.active = updated.active;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to update product visibility';
        this.loading = false;
      }
    });
  }

  edit(prod: Product) {
    this.editProduct = { ...prod };
    this.showEditForm = true;
  }

  updateProduct() {
    if (!this.editProduct) return;
    this.adminApi.editProduct(this.editProduct.productId, this.editProduct).subscribe({
      next: () => {
        this.showEditForm = false;
        this.editProduct = null;
        this.fetchProducts();
      },
      error: () => {
        this.error = 'Failed to update product';
      }
    });
  }
} 