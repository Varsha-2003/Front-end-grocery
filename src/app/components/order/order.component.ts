import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

interface Customer {
  customerId: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

interface Product {
  productId: number;
  productName: string;
  // add other fields if needed
}

interface OrderItem {
  orderItemId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  customer: Customer;
  orderItems: OrderItem[];
}

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = false;
  error: string = '';
  selectedStatus: string = 'all';
  deliveryInfo: { [orderId: number]: any } = {}; // Store delivery info by orderId

  // Status filter options
  statusOptions = [
    { id: 'all', name: 'All Orders' },
    { id: 'Placed', name: 'Placed' },
    { id: 'Dispatched', name: 'Dispatched' },
    { id: 'Delivered', name: 'Delivered' },
    { id: 'Cancelled', name: 'Cancelled' }
  ];

  constructor(
    private router: Router,
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.loading = true;
    this.error = '';
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
      this.error = 'User not found.';
      this.loading = false;
      return;
    }
    this.apiService.getOrdersByCustomerId(customerId).subscribe({
      next: (response) => {
        this.orders = response || [];
        this.loading = false;
        // Fetch delivery info for each order
        this.orders.forEach(order => {
          this.apiService.getDeliveryByOrderId(order.orderId).subscribe({
            next: (delivery) => {
              this.deliveryInfo[order.orderId] = delivery;
            },
            error: () => {
              this.deliveryInfo[order.orderId] = null;
            }
          });
        });
      },
      error: (err) => {
        this.error = 'Failed to load orders. Please try again.';
        this.loading = false;
        console.error('Error fetching orders:', err);
      }
    });
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.fetchOrders();
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    this.router.navigate(['/']);
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }
}
