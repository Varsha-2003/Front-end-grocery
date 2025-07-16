import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

interface Product {
  productId: number;
  productName: string;
  category: string;
  brand: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  unit: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: string = 'all';
  cartItemCount: number = 0;
  loading: boolean = false;
  error: string = '';
  
  // Make Math available in template
  Math = Math;

  categories = [
    { id: 'all', name: 'All' },
    { id: 'Fruits', name: 'Fruits' },
    { id: 'Vegetables', name: 'Vegetables' },
    { id: 'Dairy', name: 'Dairy' },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private apiService: ApiService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.loading = true;
    this.error = '';
    this.apiService.getProducts(0, 100, this.selectedCategory).subscribe({
      next: (response) => {
        if (response && response.content) {
          this.products = response.content;
        } else {
          this.products = response || [];
        }
        this.filteredProducts = this.products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.fetchProducts();
  }

  addToCart(product: Product): void {
    let customerId = 0;
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        customerId = user.customerId;
      } else {
        customerId = Number(localStorage.getItem('customerId'));
      }
    }
    if (!customerId) {
      alert('User not found. Please log in again.');
      return;
    }
    this.apiService.addCartItem(customerId, product.productId, 1).subscribe({
      next: () => {
        alert(`${product.productName} added to cart!`);
        this.router.navigate(['/cart']);
      },
      error: () => {
        alert('Failed to add to cart.');
      }
    });
  }
}
