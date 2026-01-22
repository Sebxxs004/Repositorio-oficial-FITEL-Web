package co.com.fitel.modules.plans.domain.repository;

import co.com.fitel.modules.plans.domain.model.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio de Planes
 * 
 * Implementa el principio de Inversión de Dependencias (DIP) - abstracción del acceso a datos
 */
@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {
    
    List<Plan> findByActiveTrue();
    
    Optional<Plan> findByNameAndActiveTrue(String name);
    
    List<Plan> findByPopularTrueAndActiveTrue();
}
