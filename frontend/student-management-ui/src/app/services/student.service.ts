/**
 * StudentService
 *
 * This service provides methods to interact with the student API for CRUD operations.
 * It ensures that requests include authorization headers by using the AuthService.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  /**
   * API endpoint for student-related operations
   */
  private apiUrl = 'http://localhost:8080/api/students';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Generates HTTP headers with the authorization token. 
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // GET Method, Get all students
  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // POST Method, Create new student
  createStudent(studentData: any): Observable<any> {
    return this.http.post(this.apiUrl, studentData, { headers: this.getAuthHeaders() });
  }

  // DELETE Method, Delete student using id
  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // PUT Method, Update student by id
  updateStudent(id: number, studentData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, studentData, { headers: this.getAuthHeaders() });
  }
}
