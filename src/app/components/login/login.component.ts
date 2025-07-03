import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  constructor(private router: Router) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    this.error = '';
    this.success = '';
    const email = this.email.trim();
    const password = this.password;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (user) {
      localStorage.removeItem('grocbee_admin_logged_in');
      this.success = 'Login successful! Redirecting...';
      setTimeout(() => {
        this.router.navigate(['/products']);
      }, 800);
    } else {
      this.error = 'Invalid email or password.';
    }
  }
}
