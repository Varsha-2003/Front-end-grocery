import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface OrderDetails {
  orderDate: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  orderItems: OrderItem[];
}

interface Customer {
  customerId: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
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

interface Delivery {
  deliveryId: number;
  deliveryPartnerName: string;
  status: string;
  estimatedDeliveryTime: string;
  order: Order;
}

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  deliveryDetails = {
    address: '',
    city: '',
    pincode: '',
    phone: '',
    name: ''
  };

  orderDetails: OrderDetails | null = null;
  isLoading: boolean = true;

  delivery: Delivery | null = {
    deliveryId: 501,
    deliveryPartnerName: 'Swiggy Genie',
    status: 'Assigned',
    estimatedDeliveryTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    order: {
      orderId: 101,
      orderDate: new Date().toISOString(),
      totalAmount: 350,
      paymentMethod: 'UPI',
      status: 'Placed',
      customer: {
        customerId: 1,
        fullName: 'Varsha Sharma',
        email: 'varsha@example.com',
        phone: '9999999999',
        address: '123 Main St, City'
      },
      orderItems: [
        { orderItemId: 1, productName: 'Apple', quantity: 2, price: 120 },
        { orderItemId: 2, productName: 'Milk', quantity: 1, price: 50 }
      ]
    }
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrderDetails();
  }

  loadOrderDetails(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const orderData = localStorage.getItem('orderDetails');
    if (orderData) {
      this.orderDetails = JSON.parse(orderData);
    } else {
      // If no order details, redirect back to cart
      this.router.navigate(['/cart']);
      return;
    }
    
    this.isLoading = false;
  }

  confirmDelivery(): void {
    if (!this.deliveryDetails.name || !this.deliveryDetails.address || 
        !this.deliveryDetails.city || !this.deliveryDetails.pincode || 
        !this.deliveryDetails.phone) {
      alert('Please fill in all delivery details');
      return;
    }

    // Save delivery details
    if (isPlatformBrowser(this.platformId)) {
      const completeOrder = {
        ...this.orderDetails,
        deliveryDetails: this.deliveryDetails,
        deliveryConfirmed: true,
        deliveryDate: new Date().toISOString()
      };
      
      localStorage.setItem('completeOrder', JSON.stringify(completeOrder));
      
      // Clear cart after successful delivery confirmation
      localStorage.removeItem('cart');
      localStorage.removeItem('orderDetails');
    }

    console.log('Delivery confirmed:', this.deliveryDetails);
    
    // Navigate to feedback page
    this.router.navigate(['/feedback']);
  }

  goBackToCart(): void {
    this.router.navigate(['/cart']);
  }
}
