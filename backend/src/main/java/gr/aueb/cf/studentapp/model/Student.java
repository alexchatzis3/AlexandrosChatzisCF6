package gr.aueb.cf.studentapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * Entity class representing a Student in the database.
 * This class maps to the "students" table in the database and
 * defines the structure of a student record.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "students")
public class Student {

    /**
     * The unique identifier of the student. This is the primary key in the "students" table.
     * It is auto-generated by the database.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The firstname of the student.
     * This field cannot be null and has a maximum length of 50 characters.
     */
    @NotBlank(message = "First name is mandatory")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    @Column(name = "firstname", nullable = false, length = 50)
    private String firstname;

    /**
     * The lastname of the student.
     * This field cannot be null and has a maximum length of 50 characters.
     */
    @NotBlank(message = "Last name is mandatory")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    @Column(name = "lastname", nullable = false, length = 50)
    private String lastname;

    /**
     * The email address of the student. This must be unique and cannot be null.
     * The email has a maximum length of 100 characters.
     * Additionally, it must follow a specific pattern defined by the regex.
     */
    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    @Pattern(
            regexp = "^[a-zA-Z]+[a-zA-Z0-9]*@[a-zA-Z]+\\.[a-zA-Z]{2,}$",
            message = "Email must start with letters, contain numbers if needed, followed by @, letters, a dot, and domain letters"
    )
    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;
}
