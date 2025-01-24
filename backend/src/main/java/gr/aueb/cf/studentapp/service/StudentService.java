package gr.aueb.cf.studentapp.service;

import gr.aueb.cf.studentapp.exceptions.EmailAlreadyExistsException;
import gr.aueb.cf.studentapp.exceptions.StudentNotFoundException;
import gr.aueb.cf.studentapp.model.Student;
import gr.aueb.cf.studentapp.repository.StudentRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * Service class that provides business logic for managing student data.
 * It interacts with the StudentRepository to perform CRUD operations on the database.
 */
@Service
public class StudentService {

    private final StudentRepository studentRepository;

    // Constructor-based Dependency Injection (προτιμάται για ασφάλεια και testability)
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    /**
     * Retrieves a student by their ID.
     *
     * @param id the unique identifier of the student
     * @return the student if found
     * @throws StudentNotFoundException if the student is not found
     */
    public Student getStudentById(Long id) throws StudentNotFoundException {
        return studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student with ID " + id + " not found"));
    }

    /**
     * Finds a student by their email address.
     *
     * @param email the email address of the student
     * @return the student object if found
     * @throws StudentNotFoundException if no student with the given email is found
     */
    public Student findStudentByEmail(String email) throws StudentNotFoundException {
        return studentRepository.findByEmail(email)
                .orElseThrow(() -> new StudentNotFoundException("Student with email " + email + " not found"));
    }

    /**
     * Saves a new student to the database.
     *
     * @param student the student object to be saved
     * @return the saved student object
     * @throws EmailAlreadyExistsException if the email is already taken
     */
    public Student createStudent(Student student) throws EmailAlreadyExistsException {
        if (studentRepository.findByEmail(student.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Email " + student.getEmail() + " is already in use");
        }
        return studentRepository.save(student);
    }

    /**
     * Updates an existing student in the database.
     *
     * @param student the student object to be updated
     * @return the updated student object
     * @throws StudentNotFoundException if the student with the given ID does not exist
     * @throws EmailAlreadyExistsException if the email is already taken by another student
     */
    public Student updateStudent(Long id, Student student) throws StudentNotFoundException, EmailAlreadyExistsException {
        Student existingStudent = getStudentById(id);

        if (!existingStudent.getEmail().equals(student.getEmail())) {
            if (studentRepository.findByEmail(student.getEmail()).isPresent()) {
                throw new EmailAlreadyExistsException("Email " + student.getEmail() + " is already in use");
            }
        }

        existingStudent.setFirstname(student.getFirstname());
        existingStudent.setLastname(student.getLastname());
        existingStudent.setEmail(student.getEmail());

        return studentRepository.save(existingStudent);
    }

    /**
     * Deletes a student by their ID.
     *
     * @param id the unique identifier of the student
     * @throws StudentNotFoundException if no student with the given ID is found
     */
    public void deleteStudent(Long id) throws StudentNotFoundException {
        if (!studentRepository.existsById(id)) {
            throw new StudentNotFoundException("Student with ID " + id + " not found");
        }
        studentRepository.deleteById(id);
    }

    /**
     * Retrieves all students from the database.
     *
     * @return a list of all students
     */
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
}
