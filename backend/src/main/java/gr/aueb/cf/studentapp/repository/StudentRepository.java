package gr.aueb.cf.studentapp.repository;

import gr.aueb.cf.studentapp.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository interface for interacting with the Student entity in the database.
 * This interface extends JpaRepository to provide CRUD operations and custom queries.
 */
public interface StudentRepository extends JpaRepository<Student, Long> {

    /**
     * Finds a student by their email address.
     *
     * @param email the email address of the student to search for.
     * @return an Optional containing the Student entity if found, or empty if not.
     */
    Optional<Student> findByEmail(String email);
}
