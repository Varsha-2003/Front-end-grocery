import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../services/admin-api.service';

interface OrderAdminDto {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  deliveryDate?: string;
  deliveryCost?: number;
}

@Component({
  selector: 'app-orders-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-panel.component.html',
  styleUrls: ['./orders-panel.component.css']
})
export class OrdersPanelComponent implements OnInit {
  orders: OrderAdminDto[] = [];
  statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  error = '';
  showEditModal = false;
  editedOrder: any = null;

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.adminApi.getOrders().subscribe({
      next: (res) => {
        this.orders = res.content ? res.content : res;
      },
      error: () => {
        this.error = 'Failed to load orders';
      }
    });
  }

  updateOrderStatus(id: number, status: string) {
    const o = this.orders.find(x => x.orderId === id);
    if (o) o.status = status;
  }

  deleteOrder(id: number) {
    if (confirm('Delete this order?')) {
      this.adminApi.deleteOrder(id).subscribe({
        next: () => this.fetchOrders(),
        error: () => this.error = 'Failed to delete order'
      });
    }
  }

  editOrder(order: OrderAdminDto) {
    this.editedOrder = { ...order };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editedOrder = null;
  }

  saveEditOrder() {
    if (!this.editedOrder) return;
    // Map delivery fields to order fields for backend compatibility
    this.editedOrder.orderDate = this.editedOrder.deliveryDate;
    this.editedOrder.totalAmount = this.editedOrder.deliveryCost;
    this.adminApi.editOrder(this.editedOrder.orderId, this.editedOrder).subscribe({
      next: (updated: OrderAdminDto) => {
        const idx = this.orders.findIndex(o => o.orderId === updated.orderId);
        if (idx !== -1) this.orders[idx] = updated;
        this.closeEditModal();
      },
      error: () => {
        this.error = 'Failed to update order';
      }
    });
  }
} 