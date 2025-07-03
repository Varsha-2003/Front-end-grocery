import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orders: Order[] = [
    {
      orderId: 101,
      orderDate: '2024-06-30T10:30:00Z',
      totalAmount: 350,
      paymentMethod: 'UPI',
      status: 'Delivered',
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
    },
    {
      orderId: 102,
      orderDate: '2024-06-28T15:45:00Z',
      totalAmount: 200,
      paymentMethod: 'Cash',
      status: 'Placed',
      customer: {
        customerId: 1,
        fullName: 'Varsha Sharma',
        email: 'varsha@example.com',
        phone: '9999999999',
        address: '123 Main St, City'
      },
      orderItems: [
        { orderItemId: 3, productName: 'Cheese', quantity: 1, price: 120 },
        { orderItemId: 4, productName: 'Carrot', quantity: 2, price: 80 }
      ]
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Logic to fetch and display orders can be added here
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }
}
