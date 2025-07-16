import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

interface ProductRef {
  productId: number;
  productName?: string;
  imageUrl?: string;
  description?: string;
}

interface OrderItem {
  quantity: number;
  price: number;
  product: ProductRef;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total: number = 0;
  customerId: number = 0;
  paymentMethod: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        this.customerId = user.customerId;
      } else {
        this.customerId = Number(localStorage.getItem('customerId'));
      }
    }
    this.fetchCartItems();
  }

  fetchCartItems(): void {
    this.apiService.getCartItemsByCustomer(this.customerId).subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.cartItems = response;
        } else if (response && Array.isArray(response.content)) {
          this.cartItems = response.content;
        } else {
          this.cartItems = [];
        }
        this.calculateTotal();
      },
      error: (err: any) => {
        this.error = 'Failed to load cart items.';
        this.cartItems = [];
      }
    });
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  updateQuantity(item: any, change: number): void {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      const updatedItem = { ...item, quantity: newQuantity };
      this.apiService.updateOrderItem(item.orderItemId, updatedItem).subscribe({
        next: () => {
          item.quantity = newQuantity;
          this.calculateTotal();
        },
        error: () => {
          this.error = 'Failed to update quantity.';
        }
      });
    } else {
      this.removeItem(item);
    }
  }

  removeItem(item: any): void {
    this.apiService.deleteOrderItem(item.orderItemId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(cartItem => cartItem.orderItemId !== item.orderItemId);
        this.calculateTotal();
      },
      error: () => {
        this.error = 'Failed to remove item.';
      }
    });
  }

  clearCart(): void {
    // Remove all items one by one (could be optimized with a backend batch endpoint)
    const deleteObservables = this.cartItems.map(item => this.apiService.deleteOrderItem(item.orderItemId));
    Promise.all(deleteObservables.map(obs => obs.toPromise())).then(() => {
      this.cartItems = [];
      this.calculateTotal();
    }).catch(() => {
      this.error = 'Failed to clear cart.';
    });
  }

  get cartCount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  checkout(): void {
    // Implement checkout logic as needed
    alert('Checkout not implemented in backend cart integration demo.');
  }

  proceedToDelivery(): void {
    this.router.navigate(['/delivery']);
  }
}
