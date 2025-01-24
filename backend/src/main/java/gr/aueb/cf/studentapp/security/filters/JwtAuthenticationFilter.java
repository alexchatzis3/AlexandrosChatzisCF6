package gr.aueb.cf.studentapp.security.filters;

import gr.aueb.cf.studentapp.security.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Filter for handling JWT authentication.
 */
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    /**
     * Constructs a JwtAuthenticationFilter with the required dependencies.
     *
     * @param authenticationManager the authentication manager for user authentication.
     * @param jwtUtil utility for generating and validating JWT tokens.
     */
    public JwtAuthenticationFilter(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Attempts to authenticate a user based on the provided credentials.
     *
     * @param request the HTTP request containing the authentication credentials.
     * @param response the HTTP response.
     * @return an Authentication object if successful.
     * @throws AuthenticationException if authentication fails.
     */
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(username, password);

        return authenticationManager.authenticate(authenticationToken);
    }

    /**
     * Handles successful authentication by generating a JWT token and adding it to the response.
     *
     * @param request the HTTP request.
     * @param response the HTTP response.
     * @param chain the filter chain.
     * @param authResult the result of successful authentication.
     * @throws IOException if an input or output exception occurs.
     * @throws ServletException if a servlet-specific error occurs.
     */
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authResult) throws IOException, ServletException {

        User user = (User) authResult.getPrincipal();

        // Retrieve the role from the granted authorities
        String role = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(authority -> authority.replace("ROLE_", "")) // Remove the prefix
                .findFirst()
                .orElse("USER"); // Default role in case of an error

        // Generate a JWT token with the role
        String token = jwtUtil.generateToken(user.getUsername(), role);

        // Add the token to the response in JSON format
        Map<String, String> tokenResponse = new HashMap<>();
        tokenResponse.put("token", "Bearer " + token);

        response.setContentType("application/json");
        new com.fasterxml.jackson.databind.ObjectMapper().writeValue(response.getOutputStream(), tokenResponse);
    }

    /**
     * Handles unsuccessful authentication by sending an error response.
     *
     * @param request the HTTP request.
     * @param response the HTTP response.
     * @param failed the exception thrown during authentication.
     * @throws IOException if an input or output exception occurs.
     * @throws ServletException if a servlet-specific error occurs.
     */
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                              AuthenticationException failed) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Authentication failed: " + failed.getMessage());

        response.setContentType("application/json");
        new com.fasterxml.jackson.databind.ObjectMapper().writeValue(response.getOutputStream(), errorResponse);
    }
}
