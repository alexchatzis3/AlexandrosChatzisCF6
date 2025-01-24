/**
 * RegisterComponent
 *
 * This component handles user registration functionality.
 * It provides a form for users to input their details, validates inputs, 
 * and interacts with the UserService to create new users.
 */

import { Component } from '@angular/core';
import { UserService } from '../../services/user.service'; // Service to interact with user data
import { FormsModule } from '@angular/forms'; // For template-driven forms
import { Router } from '@angular/router'; 
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule, 
    RouterModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatRadioModule
  ]
})
export class RegisterComponent {
  // Object to hold new user details from the form
  newUser = {
    username: '',
    password: '',
    role: ''
  };

  constructor(private userService: UserService, private router: Router) {} 

  /**
   * Method to handle the creation of a new user
   */
  createUser() {
    // Validate that the username is at least 3 characters long
    if (!this.newUser.username || this.newUser.username.trim().length < 3) {
      alert('Username must be at least 3 characters long.');
      return;
    }

    // Validate that the password is at least 6 characters long
    if (!this.newUser.password || this.newUser.password.trim().length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    // Check if the username already exists
    this.userService.getUsers().subscribe({
      next: (users) => {
        // Check if the username already exists in the list of users
        const usernameExists = users.some(
          (user: any) => user.username.toLowerCase() === this.newUser.username.trim().toLowerCase()
        );

        if (usernameExists) {
          // Alert user that the username is already taken
          alert('Username already exists. Please choose another username.');
        } else {
          // If the username is unique, proceed to create the user
          this.userService.createUser(this.newUser).subscribe({
            next: () => {
              alert('User created successfully!');
              this.router.navigate(['/login']); // Navigate to login page
            },
            error: () => alert('Error creating user') // Handle error during user creation
          });
        }
      },
      error: () => alert('Error. Unable to fetch user list.') // Handle error during user list retrieval
    });
  }

  /**
   * Method to navigate the user back to the home page
   */
  goToHome() {
    this.router.navigate(['/']); 
  }
}
