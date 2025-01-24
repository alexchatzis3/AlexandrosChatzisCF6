package gr.aueb.cf.studentapp.controller;

import gr.aueb.cf.studentapp.model.User;
import gr.aueb.cf.studentapp.repository.UserRepository;
import gr.aueb.cf.studentapp.security.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller for handling authentication requests such as login.
 */
@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    /**
     * Constructs an AuthController with the required dependencies.
     *
     * @param authenticationManager the authentication manager for user authentication.
     * @param jwtUtil utility for generating and validating JWT tokens.
     * @param userRepository repository for accessing user data.
     */
    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    /**
     * Handles user login requests.
     *
     * @param credentials a map containing the "username" and "password" keys.
     * @return a ResponseEntity containing a JWT token if authentication is successful, or an error message otherwise.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            // Validate that both username and password are provided
            if (credentials.get("username") == null || credentials.get("password") == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username and password are required");
            }

            // Authenticate the user
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(credentials.get("username"), credentials.get("password"))
            );

            // Retrieve the user and their role from the database
            User user = userRepository.findByUsername(credentials.get("username"))
                    .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

            // Generate a JWT token with the user's role
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

            // Log the role included in the token (for debugging purposes)
            System.out.println("Role in token: " + user.getRole().name());

            return ResponseEntity.ok(Map.of("token", token));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during login");
        }
    }
}
