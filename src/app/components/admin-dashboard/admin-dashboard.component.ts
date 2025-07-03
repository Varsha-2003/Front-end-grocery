import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersPanelComponent } from './panels/users-panel.component';
import { ProductsPanelComponent } from './panels/products-panel.component';
import { OrdersPanelComponent } from './panels/orders-panel.component';
import { OffersPanelComponent } from './panels/offers-panel.component';
import { CartModalComponent } from './panels/cart-modal.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    UsersPanelComponent,
    ProductsPanelComponent,
    OrdersPanelComponent,
    OffersPanelComponent,
    CartModalComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  sidebarOpen = false;
  dropdownOpen: string | null = null;
  showCartModal = false;
  currentPanel: string = 'dashboard';

  // Panel titles for navbar
  panelTitles: { [key: string]: string } = {
    dashboard: 'Dashboard Overview',
    users: 'User Management',
    addProduct: 'Add Product',
    viewProducts: 'View Products',
    orders: 'Orders',
    offers: 'Offers',
    productManagement: 'Product Management',
  };

  // New properties to fix template errors:
  totalOffers = 15; // Example number of offers
  recentActivity = [
    { message: 'New order #1234 received', time: '2 min ago' },
    { message: 'Product "Organic Apples" stock updated', time: '15 min ago' },
    { message: 'New user registration', time: '1 hour ago' },
    { message: 'Payment processed for order #1233', time: '2 hours ago' },
  ];

  // Product Management demo functionality
  productList: { name: string; price: number }[] = [];
  newProduct = { name: '', price: 0 };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Demo admin cart count
  get adminCartCount(): number {
    if (isPlatformBrowser(this.platformId)) {
      try {
      const cart = JSON.parse(localStorage.getItem('adminCart') || '[]');
      return cart.reduce((sum: number, item: any) => sum + (item.qty || 0), 0);
      } catch (error) {
        console.error('Error parsing admin cart:', error);
        return 0;
      }
    }
    return 0;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleDropdown(menu: string) {
    this.dropdownOpen = this.dropdownOpen === menu ? null : menu;
  }

  setPanel(panel: string) {
    this.currentPanel = panel;
    // Close sidebar on mobile
    this.sidebarOpen = false;
    // Keep Product Management dropdown open for its subpanels
    if (panel === 'addProduct' || panel === 'viewProducts' || panel === 'productManagement') {
      this.dropdownOpen = 'products';
    } else {
    this.dropdownOpen = null;
    }
  }

  notify() {
    // Dummy notification effect
    // In a real app, show a notification panel or toast
    alert('No new notifications. (Demo)');
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('grocbee_admin_logged_in');
      window.location.href = '/admin-login';
    }
  }

  openProductManagement() {
    this.currentPanel = 'productManagement';
    this.dropdownOpen = 'products';
  }

  openProductManagementDropdown() {
    this.currentPanel = 'productManagement';
    this.dropdownOpen = 'products';
  }

  addProductToList() {
    if (this.newProduct.name && this.newProduct.price != null) {
      this.productList.push({ ...this.newProduct });
      this.newProduct = { name: '', price: 0 };
    }
  }

  removeProductFromList(index: number) {
    this.productList.splice(index, 1);
  }
}
