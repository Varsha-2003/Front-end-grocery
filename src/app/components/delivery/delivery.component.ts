import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

interface OrderItem {
  orderItemId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Delivery {
  deliveryId: number;
  deliveryPartnerName: string;
  status: string;
  estimatedDeliveryTime: string;
  deliveryAddress: string;
  totalCost: number;
  order?: { orderItems?: OrderItem[] };
}

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  deliveries: Delivery[] = [];
  cartItems: OrderItem[] = [];
  cartTotal: number = 0;
  customerId: number = 0;
  isLoading: boolean = true;
  error: string = '';
  showDeliveryForm: boolean = false;
  deliveryForm: any = {
    deliveryAddress: '',
    totalCost: 0,
    deliveryPartnerName: 'GrocBee Delivery',
    status: 'PENDING',
    estimatedDeliveryTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        this.customerId = user.customerId || user.id;
      } else {
        this.customerId = Number(localStorage.getItem('customerId'));
      }
    }
    if (!this.customerId || this.customerId === 0 || isNaN(this.customerId)) {
      this.error = 'User not found. Please log in again.';
      this.isLoading = false;
      return;
    }
    this.fetchCartItems();
    this.fetchCustomerDeliveries();
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
        this.calculateCartTotal();
        this.updateDeliveryFormCost();
      },
      error: (err: any) => {
        this.cartItems = [];
        this.calculateCartTotal();
        this.updateDeliveryFormCost();
      }
    });
  }

  fetchCustomerDeliveries(): void {
    console.log('Fetching deliveries for customerId:', this.customerId);
    this.apiService.getDeliveriesByCustomer(this.customerId).subscribe({
      next: (data: any) => {
        console.log('Deliveries response:', data);
        this.deliveries = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to load deliveries:', err);
        this.error = 'Failed to load deliveries.';
        this.isLoading = false;
      }
    });
  }

  calculateCartTotal(): void {
    this.cartTotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  updateDeliveryFormCost(): void {
    this.deliveryForm.totalCost = this.cartTotal;
  }

  goToFeedback(): void {
    this.router.navigate(['/feedback']);
  }

  toggleDeliveryForm(): void {
    this.showDeliveryForm = !this.showDeliveryForm;
    if (!this.showDeliveryForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.deliveryForm = {
      deliveryAddress: '',
      totalCost: this.cartTotal,
      deliveryPartnerName: 'GrocBee Delivery',
      status: 'PENDING',
      estimatedDeliveryTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }

  createDelivery(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        this.customerId = user.customerId || user.id;
      } else {
        this.customerId = Number(localStorage.getItem('customerId'));
      }
      if (!this.customerId || this.customerId === 0 || isNaN(this.customerId)) {
        this.error = 'User not found. Please log in again.';
        return;
      }
    }
    if (!this.deliveryForm.deliveryAddress.trim()) {
      this.error = 'Please enter a delivery address.';
      return;
    }
    if (this.cartItems.length === 0) {
      this.error = 'Your cart is empty. Please add items to cart first.';
      return;
    }
    this.isLoading = true;
    this.error = '';
    // 1. Prepare order payload with correct customerId
    const orderPayload = {
      orderDate: new Date().toISOString(),
      totalAmount: this.cartTotal,
      paymentMethod: 'Cash',
      status: 'Placed',
      customer: { customerId: this.customerId }
      // orderItems: [] // removed to avoid backend error
    };
    console.log('Order creation payload:', orderPayload);
    this.apiService.createOrder(orderPayload).subscribe({
      next: (order: any) => {
        // 2. Prepare delivery payload with correct orderId
        const deliveryPayload = {
          ...this.deliveryForm,
          totalCost: this.cartTotal,
          order: { orderId: order.orderId }
        };
        console.log('Delivery creation payload:', deliveryPayload);
        this.apiService.createDelivery(deliveryPayload).subscribe({
          next: (response: any) => {
            this.showDeliveryForm = false;
            this.resetForm();
            this.isLoading = false;
            this.fetchCustomerDeliveries(); // Refresh list
          },
          error: (err: any) => {
            this.error = 'Failed to create delivery. Please try again.';
            this.isLoading = false;
          }
        });
      },
      error: (err: any) => {
        this.error = 'Failed to create order. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
