import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  img: string;
}

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  cartItemCount: number = 0;

  products: Product[] = [
    { id: 1, name: 'Apple', category: 'Fruits', price: 60, img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&w=400&h=300&fit=crop' },
    { id: 2, name: 'Banana', category: 'Fruits', price: 30, img: 'https://images.pexels.com/photos/461208/pexels-photo-461208.jpeg?auto=compress&w=400&h=300&fit=crop' },
    { id: 3, name: 'Carrot', category: 'Vegetables', price: 40, img: 'https://images.pexels.com/photos/65174/pexels-photo-65174.jpeg?auto=compress&w=400&h=300&fit=crop' },
    { id: 4, name: 'Broccoli', category: 'Vegetables', price: 80, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5HI921PGF_R6Kqm0ESAHt9BT9snCb1lghkQ&s' },
    { id: 5, name: 'Milk', category: 'Dairy', price: 50, img: 'https://images.pexels.com/photos/416656/pexels-photo-416656.jpeg?auto=compress&w=400&h=300&fit=crop' },
    { id: 6, name: 'Cheese', category: 'Dairy', price: 120, img: 'https://media.istockphoto.com/id/531009927/photo/sliced-cheese.jpg?s=612x612&w=0&k=20&c=jtxTsTpAClDJkJ9UpAOrYyUxHTq-8QeMOIutgFI0TzM=' },
  ];

  categories = [
    { name: 'Fruits', img: 'https://www.fruitsmith.com/pub/media/mageplaza/blog/post/e/x/exotic_fruits_you_might_not_know_about.jpg' },
    { name: 'Vegetables', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrVfrDc_91VGaV3HUPYtTVbHR-cykLYNOJ3w&s' },
    { name: 'Dairy', img: 'https://thumbs.dreamstime.com/b/farm-organic-dairy-products-milk-yogurt-cream-cottage-cheese-farm-organic-dairy-products-milk-yogurt-cream-cottage-cheese-butter-122038400.jpg' },
    { name: 'All Products', img: 'https://giftflys.com/wp-content/uploads/2023/03/Grocery-pack.jpg' },
  ];

  filteredProducts: Product[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.loadCartCount();
    this.showCategory('Fruits');
  }

  loadCartCount(): void {
    if (isPlatformBrowser(this.platformId)) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      this.cartItemCount = cart.reduce((total: number, item: any) => total + item.quantity, 0);
    }
  }

  showCategory(category: string) {
    if (category === 'All Products') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p => p.category === category);
    }
  }
}
