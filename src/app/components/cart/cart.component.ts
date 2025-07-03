import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
  cartItems: OrderItem[] = [];
  total: number = 0;
  paymentMethod: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData);
      console.log('Loaded cart items:', this.cartItems);
      this.calculateTotal();
    }
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  updateQuantity(item: OrderItem, change: number): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      item.quantity = newQuantity;
    } else {
      this.removeItem(item);
      return;
    }
    this.saveCart();
    this.calculateTotal();
  }

  removeItem(item: OrderItem): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const index = this.cartItems.findIndex(cartItem => cartItem.product.productId === item.product.productId);
    if (index > -1) {
      this.cartItems.splice(index, 1);
      this.saveCart();
      this.calculateTotal();
    }
  }

  saveCart(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  clearCart(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.cartItems = [];
    localStorage.removeItem('cart');
    this.calculateTotal();
  }

  get cartCount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  checkout(): void {
    console.log('Checkout clicked, cartItems:', this.cartItems);
    if (this.cartItems.length > 0) {
      // Prepare orderItems for backend
      const orderItems = this.cartItems.map(item => ({
        quantity: item.quantity,
        price: item.price,
        product: { productId: item.product.productId }
      }));
      // Prepare order request (for backend integration)
      const orderRequest = {
        // customerId: ... (get from logged-in user)
        orderDate: new Date().toISOString(),
        totalAmount: this.total,
        paymentMethod: this.paymentMethod,
        status: 'Placed',
        orderItems: orderItems
      };
      // For now, just save to localStorage as before
      if (isPlatformBrowser(this.platformId)) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderRequest);
        localStorage.setItem('orders', JSON.stringify(orders));
        localStorage.setItem('orderDetails', JSON.stringify(orderRequest));
      }
      this.router.navigate(['/delivery']);
    } else {
      alert('Your cart is empty!');
    }
  }
}
