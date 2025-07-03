import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  expiry: string;
}

@Component({
  selector: 'app-inventory-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-panel.component.html',
  styleUrls: ['./inventory-panel.component.css']
})
export class InventoryPanelComponent {
  inventory: InventoryItem[] = [
    {id: 1, name: 'Organic Apples', quantity: 30, minStock: 10, maxStock: 100, expiry: '2025-07-10'},
    {id: 2, name: 'Milk 1L', quantity: 50, minStock: 20, maxStock: 200, expiry: '2025-06-25'}
  ];
  inventoryIdCounter = 3;

  showAddForm = false;
  showEditForm = false;
  editItem: InventoryItem | null = null;

  // Add Inventory form model
  newItem: InventoryItem = {
    id: 0,
    name: '',
    quantity: 0,
    minStock: 0,
    maxStock: 0,
    expiry: ''
  };

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    this.showEditForm = false;
    this.resetNewItem();
  }

  addItem() {
    const item = { ...this.newItem, id: this.inventoryIdCounter++ };
    this.inventory.push(item);
    this.toggleAddForm();
  }

  edit(item: InventoryItem) {
    this.editItem = { ...item };
    this.showEditForm = true;
    this.showAddForm = false;
  }

  updateItem() {
    if (!this.editItem) return;
    const idx = this.inventory.findIndex(i => i.id === this.editItem!.id);
    if (idx > -1) {
      this.inventory[idx] = { ...this.editItem };
    }
    this.showEditForm = false;
    this.editItem = null;
  }

  deleteItem(id: number) {
    if (confirm('Delete this inventory item?')) {
      this.inventory = this.inventory.filter(i => i.id !== id);
    }
  }

  resetNewItem() {
    this.newItem = {
      id: 0,
      name: '',
      quantity: 0,
      minStock: 0,
      maxStock: 0,
      expiry: ''
    };
  }

  dateIsNearExpiry(dateStr: string): boolean {
    const expiry = new Date(dateStr);
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return expiry < weekFromNow;
  }
} 