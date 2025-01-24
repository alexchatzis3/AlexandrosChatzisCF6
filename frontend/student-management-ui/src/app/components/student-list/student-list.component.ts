/**
 * StudentListComponent
 *
 * This component displays a list of students and provides functionality for CRUD operations (Create, Read, Update, Delete).
 * It uses MatTable for displaying data with pagination and filtering features.
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';


@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  standalone: true,
  styleUrls: ['./student-list.component.css'],
  imports: [
    CommonModule, 
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule
    ]
})
export class StudentListComponent implements OnInit {

  // Array of student objects fetched from the API
  students: any[] = [];

  // Role of current user
  role: string = '';

  // Boolean to control the visibility of the create student form
  showCreateForm: boolean = false;

  // Boolean to control the visibility of the edit student form
  showEditForm: boolean = false;

  // Object to hold new student data
  newStudent = { firstname: '', lastname: '', email: '' };

  // Object to hold data of the edited student
  studentToEdit = { id: 0 as number | null, firstname: '', lastname: '', email: '' };

  // Data source for the table displaying students
  dataSource = new MatTableDataSource<any>([]);

  // Columns displayed in the student table
  displayedColumns: string[] = ['firstname', 'lastname', 'email', 'actions'];

  // Pagination for the student table
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private studentService: StudentService, 
    private authService: AuthService, 
    private router: Router
  ) {}

  // Runs after the component initializes
  ngOnInit(): void {
    this.role = this.authService.getUserRole(); // sets user role
    this.fetchStudents(); // fetches students
  }

  // Runs after the component's view initializes
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Sets up the data source paginator
  }

  // Fetches the list of students from the API and updates the data source
  fetchStudents() {
    this.studentService.getStudents().subscribe({
        next: (students) =>{
          this.students = students;
          this.dataSource.data = students;
        },
        error: (error) => {
            alert('Unauthorized: ' + error.message);
            this.router.navigate(['/login']);
        }
    });
  }

  // Applies a filter to the table based on the input value
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Deletes a student by id after confirming the action
  deleteStudent(id: number) {
    if (this.role !== 'ADMIN') {
      alert('You do not have permission to delete students!');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this student?');


    if (confirmDelete) {
      // If user chooses 'Yes', user is deleted.
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          alert('Student deleted successfully!');
          this.fetchStudents(); // Updates users' list.
        },
        error: (error) => {
          alert('Error deleting student: ' + error.message);
        }
      });
    } else {
      // If user chooses "No", returns back to users' list.
      this.router.navigate(['/student-list']);
    }
  }

  // Creates a new student after validating the input data
  createStudent() {
    if (
      this.newStudent.firstname.trim().length < 2 ||
      this.newStudent.lastname.trim().length < 2 ||
      !this.isValidEmail(this.newStudent.email)
    ) {
      alert('Please fill out the form correctly before submitting.');
      return;
    }
  
    this.studentService.createStudent(this.newStudent).subscribe({
      next: () => {
        alert('Student created successfully!');
        this.fetchStudents();
        this.showCreateForm = false;
        this.newStudent = { firstname: '', lastname: '', email: '' };
      },
      error: (error) => {
        if (error.status === 409) {
          alert('A student with this email already exists!');
        } else {
          alert('Error creating student: ' + error.message);
        }
      },
    });
  }

  // Prepares the student data for editing and displays the edit form
  editStudent(student: any) {
    console.log('Editing student:', student);
    if (this.role !== 'ADMIN') {
      alert('You do not have permission to edit students!');
      return;
    }
    this.showEditForm = true;
    this.studentToEdit = {
      id: student.id ?? null,  
      firstname: student.firstname,
      lastname: student.lastname,
      email: student.email
  };
  }

  // Updates an existing student after validating the input data
  updateStudent() {
    console.log('Updating student with data:', this.studentToEdit);

    if (!this.studentToEdit.id) {
      alert('Invalid student ID!');
      return;
    }

    if (this.role !== 'ADMIN') {
      alert('You do not have permission to update students!');
      return;
    }

    if (!this.isFormValid(this.studentToEdit)) {
      alert('Please fill all fields correctly.');
      return;
    }

    this.studentService.updateStudent(this.studentToEdit.id, this.studentToEdit).subscribe({
      next: () => {
        alert('Student updated successfully!');
        this.fetchStudents();
        this.showEditForm = false;
        this.resetEditStudentForm();
      },
      error: (error) => {
        if (error.status === 409) {
          alert('A student with this email already exists!');
        } else {
          alert('Error updating student: ' + error.message);
        }
      },
    });
  }

  // Validates if the provided email is in a correct format
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z]+[a-zA-Z0-9._]*@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // Validates if the form fields are correctly filled
  isFormValid(student: any): boolean {
    return student.firstname.trim().length >= 2 &&
           student.lastname.trim().length >= 2 &&
           this.isValidEmail(student.email);
  }
  

  // Resets the create student form to its initial state
  resetNewStudentForm() {
    this.newStudent = { firstname: '', lastname: '', email: '' };
  }

  // Resets the edit student form to its inital state
  resetEditStudentForm() {
    this.studentToEdit = { id: null, firstname: '', lastname: '', email: '' };
  }

  // Navigates the user back to the dashboard
  returnToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}  