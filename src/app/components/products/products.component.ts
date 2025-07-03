import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Product {
  productId: number;
  productName: string;
  category: string;
  brand: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  unit: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: string = 'all';
  cartItemCount: number = 0;

  categories = [
    { id: 'all', name: 'All' },
    { id: 'Fruits', name: 'Fruits' },
    { id: 'Vegetables', name: 'Vegetables' },
    { id: 'Dairy', name: 'Dairy' },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.loadProducts();
    this.filteredProducts = this.products;
    this.loadCartCount();
  }

  loadProducts(): void {
    this.products = [
      {
        productId: 1,
        productName: 'Apple',
        category: 'Fruits',
        brand: 'FreshFarms',
        description: 'Crisp and juicy apples, perfect for snacking.',
        price: 60,
        stockQuantity: 100,
        imageUrl: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&w=400&h=300&fit=crop',
        unit: 'per kg'
      },
      {
        productId: 2,
        productName: 'Banana',
        category: 'Fruits',
        brand: 'TropiGold',
        description: 'Sweet bananas rich in potassium.',
        price: 30,
        stockQuantity: 120,
        imageUrl: 'https://images.pexels.com/photos/461208/pexels-photo-461208.jpeg?auto=compress&w=400&h=300&fit=crop',
        unit: 'per kg'
      },
      {
        productId: 3,
        productName: 'Carrot',
        category: 'Vegetables',
        brand: 'VeggieFresh',
        description: 'Crunchy carrots full of vitamins.',
        price: 40,
        stockQuantity: 80,
        imageUrl: 'https://images.pexels.com/photos/65174/pexels-photo-65174.jpeg?auto=compress&w=400&h=300&fit=crop',
        unit: 'per kg'
      },
      {
        productId: 4,
        productName: 'Broccoli',
        category: 'Vegetables',
        brand: 'GreenLeaf',
        description: 'Fresh broccoli, great for steaming.',
        price: 80,
        stockQuantity: 60,
        imageUrl: 'https://www.diabetescarecommunity.ca/wp-content/uploads/2018/05/Diabetes-and-broccoli.jpg',
        unit: 'per kg'
      },
      {
        productId: 5,
        productName: 'Milk',
        category: 'Dairy',
        brand: 'DairyPure',
        description: 'Pure and fresh milk for your daily needs.',
        price: 50,
        stockQuantity: 200,
        imageUrl: 'https://www.godigit.com/content/dam/godigit/directportal/en/pouring-milk-into-glass-cup.jpg',
        unit: 'per litre'
      },
      {
        productId: 6,
        productName: 'Cheese',
        category: 'Dairy',
        brand: 'CheeseLand',
        description: 'Assorted cheese for all your recipes.',
        price: 120,
        stockQuantity: 50,
        imageUrl: 'https://cdn.britannica.com/14/167214-050-3F143067/Cheese-assortment-Blue-cheese-swiss-Brie-parmesan.jpg',
        unit: 'per 500g'
      }
    ];
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'all') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product => product.category === category);
    }
  }

  addToCart(product: Product): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItem = cart.find((item: any) => item.product && item.product.productId === product.productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        quantity: 1,
        price: product.price,
        product: {
          productId: product.productId,
          productName: product.productName,
          imageUrl: product.imageUrl,
          description: product.description
        }
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    this.updateCartCount();
    alert(`${product.productName} added to cart!`);
  }

  updateCartCount(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartItemCount = cart.reduce((total: number, item: any) => total + item.quantity, 0);
  }

  loadCartCount(): void {
    this.updateCartCount();
  }
}
