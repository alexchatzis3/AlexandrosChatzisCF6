/**
 * LoginComponent
 *
 * This component handles user login functionality.
 * It provides a form for users to input their credentials and interact with the AuthService to perform authentication.
 */
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true, 
  imports: [
    FormsModule, 
    CommonModule, 
    RouterModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * AuthService login method.
   * On success, the user's token is stored, and they are redirected to the dashboard.
   * On failure, an alert is displayed.
   */
  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        this.authService.setToken(response.token);
        this.router.navigate(['/dashboard']);
      },
      error: () => alert('Login Failed')
    });
  }

  // Navigates user to the home page.
  goToHome() {
    this.router.navigate(['/']); 
  }
}
