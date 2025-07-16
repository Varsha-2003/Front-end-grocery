import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
    standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  success: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private apiService: ApiService
  ) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    this.error = '';
    this.success = '';
    this.isLoading = true;

    console.log('=== LOGIN DEBUG START ===');
    console.log('Email:', this.email);
    console.log('Password length:', this.password.length);

    // Basic validation
    if (!this.email.trim() || !this.password) {
      this.error = 'Please fill in all fields';
      this.isLoading = false;
      console.log('Validation failed - empty fields');
      return;
    }

    // Prepare login request
    const loginRequest = {
      email: this.email,
      password: this.password
    };

    console.log('Login request prepared:', { email: loginRequest.email, passwordLength: loginRequest.password.length });
    console.log('Making API call to backend...');

    // Call auth service
    this.authService.login(loginRequest)
      .subscribe({
        next: (response) => {
          console.log('=== LOGIN SUCCESS ===');
          console.log('Full response:', response);
          if (isPlatformBrowser(this.platformId)) {
            if (response && response.token) {
              localStorage.setItem('authToken', response.token);
            }
            if (response && response.customerId) {
              // Save the full user object as currentUser
              localStorage.setItem('currentUser', JSON.stringify({
                customerId: response.customerId,
                email: this.email,
                // Add more fields if available in response
                fullName: response.fullName || '',
              }));
              // Remove old customerId key if present
              localStorage.removeItem('customerId');
            }
          }
          this.success = 'Login successful! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 800);
        },
        error: (error) => {
          console.log('=== LOGIN ERROR ===');
          console.log('Error status:', error.status);
          console.log('Error message:', error.message);
          console.log('Error response:', error.error);
          console.log('Full error object:', error);

          if (error.status === 401) {
            if (typeof error.error === 'string') {
              this.error = error.error;
            } else if (error.error && error.error.message) {
              this.error = error.error.message;
            } else {
              this.error = 'Invalid email or password';
            }
          } else if (error.status === 0) {
            this.error = 'Cannot connect to server. Please check if backend is running.';
          } else if (error.status === 400) {
            if (typeof error.error === 'string') {
              this.error = error.error;
            } else if (error.error && error.error.message) {
              this.error = error.error.message;
            } else {
              this.error = 'Bad request. Please check your input.';
            }
          } else if (error.status === 500) {
            this.error = 'Server error. Please try again later.';
          } else {
            this.error = (typeof error.error === 'string') ? error.error : 'Login failed. Please try again.';
          }

          this.isLoading = false;
        }
      });
  }
}
