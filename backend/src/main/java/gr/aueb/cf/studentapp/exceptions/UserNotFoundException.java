package gr.aueb.cf.studentapp.exceptions;

/**
 * Custom exception class to handle user not found scenarios.
 */
public class UserNotFoundException extends Exception {

    public UserNotFoundException(String message) {
        super(message);
    }
}
