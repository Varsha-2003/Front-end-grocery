import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  customerId?: number;
  fullName?: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  customername: string;
  email: string;
  password: string;
  adress: string;
  phonenumber?: number;
}

export interface AuthResponse {
  token: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8082/api';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      this.getUserFromStorage()
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private getUserFromStorage(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  login(loginRequest: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, loginRequest);
  }

  signup(signupRequest: SignupRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/signup`, signupRequest);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('authToken');
    }
    return false;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  private decodeToken(token: string): User {
    try {
      // Simple JWT decode (you should use a proper JWT library in production)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        customerId: payload.customerId || 0,
        fullName: payload.fullName || '',
        email: payload.sub || payload.email || '',
        phone: payload.phone || '',
        address: payload.address || ''
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return {
        email: 'unknown'
      };
    }
  }

  // Method to refresh user data from backend
  refreshUserData(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/auth/me`);
  }

  loginAdmin(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/admin/login`, { email: username, password });
  }

  // Store admin user data
  setAdminUser(adminData: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('authToken', adminData.token);
      localStorage.setItem('adminUser', JSON.stringify({
        userId: adminData.userId,
        username: adminData.username,
        roles: adminData.roles
      }));
    }
  }

  // Get admin user from storage
  getAdminUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const adminStr = localStorage.getItem('adminUser');
      return adminStr ? JSON.parse(adminStr) : null;
    }
    return null;
  }

  // Check if current user is admin
  isAdmin(): boolean {
    const adminUser = this.getAdminUser();
    return adminUser && adminUser.roles && (
      adminUser.roles.includes('ROLE_ADMIN') || adminUser.roles.includes('ADMIN')
    );
  }

  // Admin logout
  adminLogout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminUser');
    }
  }
} 