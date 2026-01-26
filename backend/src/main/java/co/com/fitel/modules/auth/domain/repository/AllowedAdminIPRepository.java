package co.com.fitel.modules.auth.domain.repository;

import co.com.fitel.modules.auth.domain.model.AllowedAdminIP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para IPs permitidas
 */
@Repository
public interface AllowedAdminIPRepository extends JpaRepository<AllowedAdminIP, Long> {
    List<AllowedAdminIP> findByActiveTrue();
    
    // Búsqueda por hash (rápida, sin desencriptar)
    Optional<AllowedAdminIP> findByIpHash(String ipHash);
    Optional<AllowedAdminIP> findByRangeHash(String rangeHash);
    
    // Verificar existencia por hash
    boolean existsByIpHash(String ipHash);
    boolean existsByRangeHash(String rangeHash);
}
