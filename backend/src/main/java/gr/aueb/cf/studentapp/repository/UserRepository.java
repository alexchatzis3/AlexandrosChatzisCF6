package gr.aueb.cf.studentapp.repository;

import gr.aueb.cf.studentapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository interface for User entity.
 * It extends JpaRepository to provide CRUD operations and custom queries for User entities.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by their username.
     *
     * @param username the username of the user to be found.
     * @return an Optional containing the found User or empty if not found.
     */
    Optional<User> findByUsername(String username);
}
