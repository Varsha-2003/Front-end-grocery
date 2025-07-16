import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit, OnDestroy {
  username: string = '';
  password: string = '';
  error: string = '';
  success: string = '';

  constructor(
    private router: Router, 
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.add('admin-login-bg');
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('admin-login-bg');
    }
  }

  login() {
    this.error = '';
    this.success = '';
    
    if (!this.username || !this.password) {
      this.error = 'Please enter both username and password';
      return;
    }

    this.authService.loginAdmin(this.username, this.password).subscribe({
      next: (response: any) => {
        this.success = 'Login successful! Redirecting to dashboard...';
        // Store admin user data
        this.authService.setAdminUser(response);
        setTimeout(() => {
          this.router.navigate(['/admin-dashboard']);
        }, 1200);
      },
      error: (error) => {
        console.error('Admin login error:', error);
        if (error.status === 401) {
          this.error = 'Invalid username or password';
        } else if (error.status === 403) {
          this.error = 'Access denied. Admin privileges required.';
        } else {
          this.error = 'Login failed. Please try again.';
        }
      }
    });
  }
}
