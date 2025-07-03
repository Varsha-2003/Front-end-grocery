import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Order {
  id: number;
  customer: string;
  status: string;
  items: string;
  total: number;
  agent: string;
  invoice: boolean;
  deliveryDate?: string;
  paymentMethod?: string;
}

@Component({
  selector: 'app-orders-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-panel.component.html',
  styleUrls: ['./orders-panel.component.css']
})
export class OrdersPanelComponent {
  orders: Order[] = [
    {id: 101, customer: 'Jane Smith', status: 'Pending', items: 'Apples x2, Milk x1', total: 295, agent: '', invoice: false},
    {id: 102, customer: 'John Doe', status: 'Shipped', items: 'Milk x3', total: 165, agent: 'Amit', invoice: true}
  ];

  statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  updateOrderStatus(id: number, status: string) {
    const o = this.orders.find(x => x.id === id);
    if (o) o.status = status;
  }

  assignAgent(id: number, agent: string) {
    const o = this.orders.find(x => x.id === id);
    if (o) o.agent = agent;
  }

  generateInvoice(id: number) {
    const o = this.orders.find(x => x.id === id);
    if (o) { o.invoice = true; alert('Invoice generated!'); }
  }

  deleteOrder(id: number) {
    if (confirm('Delete this order?')) {
      this.orders = this.orders.filter(x => x.id !== id);
    }
  }
} 