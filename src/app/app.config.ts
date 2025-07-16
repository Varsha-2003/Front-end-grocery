import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

const routes = [
  { path: '', loadComponent: () => import('./components/index/index.component').then(m => m.IndexComponent) },
  { path: 'products', loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent) },
  { path: 'order', loadComponent: () => import('./components/order/order.component').then(m => m.OrderComponent) },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent) },
  { path: 'feedback', loadComponent: () => import('./components/feedback/feedback.component').then(m => m.FeedbackComponent) },
  { path: 'delivery', loadComponent: () => import('./components/delivery/delivery.component').then(m => m.DeliveryComponent) },
  { path: 'cart', loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent) },
  { path: 'admin-login', loadComponent: () => import('./components/admin-login/admin-login.component').then(m => m.AdminLoginComponent) },
  { path: 'admin-dashboard', loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: 'about', loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent) },
  { path: '**', redirectTo: '' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations()
  ]
}; 