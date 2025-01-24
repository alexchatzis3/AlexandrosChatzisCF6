package gr.aueb.cf.studentapp.exceptions;

/**
 * Exception thrown when a student is not found in the database.
 * This exception includes a specific error code.
 */
public class StudentNotFoundException extends AppGenericException {

    private static final String DEFAULT_CODE = "STUDENT_NOT_FOUND";

    /**
     * Constructs a new StudentNotFoundException with a default error code and message.
     *
     * @param message a detailed message describing the error.
     */
    public StudentNotFoundException(String message) {
        super(DEFAULT_CODE, message);
    }

    /**
     * Constructs a new StudentNotFoundException with a custom error code and message.
     *
     * @param code    a unique code representing the specific type of exception.
     * @param message a detailed message describing the error.
     */
    public StudentNotFoundException(String code, String message) {
        super(code, message);
    }
}
