package co.com.fitel.modules.audit.domain.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * Entidad para registrar logs de operaciones del sistema
 * Permite trazabilidad completa de cambios realizados
 */
@Entity
@Table(name = "operation_logs")
public class OperationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType; // PQR, PLAN, CONFIG, etc.

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "operation_type", nullable = false, length = 20)
    private String operationType; // CREATE, UPDATE, DELETE, VIEW

    @Column(columnDefinition = "TEXT")
    private String operationDescription;

    @Column(name = "performed_by", length = 100)
    private String performedBy; // Email o ID del usuario/sesión

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(columnDefinition = "TEXT")
    private String oldValues; // JSON con valores anteriores

    @Column(columnDefinition = "TEXT")
    private String newValues; // JSON con valores nuevos

    @Column(nullable = false, updatable = false)
    private LocalDateTime performedAt;

    @PrePersist
    public void prePersist() {
        if (this.performedAt == null) {
            this.performedAt = LocalDateTime.now();
        }
    }

    public OperationLog() {}

    public OperationLog(Long id, String entityType, Long entityId, String operationType, String operationDescription, String performedBy, String ipAddress, String oldValues, String newValues, LocalDateTime performedAt) {
        this.id = id;
        this.entityType = entityType;
        this.entityId = entityId;
        this.operationType = operationType;
        this.operationDescription = operationDescription;
        this.performedBy = performedBy;
        this.ipAddress = ipAddress;
        this.oldValues = oldValues;
        this.newValues = newValues;
        this.performedAt = performedAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }
    public String getOperationType() { return operationType; }
    public void setOperationType(String operationType) { this.operationType = operationType; }
    public String getOperationDescription() { return operationDescription; }
    public void setOperationDescription(String operationDescription) { this.operationDescription = operationDescription; }
    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public String getOldValues() { return oldValues; }
    public void setOldValues(String oldValues) { this.oldValues = oldValues; }
    public String getNewValues() { return newValues; }
    public void setNewValues(String newValues) { this.newValues = newValues; }
    public LocalDateTime getPerformedAt() { return performedAt; }
    public void setPerformedAt(LocalDateTime performedAt) { this.performedAt = performedAt; }
}
