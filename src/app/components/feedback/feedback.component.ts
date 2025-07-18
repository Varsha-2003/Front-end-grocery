import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface CompleteOrder {
  items: any[];
  subtotal: number;
  delivery: number;
  total: number;
  orderDate: string;
  deliveryDetails: any;
  deliveryConfirmed: boolean;
  deliveryDate: string;
}

interface CustomerRef {
  customerId: number;
  fullName?: string;
}

interface ProductRef {
  productId: number;
  productName?: string;
}

interface Feedback {
  feedbackId?: number;
  rating: number;
  comments: string;
  customer: CustomerRef;
  product: ProductRef;
}

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  feedbackText: string = '';
  rating: number = 5;
  completeOrder: CompleteOrder | null = null;
  isLoading: boolean = true;
  feedbackSubmitted: boolean = false;
  error: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadOrderDetails();
  }

  loadOrderDetails(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const orderData = localStorage.getItem('completeOrder');
    if (orderData) {
      this.completeOrder = JSON.parse(orderData);
    } else {
      // If no complete order, just allow feedback (no redirect)
      this.completeOrder = null;
    }
    
    this.isLoading = false;
  }

  submitFeedback(): void {
    if (!this.feedbackText.trim()) {
      alert('Please enter your feedback');
      return;
    }

    // Prepare feedback object for backend
    const feedback: Feedback = {
      rating: this.rating,
      comments: this.feedbackText,
      customer: {
        customerId: 1, // Replace with actual logged-in user/customerId
        fullName: this.completeOrder?.deliveryDetails?.name || 'Demo User'
      },
      product: {
        productId: 1, // Replace with actual productId if feedback is for a specific product
        productName: 'Demo Product'
      }
    };

    // Send feedback to backend
    this.apiService.submitFeedback(feedback).subscribe({
      next: () => {
        this.feedbackSubmitted = true;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Failed to submit feedback. Please try again.';
        this.feedbackSubmitted = false;
      }
    });
  }

  goToHome(): void {
    // Clear the complete order from localStorage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('completeOrder');
    }
    this.router.navigate(['/']);
  }

  goToProducts(): void {
    // Clear the complete order from localStorage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('completeOrder');
    }
    this.router.navigate(['/products']);
  }
}
