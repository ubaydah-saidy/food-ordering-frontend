package co.tz.ourrestaurant.repository;

import co.tz.ourrestaurant.model.AppUser;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByUsernameIgnoreCase(String username);
    Optional<AppUser> findByEmailIgnoreCase(String email);
    Optional<AppUser> findByPhone(String phone);
    Optional<AppUser> findBySessionTokenAndSessionExpiresAtAfter(String token, Instant now);
    List<AppUser> findByRoleOrderByCreatedAtDesc(co.tz.ourrestaurant.model.UserRole role);
}