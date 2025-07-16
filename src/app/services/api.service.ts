import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8082/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Generic HTTP methods
  get(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${endpoint}`, { 
      headers: this.getHeaders() 
    });
  }

  post(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${endpoint}`, data, { 
      headers: this.getHeaders() 
    });
  }

  put(endpoint: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}${endpoint}`, data, { 
      headers: this.getHeaders() 
    });
  }

  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}${endpoint}`, { 
      headers: this.getHeaders() 
    });
  }

  // Product APIs
  getProducts(page: number = 0, size: number = 10, category?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (category && category !== 'all') {
      params = params.set('category', category);
    }
    
    return this.http.get(`${this.baseUrl}/products`, { 
      headers: this.getHeaders(), 
      params 
    });
  }

  // Fetch all products without pagination
  getAllProducts(category?: string): Observable<any> {
    let params = new HttpParams();
    if (category && category !== 'all') {
      params = params.set('category', category);
    }
    return this.http.get(`${this.baseUrl}/products`, {
      headers: this.getHeaders(),
      params
    });
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/products/${id}`, { 
      headers: this.getHeaders() 
    });
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/products`, product, { 
      headers: this.getHeaders() 
    });
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/products/${id}`, product, { 
      headers: this.getHeaders() 
    });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/products/${id}`, { 
      headers: this.getHeaders() 
    });
  }

  // Order APIs
  getOrders(page: number = 0, size: number = 10, status?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (status && status !== 'all') {
      params = params.set('status', status);
    }
    
    return this.http.get(`${this.baseUrl}/orders`, { 
      headers: this.getHeaders(), 
      params 
    });
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/${id}`, { 
      headers: this.getHeaders() 
    });
  }

  createOrder(order: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders`, order, { 
      headers: this.getHeaders() 
    });
  }

  updateOrder(id: number, order: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${id}`, order, { 
      headers: this.getHeaders() 
    });
  }

  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${id}`, { status }, { 
      headers: this.getHeaders() 
    });
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/orders/${id}`, { 
      headers: this.getHeaders() 
    });
  }

  // Fetch all orders without pagination
  getAllOrders(status?: string): Observable<any> {
    let params = new HttpParams();
    if (status && status !== 'all') {
      params = params.set('status', status);
    }
    return this.http.get(`${this.baseUrl}/orders`, {
      headers: this.getHeaders(),
      params
    });
  }

  getOrdersByCustomerId(customerId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/customer/${customerId}`, {
      headers: this.getHeaders()
    });
  }

  // Customer APIs
  getCustomers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/customers`, { 
      headers: this.getHeaders() 
    });
  }

  getCustomerById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/customers/${id}`, { 
      headers: this.getHeaders() 
    });
  }

  createCustomer(customer: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/customers`, customer, { 
      headers: this.getHeaders() 
    });
  }

  updateCustomer(id: number, customer: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/customers/${id}`, customer, { 
      headers: this.getHeaders() 
    });
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/customers/${id}`, { 
      headers: this.getHeaders() 
    });
  }

  // Feedback APIs
  getFeedbacks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/feedbacks`, { 
      headers: this.getHeaders() 
    });
  }

  getFeedbackById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/feedbacks/${id}`, { 
      headers: this.getHeaders() 
    });
  }

  submitFeedback(feedback: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/feedbacks`, feedback, { 
      headers: this.getHeaders() 
    });
  }

  updateFeedback(id: number, feedback: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/feedbacks/${id}`, feedback, { 
      headers: this.getHeaders() 
    });
  }

  deleteFeedback(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/feedbacks/${id}`, { 
      headers: this.getHeaders() 
    });
  }

  // Order Item APIs
  getOrderItems(): Observable<any> {
    return this.http.get(`${this.baseUrl}/order-items`, { headers: this.getHeaders() });
  }

  createOrderItem(orderItem: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/order-items`, orderItem, { headers: this.getHeaders() });
  }

  updateOrderItem(id: number, orderItem: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/order-items/${id}`, orderItem, { headers: this.getHeaders() });
  }

  deleteOrderItem(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/order-items/${id}`, { headers: this.getHeaders() });
  }

  // Delivery APIs
  getDeliveries(): Observable<any> {
    return this.http.get(`${this.baseUrl}/deliveries`, { headers: this.getHeaders() });
  }

  getDeliveriesByCustomer(customerId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/deliveries/customer/${customerId}`, { headers: this.getHeaders() });
  }

  createDelivery(delivery: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/deliveries`, delivery, { headers: this.getHeaders() });
  }

  // Cart APIs using OrderItem
  addCartItem(customerId: number, productId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/order-items/cart/add?customerId=${customerId}&productId=${productId}&quantity=${quantity}`, {}, { headers: this.getHeaders() });
  }

  getCartItemsByCustomer(customerId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/order-items/cart/${customerId}`, { headers: this.getHeaders() });
  }

  getDeliveryByOrderId(orderId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/deliveries/order/${orderId}`, { headers: this.getHeaders() });
  }
} 