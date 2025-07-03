import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

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

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

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
    if (this.username === 'admin' && this.password === 'admin') {
      this.success = 'Login successful! Redirecting to dashboard...';
      setTimeout(() => {
        this.router.navigate(['/admin-dashboard']);
      }, 1200);
    } else {
      this.error = 'Invalid credentials';
    }
  }
}
