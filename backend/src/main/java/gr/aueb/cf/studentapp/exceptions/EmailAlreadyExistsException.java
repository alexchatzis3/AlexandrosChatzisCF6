package gr.aueb.cf.studentapp.exceptions;

/**
 * Exception thrown when a student with the same email already exists in the database.
 * This exception includes a specific error code.
 */
public class EmailAlreadyExistsException extends AppGenericException {

    private static final String DEFAULT_CODE = "EMAIL_ALREADY_EXISTS";

    /**
     * Constructs a new EmailAlreadyExistsException with a default error code and message.
     *
     * @param message a detailed message describing the error.
     */
    public EmailAlreadyExistsException(String message) {
        super(DEFAULT_CODE, message);
    }

    /**
     * Constructs a new EmailAlreadyExistsException with a custom error code and message.
     *
     * @param code    a unique code representing the specific type of exception.
     * @param message a detailed message describing the error.
     */
    public EmailAlreadyExistsException(String code, String message) {
        super(code, message);
    }
}
