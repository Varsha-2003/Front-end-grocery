import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
  brand: string;
  image: string;
  description: string;
  discount: number;
  minStock: number;
  maxStock: number;
  hidden: boolean;
}

@Component({
  selector: 'app-products-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-panel.component.html',
  styleUrls: ['./products-panel.component.css']
})
export class ProductsPanelComponent {
  products: Product[] = [
    {id: 1, name: 'Organic Apples', price: 120, quantity: 30, category: 'Fruits', brand: 'FreshFarm', image: '', description: 'Fresh organic apples.', discount: 0, minStock: 10, maxStock: 100, hidden: false},
    {id: 2, name: 'Milk 1L', price: 55, quantity: 50, category: 'Dairy', brand: 'DairyBest', image: '', description: 'Pure cow milk.', discount: 5, minStock: 20, maxStock: 200, hidden: false}
  ];
  productIdCounter = 3;

  showAddForm = false;
  showEditForm = false;
  editProduct: Product | null = null;

  // Add Product form model
  newProduct: Product = {
    id: 0,
    name: '',
    price: 0,
    quantity: 0,
    category: '',
    brand: '',
    image: '',
    description: '',
    discount: 0,
    minStock: 0,
    maxStock: 0,
    hidden: false
  };

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    this.showEditForm = false;
    this.resetNewProduct();
  }

  addProduct() {
    const prod = { ...this.newProduct, id: this.productIdCounter++ };
    this.products.push(prod);
    this.toggleAddForm();
  }

  edit(prod: Product) {
    this.editProduct = { ...prod };
    this.showEditForm = true;
    this.showAddForm = false;
  }

  updateProduct() {
    if (!this.editProduct) return;
    const idx = this.products.findIndex(p => p.id === this.editProduct!.id);
    if (idx > -1) {
      this.products[idx] = { ...this.editProduct };
    }
    this.showEditForm = false;
    this.editProduct = null;
  }

  deleteProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
  }

  hideProduct(id: number) {
    const prod = this.products.find(p => p.id === id);
    if (prod) prod.hidden = true;
  }

  unhideProduct(id: number) {
    const prod = this.products.find(p => p.id === id);
    if (prod) prod.hidden = false;
  }

  resetNewProduct() {
    this.newProduct = {
      id: 0,
      name: '',
      price: 0,
      quantity: 0,
      category: '',
      brand: '',
      image: '',
      description: '',
      discount: 0,
      minStock: 0,
      maxStock: 0,
      hidden: false
    };
  }
} 