package gr.aueb.cf.studentapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * The main class to launch the Student Management Application.
 * This is a Spring Boot application that starts the Student Management system.
 * It initializes the Spring Boot application context and allows for further configurations
 * such as setting up controllers, services and repositories for managing student data.
 *
 * @author Alexandros Chatzis
 * @version 1.0
 */
@SpringBootApplication
public class StudentManagementApplication {

    /**
     * The main method which serves as the entry point to the application.
     * This method triggers the start of the Spring Boot application by calling the
     * SpringApplication.run() method, which bootstraps the application and starts
     * the embedded web server.
     *
     * @param args Command line arguments passed to the application (unused).
     */
    public static void main(String[] args) {
        SpringApplication.run(StudentManagementApplication.class, args);
    }
}
