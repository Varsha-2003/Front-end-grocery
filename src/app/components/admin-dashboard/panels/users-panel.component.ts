import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../services/admin-api.service';

interface Customer {
  customerId: number;
  fullName: string;
  email: string;
  address: string;
  phone: string;
}

@Component({
  selector: 'app-users-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-panel.component.html',
  styleUrls: ['./users-panel.component.css']
})
export class UsersPanelComponent implements OnInit {
  customers: Customer[] = [];
  loading = true;
  error = '';
  editingCustomerId: number | null = null;
  editedCustomer: Customer | null = null;

  constructor(private adminApi: AdminApiService) {}

  ngOnInit() {
    console.log('UsersPanelComponent ngOnInit called');
    this.adminApi.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.loading = false;
      },
      error: (err) => {
        if (err.message && err.message.includes('No auth token')) {
          this.error = 'You are not logged in. Please log in to view customers.';
        } else {
          this.error = 'Failed to load customers';
        }
        this.loading = false;
      }
    });
  }

  startEdit(customer: Customer) {
    this.editingCustomerId = customer.customerId;
    this.editedCustomer = { ...customer };
  }

  cancelEdit() {
    this.editingCustomerId = null;
    this.editedCustomer = null;
  }

  saveEdit() {
    if (this.editedCustomer) {
      this.adminApi.editCustomer(this.editedCustomer.customerId, this.editedCustomer).subscribe({
        next: (updated) => {
          const idx = this.customers.findIndex(c => c.customerId === updated.customerId);
          if (idx !== -1) this.customers[idx] = updated;
          this.cancelEdit();
        },
        error: () => {
          this.error = 'Failed to update customer';
        }
      });
    }
  }

  deleteCustomer(customer: Customer) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.adminApi.deleteCustomer(customer.customerId).subscribe({
        next: () => {
          this.customers = this.customers.filter(c => c.customerId !== customer.customerId);
        },
        error: () => {
          this.error = 'Failed to delete customer';
        }
      });
    }
  }
} 