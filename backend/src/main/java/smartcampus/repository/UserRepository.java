package smartcampus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import smartcampus.model.User;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * Custom query to find a user by their email address.
     * Used during Google Authentication to retrieve the internal User ID.
     */
    Optional<User> findByEmail(String email);
}