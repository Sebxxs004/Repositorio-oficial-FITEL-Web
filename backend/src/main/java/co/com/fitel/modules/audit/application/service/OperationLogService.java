package co.com.fitel.modules.audit.application.service;

import co.com.fitel.modules.audit.domain.model.OperationLog;
import co.com.fitel.modules.audit.domain.repository.OperationLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Servicio para gestión de logs de operaciones
 */
@Service
@Transactional
public class OperationLogService {
    
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(OperationLogService.class);
    
    private final OperationLogRepository operationLogRepository;

    public OperationLogService(OperationLogRepository operationLogRepository) {
        this.operationLogRepository = operationLogRepository;
    }
    
    /**
     * Registra una operación en el log
     */
    public OperationLog logOperation(
            String entityType,
            Long entityId,
            String operationType,
            String operationDescription,
            String performedBy,
            String oldValues,
            String newValues,
            String ipAddress
    ) {
        OperationLog logEntry = new OperationLog();
        logEntry.setEntityType(entityType);
        logEntry.setEntityId(entityId);
        logEntry.setOperationType(operationType);
        logEntry.setOperationDescription(operationDescription);
        logEntry.setPerformedBy(performedBy);
        logEntry.setPerformedAt(LocalDateTime.now());
        logEntry.setOldValues(oldValues);
        logEntry.setNewValues(newValues);
        logEntry.setIpAddress(ipAddress);
        
        OperationLog saved = operationLogRepository.save(logEntry);
        log.debug("Operation logged: {} - {} by {}", operationType, entityType, performedBy);
        return saved;
    }
    
    /**
     * Registra una operación simple (sin valores antiguos/nuevos)
     */
    public OperationLog logOperation(
            String entityType,
            Long entityId,
            String operationType,
            String operationDescription,
            String performedBy,
            String ipAddress
    ) {
        return logOperation(entityType, entityId, operationType, operationDescription, 
                performedBy, null, null, ipAddress);
    }
    
    /**
     * Obtiene logs de una entidad específica
     */
    @Transactional(readOnly = true)
    public List<OperationLog> getLogsByEntity(String entityType, Long entityId) {
        return operationLogRepository.findByEntityTypeAndEntityIdOrderByPerformedAtDesc(entityType, entityId);
    }
    
    /**
     * Obtiene logs de un usuario
     */
    @Transactional(readOnly = true)
    public Page<OperationLog> getLogsByUser(String performedBy, Pageable pageable) {
        return operationLogRepository.findByPerformedByOrderByPerformedAtDesc(performedBy, pageable);
    }
    
    /**
     * Obtiene logs por tipo de operación
     */
    @Transactional(readOnly = true)
    public Page<OperationLog> getLogsByOperationType(String operationType, Pageable pageable) {
        return operationLogRepository.findByOperationTypeOrderByPerformedAtDesc(operationType, pageable);
    }
    
    /**
     * Obtiene logs en un rango de fechas
     */
    @Transactional(readOnly = true)
    public Page<OperationLog> getLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return operationLogRepository.findByPerformedAtBetween(startDate, endDate, pageable);
    }
    
    /**
     * Obtiene logs por tipo de entidad
     */
    @Transactional(readOnly = true)
    public Page<OperationLog> getLogsByEntityType(String entityType, Pageable pageable) {
        return operationLogRepository.findByEntityTypeOrderByPerformedAtDesc(entityType, pageable);
    }
}
