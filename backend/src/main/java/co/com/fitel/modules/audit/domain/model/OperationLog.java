package co.com.fitel.modules.audit.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidad para registrar logs de operaciones del sistema
 * Permite trazabilidad completa de cambios realizados
 */
@Entity
@Table(name = "operation_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OperationLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType; // PQR, PLAN, CONFIG, etc.
    
    @Column(name = "entity_id")
    private Long entityId; // ID de la entidad afectada
    
    @Column(name = "operation_type", nullable = false, length = 50)
    private String operationType; // CREATE, UPDATE, DELETE, STATUS_CHANGE, etc.
    
    @Column(name = "operation_description", nullable = false, columnDefinition = "TEXT")
    private String operationDescription; // Descripción detallada
    
    @Column(name = "performed_by", nullable = false, length = 100)
    private String performedBy; // Usuario que realizó la operación
    
    @Column(name = "performed_at", nullable = false)
    private LocalDateTime performedAt; // Fecha y hora
    
    @Column(name = "old_values", columnDefinition = "TEXT")
    private String oldValues; // Valores anteriores (JSON)
    
    @Column(name = "new_values", columnDefinition = "TEXT")
    private String newValues; // Valores nuevos (JSON)
    
    @Column(name = "ip_address", length = 45)
    private String ipAddress; // IP desde donde se realizó la operación
    
    @PrePersist
    protected void onCreate() {
        if (performedAt == null) {
            performedAt = LocalDateTime.now();
        }
    }
}
