import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, SignupRequest } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user = {
    fullName: '',
    email: '',
    phone: '',
    password: '',
    address: ''
  };
  success: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  onSignup(): void {
    this.success = '';
    this.error = '';
    this.loading = true;

    // Basic validation
    if (!this.user.fullName || !this.user.email || !this.user.phone || !this.user.password || !this.user.address) {
      this.error = 'Please fill in all fields';
      this.loading = false;
      return;
    }
    if (this.user.password.length < 6) {
      this.error = 'Password must be at least 6 characters long';
      this.loading = false;
      return;
    }

    // Prepare request for backend
    const signupRequest: SignupRequest = {
      customername: this.user.fullName,
      email: this.user.email,
      password: this.user.password,
      adress: this.user.address, // spelling matches backend
      phonenumber: this.user.phone ? Number(this.user.phone) : undefined
    };

    this.authService.signup(signupRequest).subscribe({
      next: (response) => {
        this.success = (response && response.message) ? response.message : 'Signup successful! Redirecting to login...';
        this.loading = false;
        this.user = { fullName: '', email: '', phone: '', password: '', address: '' };
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        if (typeof error.error === 'string') {
          this.error = error.error;
        } else if (error.error && error.error.message) {
          this.error = error.error.message;
        } else {
          this.error = 'Signup failed. Please try again.';
        }
        this.loading = false;
      }
    });
  }
}
