package gr.aueb.cf.studentapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import gr.aueb.cf.studentapp.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

/**
 * Represents a User entity in the system. Implements {@link UserDetails} for integration with Spring Security.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User implements UserDetails {

    /**
     * The unique identifier of the user.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The username of the user. Must be unique and non-blank.
     */
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Column(nullable = false, unique = true)
    private String username;

    /**
     * The password of the user. Must be at least 6 characters long.
     */
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    /**
     * The role of the user. Stored as an enumerated value in the database.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    /**
     * Retrieves the authorities granted to the user. This implementation returns the user's role
     * prefixed with "ROLE_" as a {@link SimpleGrantedAuthority}.
     *
     * @return a collection of authorities granted to the user.
     */
    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (role == null) {
            return Collections.emptyList();
        }
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.toString()));
    }

    /**
     * Indicates whether the user's account has expired. Always returns {@code true} in this implementation.
     *
     * @return {@code true} if the account is non-expired, {@code false} otherwise.
     */
    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Indicates whether the user's account is locked. Always returns {@code true} in this implementation.
     *
     * @return {@code true} if the account is non-locked, {@code false} otherwise.
     */
    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * Indicates whether the user's credentials have expired. Always returns {@code true} in this implementation.
     *
     * @return {@code true} if the credentials are non-expired, {@code false} otherwise.
     */
    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Indicates whether the user is enabled. Always returns {@code true} in this implementation.
     *
     * @return {@code true} if the user is enabled, {@code false} otherwise.
     */
    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return true;
    }
}
