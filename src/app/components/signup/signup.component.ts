import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  constructor(private router: Router) { }

  onSignup(): void {
    // Clear previous messages
    this.success = '';
    this.error = '';

    // Basic validation
    if (!this.user.fullName || !this.user.email || !this.user.phone || !this.user.password || !this.user.address) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (this.user.password.length < 6) {
      this.error = 'Password must be at least 6 characters long';
      return;
    }

    // In real app, you'd send this to the backend
    // Save user to localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push({
      fullName: this.user.fullName,
      email: this.user.email,
      phone: this.user.phone,
      password: this.user.password,
      address: this.user.address
    });
    localStorage.setItem('users', JSON.stringify(users));
    this.success = 'Signup successful! Welcome to GrocBee! Redirecting to login...';
    
    // Clear form
    this.user = {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      address: ''
    };

    // Redirect to login after 2 seconds
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}
