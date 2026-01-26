package co.com.fitel.modules.pqr.domain.repository;

import co.com.fitel.modules.pqr.domain.model.PQR;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PQRRepository extends JpaRepository<PQR, Long> {
    
    Optional<PQR> findByCun(String cun);
    
    Optional<PQR> findByCustomerDocumentNumber(String documentNumber);
    
    List<PQR> findByStatus(String status);
    
    @Query("SELECT COUNT(p) FROM PQR p WHERE p.status = :status")
    Long countByStatus(String status);
    
    @Query("SELECT COUNT(p) FROM PQR p WHERE p.status IN ('RECIBIDA', 'EN_PROCESO')")
    Long countPendingPQRs();
    
    @Query("SELECT COUNT(p) FROM PQR p WHERE p.createdAt >= :startDate AND p.createdAt <= :endDate")
    Long countByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query(value = "SELECT DATE(created_at) as date, COUNT(*) as count FROM pqr " +
           "WHERE created_at >= :startDate AND created_at <= :endDate " +
           "GROUP BY DATE(created_at) ORDER BY DATE(created_at)", nativeQuery = true)
    List<Object[]> countByDateGrouped(@Param("startDate") java.sql.Timestamp startDate, @Param("endDate") java.sql.Timestamp endDate);
}
