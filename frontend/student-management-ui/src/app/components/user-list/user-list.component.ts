/**
 * UserListComponent
 *
 * This component displays a list of users and provides functionality for CRUD operations (Create, Read, Update, Delete).
 * It integrates with the UserService to fetch, create, update, and delete users, and utilizes Angular Material for UI elements.
 */

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioButton } from '@angular/material/radio';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  styleUrls: ['./user-list.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatRadioButton
  ]
})
export class UserListComponent implements OnInit, AfterViewInit {
  
  // Array of user objects fetched from the API
  users: any[] = [];

  // Role of the currently logged-in user
  role: string = '';

  // Controlls visibility of the create user form
  showCreateForm: boolean = false;

  // Controlls visibility of the edit user form
  showEditForm: boolean = false;

  // Indicates whether data is currently being loaded
  isLoading: boolean = false;

  // Object to hold new user data
  newUser = { username: '', password: '', role: 'USER' };

  // Object to hold edited user data
  userToEdit: any = { id: null, username: '', password: '', role: 'USER' };

  // Data source for table displaying users
  dataSource = new MatTableDataSource<any>([]);

  // Columns displayed in the user table
  displayedColumns: string[] = ['username', 'role', 'actions'];

  // Pagination for the user table
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  // Runs after the component initializes
  ngOnInit(): void {
    this.role = this.authService.getUserRole(); // Sets user role
    this.fetchUsers(); // Fetches users

    // Sets up filter predicate for the table
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchTerm = filter.trim().toLowerCase();
      return (
        data.username.toLowerCase().includes(searchTerm) ||
        data.role.toLowerCase().includes(searchTerm)
      );
    };
  }

  // Runs after the component's view initializes
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Sets up the data source paginaor
  }

  // Fetches the list of users from the API 
  fetchUsers() {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.dataSource.data = this.users; // Update data source
        this.isLoading = false;
      },
      error: (error) => {
        alert('Error fetching users: ' + error.message);
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
    });
  }

  // Filters the user table based on input
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  // Deletes a user after confirming the actiom
  deleteUser(id: number) {
    if (this.role !== 'ADMIN') {
      alert('You do not have permission to delete users!');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          alert('User deleted successfully!');
          this.fetchUsers();
        },
        error: (error) => {
          alert('Error deleting user: ' + error.message);
        },
      });
    }
  }

  // Creates a new user after validating the input data
  createUser() {
    if (this.role !== 'ADMIN') {
      alert('You do not have permission to create users!');
      return;
    }

    if (!this.newUser.username.trim() || this.newUser.username.length < 3) {
      alert('Username must be at least 3 characters long.');
      return;
    }
  
    if (!this.newUser.password.trim() || this.newUser.password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }    

    if (!this.newUser.role) {
      alert('Please select a role.');
      return;
    }

    if (!this.validateUser(this.newUser)) return;

    const usernameExists = this.users.some(
      (user) => user.username.toLowerCase() === this.newUser.username.trim().toLowerCase()
    );
  
    if (usernameExists) {
      alert('Username already exists. Please choose another username.');
      return;
    }

    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        alert('User created successfully!');
        this.fetchUsers();
        this.showCreateForm = false;

        // Clear the form
        this.newUser = { username: '', password: '', role: 'USER' };
      },
      error: (error) => {
        alert('Error creating user: ' + error.message);
      },
    });
  }

  // Prepares the user data for editing and displays the edit form
  editUser(user: any) {
    if (this.role !== 'ADMIN') {
      alert('You do not have permission to edit users!');
      return;
    }

    this.userToEdit = { ...user };
    this.showEditForm = true;
  }

  // Updates an existing user after validating the input data
  updateUser() {
    if (this.role !== 'ADMIN') {
      alert('You do not have permission to update users!');
      return;
    }

    const trimmedUsername = this.userToEdit.username?.trim();
    const trimmedPassword = this.userToEdit.password?.trim();

    if (!trimmedUsername || trimmedUsername.length < 3) {
      alert('Error in updating User. Please fill the form correctly.');
      return;
    }

    if (!trimmedPassword || trimmedPassword.length < 6) {
      alert('Error in updating User. Please fill the form correctly.');
      return;
    }

    // Checks if username is already used by another user
    const usernameExists = this.users.some(
    (user) =>
      user.username.toLowerCase() === trimmedUsername.toLowerCase() &&
      user.id !== this.userToEdit.id // Exception of current user from checking
    );

    if (usernameExists) {
      alert('Username already exists. Please choose another username.');
      return;
    }

    this.userService.updateUser(this.userToEdit.id, {
      ...this.userToEdit,
      username: trimmedUsername,
      password: trimmedPassword,
    }).subscribe({
      next: () => {
        alert('User updated successfully!');
        this.fetchUsers();
        this.showEditForm = false;

        this.userToEdit = { id: null, username: '', password: '', role: 'USER' };
      },
      error: (error) => {
        alert('Error updating user: ' + error.message);
      },
    });
  }

  // Validates a user object before submission
  validateUser(user: any): boolean {
    const trimmedUsername = user.username?.trim();
    const trimmedPassword = user.password?.trim();

    if (!trimmedUsername || trimmedUsername.length === 0) {
      alert('Error in creating User. Please fill the form correctly.');
      return false;
    }

    if (!trimmedPassword || trimmedPassword.length < 6) {
      alert('Error in creating User. Please fill the form correctly.');
      return false;
    }

    return true;
  }

  // Navigate back to the dashboard
  returnToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
