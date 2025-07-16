import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private baseUrl = 'http://localhost:8082/api';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getAuthHeaders() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found. Please log in.');
      }
      return {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      };
    }
    // Return empty headers if not in browser
    return {};
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users`, this.getAuthHeaders());
  }

  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/customers`, this.getAuthHeaders());
  }

  editCustomer(id: number, customer: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/customers/${id}`, customer, this.getAuthHeaders());
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/customers/${id}`, this.getAuthHeaders());
  }

  // Product management
  addProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/products`, product, this.getAuthHeaders());
  }

  getProducts(params: any = {}): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/products/all`, { ...this.getAuthHeaders(), params });
  }

  editProduct(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/products/${id}`, product, this.getAuthHeaders());
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/products/${id}`, this.getAuthHeaders());
  }

  setProductActiveStatus(id: number, active: boolean): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/products/${id}/active?active=${active}`, {}, this.getAuthHeaders());
  }

  // Order management
  getOrders(params: any = {}): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/orders/admin`, { ...this.getAuthHeaders(), params });
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/orders/${id}`, this.getAuthHeaders());
  }

  editOrder(id: number, order: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/orders/${id}`, order, this.getAuthHeaders());
  }

  getCustomerCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/customers/count`, this.getAuthHeaders());
  }

  getProductCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/products/count`, this.getAuthHeaders());
  }

  getOrderCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/orders/count`, this.getAuthHeaders());
  }
} 