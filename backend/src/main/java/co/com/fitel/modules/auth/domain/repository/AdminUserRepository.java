package co.com.fitel.modules.auth.domain.repository;

import co.com.fitel.modules.auth.domain.model.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para usuarios administradores
 */
@Repository
public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    Optional<AdminUser> findByUsername(String username);
    Optional<AdminUser> findByEmail(String email);
    Optional<AdminUser> findByPasswordResetToken(String passwordResetToken);
    boolean existsByUsername(String username);
    long countByActiveTrue();
}
