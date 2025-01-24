# Student and User Management System

This is a **Full Stack** application for managing users and students. Users can register, log in, and perform data management operations based on their roles (**USER** or **ADMIN**).

---

## Features

1. **User Roles**:
   - **USER**: Can only view Users and Students lists.
   - **ADMIN**: Can view and manage all Users and Students.

2. **Search Filters**:
   - **Users and Students Lists**: Search functionality is available to filter the lists by specific criteria (e.g., username, name, or other attributes).

3. **Pagination**:
   - **Users and Students Lists**: Paginated views to handle large datasets efficiently, allowing users to navigate through the data in smaller, manageable chunks.

---

## Technologies Used

- **Backend**: Java Spring Boot
- **Frontend**: Angular
- **Database**: MySQL (created using MySQL Workbench)

---

## Installation Guide

### 1. Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Update the database configuration:
   - Open the file `src/main/resources/application.properties`.
   - Modify the following:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/student_management
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     ```

3. Build the `.jar` file:
   ```bash
   mvn clean package
   ```

4. Start the backend server:
   ```bash
   java -jar target/student-management-0.0.1-SNAPSHOT.jar
   ```

5. The backend API will be available at `http://localhost:8080`.

---

### 2. Frontend

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the Angular development server:
   ```bash
   ng serve
   ```

4. The frontend application will be available at `http://localhost:4200`.

---

## Application Testing

1. Ensure both the backend and frontend servers are running.

2. Open your browser and navigate to:
   - **Frontend**: `http://localhost:4200`
   - **Backend**: `http://localhost:8080`

---

## Contact

- **Email**: pascualexs3@aueb.gr
- **GitHub**: [alexchatzis3](https://github.com/alexchatzis3)

