package gr.aueb.cf.studentapp.exceptions;

import lombok.Getter;

/**
 * A generic exception class for application-specific errors.
 * This class serves as a base for other specific exceptions in the application.
 * It includes an error code to help identify the type of error.
 */
@Getter
public class AppGenericException extends Exception {

    /**
     * A unique code representing the specific type of exception.
     */
    private final String code;

    /**
     * Constructs a new AppGenericException with the specified error code and message.
     *
     * @param code    a unique code representing the specific type of exception.
     * @param message a detailed message describing the error.
     */
    public AppGenericException(String code, String message) {
        super(message);
        this.code = code;
    }
}
