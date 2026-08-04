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
    
    List<PQR> findByCustomerDocumentNumber(String documentNumber);
    
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

    default Optional<PQR> findByCunParts(Integer anio, Integer consecutivo) {
        String pattern1 = "%" + (anio % 100) + String.format("%010d", consecutivo);
        String pattern2 = "%" + (anio % 100) + String.format("%06d", consecutivo);
        return findByCunPatterns(pattern1, pattern2);
    }

    @Query(value = "SELECT p.*, " +
           "p.customer_name as nombres, " +
           "'' as apellidos, " +
           "p.customer_name as razon_social, " +
           "CASE WHEN p.customer_document_type = 'NIT' THEN 'JURIDICA' ELSE 'NATURAL' END as tipo_persona " +
           "FROM pqr p WHERE p.cun LIKE :pattern1 OR p.cun LIKE :pattern2 LIMIT 1", 
           nativeQuery = true)
    Optional<PQR> findByCunPatterns(@Param("pattern1") String pattern1, @Param("pattern2") String pattern2);

    @Query(value = "SELECT p.*, " +
           "p.customer_name as nombres, " +
           "'' as apellidos, " +
           "p.customer_name as razon_social, " +
           "CASE WHEN p.customer_document_type = 'NIT' THEN 'JURIDICA' ELSE 'NATURAL' END as tipo_persona " +
           "FROM pqr p WHERE p.customer_document_type = :tipo AND p.customer_document_number = :numero", 
           nativeQuery = true)
    List<PQR> findByIdentificacion(@Param("tipo") String tipo, @Param("numero") String numero);
}
