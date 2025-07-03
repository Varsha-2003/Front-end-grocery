import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule],
  template: `<div class='admin-cart-modal' *ngIf="show" style="display:flex;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.3);z-index:9999;justify-content:center;align-items:center;">
    <div style="background:#fff;padding:2em 1.5em;border-radius:1em;min-width:340px;max-width:98vw;box-shadow:0 4px 32px #0002;position:relative;">
      <button (click)="close.emit()" style="position:absolute;top:1em;right:1em;background:none;border:none;font-size:1.3em;cursor:pointer;">&times;</button>
      <h2 style="margin-top:0;">Cart</h2>
      <div id="adminCartItems">
        <p style="text-align:center;color:#888;font-size:1.1em;margin:2em 0;">Your cart is empty.</p>
      </div>
      <div style="margin:1em 0 0.5em 0;">
        <label>Delivery Date: <input type="date" id="adminCartDeliveryDate" required></label>
      </div>
      <div style="margin:1em 0 0.5em 0;">
        <label>Payment Method:
          <select id="adminCartPaymentMethod" required>
            <option value="">Select</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>
        </label>
      </div>
      <div style="font-weight:600;margin-bottom:1em;">Total: ₹<span id="adminCartTotal">0</span></div>
      <button id="adminPlaceOrderBtn" class="cta-btn" style="width:100%;background:linear-gradient(90deg,#4CAF50 60%,#FFA500 100%);color:#fff;border:none;border-radius:2em;padding:1em 2.5em;font-size:1.1em;font-weight:600;box-shadow:0 2px 8px #4caf5033;transition:background 0.2s,transform 0.2s;cursor:pointer;outline:none;">
        Place Order
      </button>
    </div>
  </div>`,
  styleUrls: ['./cart-modal.component.css']
})
export class CartModalComponent {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();
} 