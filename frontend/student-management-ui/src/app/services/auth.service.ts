/**
 * AuthService
 * 
 * This service handles user authentication, including login, token management, and user role management.
 * It interacts with the backend API for login and stores authentication-related information in localStorage.
*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
  * API endpoint for login requests
  */
  private apiUrl = 'http://localhost:8080/api/login';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { username, password });
  }

  // Saving and decoding token 
  setToken(token: string): void {
    localStorage.setItem('token', token);
    const tokenPayload = this.decodeToken(token);
    console.log('Token Payload:', tokenPayload); 

    if (tokenPayload && tokenPayload.sub) {
        localStorage.setItem('username', tokenPayload.sub);
        
        // Save role from token payload
        if (tokenPayload.role) {
            localStorage.setItem('role', tokenPayload.role);
        } else if (tokenPayload.roles && Array.isArray(tokenPayload.roles)) {
            localStorage.setItem('role', tokenPayload.roles[0]);  
        } else {
            console.error('Role not found in token payload');
        }
    } else {
        console.error('Invalid token payload received');
    }
  }


  // Retrieves the stored JWT token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Retrieves username from localStorage
  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  // Retrieves user's role from localStorage
  getUserRole(): string {
    return localStorage.getItem('role') || '';
  }

  // Logs out the user by clearing localStorage
  // Then navigates to the login page
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // JWT
  private decodeToken(token: string): any {
    try {
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        return JSON.parse(decodedPayload);
    } catch (e) {
        console.error('Error decoding JWT token:', e);
        return null;
    }
}


  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
