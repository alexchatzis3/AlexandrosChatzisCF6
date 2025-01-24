package gr.aueb.cf.studentapp.security.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.*;

/**
 * Utility class for handling JWT operations such as generating and validating tokens.
 */
@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long expirationTime;

    /**
     * Constructor with secret and expiration time injection.
     *
     * @param secret the secret key used for signing JWT tokens.
     * @param expirationTime the token expiration time in milliseconds.
     */
    public JwtUtil(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration}") long expirationTime) {
        byte[] keyBytes = Base64.getEncoder().encode(secret.getBytes());
        if (keyBytes.length < 32) {
            throw new IllegalArgumentException("Secret key must be at least 256 bits");
        }
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationTime = expirationTime;
    }

    /**
     * Generate a new JWT token for a given username and role.
     *
     * @param username the username to be included in the token.
     * @param role the role to be included in the token.
     * @return a JWT token as a String.
     */
    public String generateToken(String username, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);  // Add the role to the token
        return createToken(claims, username);
    }

    /**
     * Private helper method to create the token.
     *
     * @param claims a map of claims to include in the token.
     * @param subject the subject (typically the username) for the token.
     * @return a JWT token as a String.
     */
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Validate a token without checking for username.
     *
     * @param token the JWT token to validate.
     * @return true if the token is valid, false otherwise.
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("Token expired: " + e.getMessage());
        } catch (JwtException e) {
            System.out.println("Invalid token: " + e.getMessage());
        }
        return false;
    }

    /**
     * Validate a token and check if it belongs to the provided user.
     *
     * @param token the JWT token to validate.
     * @param userDetails the user details to match against the token.
     * @return true if the token is valid and belongs to the user, false otherwise.
     */
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * Extract the username from the token.
     *
     * @param token the JWT token.
     * @return the username as a String.
     */
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Extract the role from the token.
     *
     * @param token the JWT token.
     * @return the role as a String.
     */
    public String extractRole(String token) {
        return (String) Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role");
    }

    /**
     * Check if the token is expired.
     *
     * @param token the JWT token.
     * @return true if the token is expired, false otherwise.
     */
    private boolean isTokenExpired(String token) {
        Date expiration = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        return expiration.before(new Date());
    }
}
