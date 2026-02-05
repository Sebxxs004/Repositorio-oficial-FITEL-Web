package co.com.fitel.modules.audit.domain.repository;

import co.com.fitel.modules.audit.domain.model.OperationLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio para logs de operaciones
 */
@Repository
public interface OperationLogRepository extends JpaRepository<OperationLog, Long> {
    
    /**
     * Busca logs por tipo de entidad e ID
     */
    List<OperationLog> findByEntityTypeAndEntityIdOrderByPerformedAtDesc(String entityType, Long entityId);
    
    /**
     * Busca logs por usuario
     */
    Page<OperationLog> findByPerformedByOrderByPerformedAtDesc(String performedBy, Pageable pageable);
    
    /**
     * Busca logs por tipo de operación
     */
    Page<OperationLog> findByOperationTypeOrderByPerformedAtDesc(String operationType, Pageable pageable);
    
    /**
     * Busca logs en un rango de fechas
     */
    @Query("SELECT ol FROM OperationLog ol WHERE ol.performedAt BETWEEN :startDate AND :endDate ORDER BY ol.performedAt DESC")
    Page<OperationLog> findByPerformedAtBetween(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );
    
    /**
     * Busca logs por tipo de entidad
     */
    Page<OperationLog> findByEntityTypeOrderByPerformedAtDesc(String entityType, Pageable pageable);
}
