import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  status: 'active' | 'blocked';
}

@Component({
  selector: 'app-users-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-panel.component.html',
  styleUrls: ['./users-panel.component.css']
})
export class UsersPanelComponent {
  users: User[] = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'customer', status: 'active' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'admin', status: 'active' },
    { id: 3, name: 'Charlie Lee', email: 'charlie@example.com', role: 'customer', status: 'blocked' }
  ];
  userIdCounter = 4;

  showAddForm = false;
  showEditForm = false;
  editUser: User | null = null;

  // Add User form model
  newUser: User = {
    id: 0,
    name: '',
    email: '',
    role: 'customer',
    status: 'active'
  };

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    this.showEditForm = false;
    this.resetNewUser();
  }

  addUser() {
    const user = { ...this.newUser, id: this.userIdCounter++ };
    this.users.push(user);
    this.toggleAddForm();
  }

  edit(user: User) {
    this.editUser = { ...user };
    this.showEditForm = true;
    this.showAddForm = false;
  }

  updateUser() {
    if (!this.editUser) return;
    const idx = this.users.findIndex(u => u.id === this.editUser!.id);
    if (idx > -1) {
      this.users[idx] = { ...this.editUser };
    }
    this.showEditForm = false;
    this.editUser = null;
  }

  deleteUser(id: number) {
    if (confirm('Delete this user?')) {
      this.users = this.users.filter(u => u.id !== id);
    }
  }

  blockUser(user: User) {
    user.status = 'blocked';
  }

  unblockUser(user: User) {
    user.status = 'active';
  }

  resetNewUser() {
    this.newUser = {
      id: 0,
      name: '',
      email: '',
      role: 'customer',
      status: 'active'
    };
  }
} 