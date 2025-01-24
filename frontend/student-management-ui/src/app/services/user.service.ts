/**
 * UserService
 *
 * This service provides methods to interact with the user API for CRUD operations.
 * It uses the AuthService to include authentication headers for secure requests.
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /**
   * API endpoint for user-related operations
   */
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Generates HTTP headers with the authorization token. 
  private getAuthHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // GET Method, Get all users
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // POST Method, Create new user
  createUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData); 
  }


  // DELETE Method, Delete user using id
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // PUT Method, Update user by id
  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, userData, { headers: this.getAuthHeaders() });
  }
}
