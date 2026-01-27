package co.com.fitel.modules.pqr.application.service;

import co.com.fitel.modules.pqr.application.dto.PQRResponseDTO;
import co.com.fitel.modules.pqr.application.dto.UpdatePQRRequest;
import co.com.fitel.modules.pqr.domain.model.PQR;
import co.com.fitel.modules.pqr.domain.repository.PQRRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para gestión de PQRs desde el panel admin
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PQRManagementService {
    
    private final PQRRepository pqrRepository;
    
    /**
     * Lista todas las PQRs con paginación
     */
    @Transactional(readOnly = true)
    public Page<PQRResponseDTO> getAllPQRs(Pageable pageable) {
        log.debug("Fetching all PQRs with pagination");
        return pqrRepository.findAll(pageable)
            .map(this::mapToDTO);
    }
    
    /**
     * Lista todas las PQRs sin paginación
     */
    @Transactional(readOnly = true)
    public List<PQRResponseDTO> getAllPQRsList() {
        log.debug("Fetching all PQRs as list");
        return pqrRepository.findAll().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtiene una PQR por ID
     */
    @Transactional(readOnly = true)
    public PQRResponseDTO getPQRById(Long id) {
        log.debug("Fetching PQR with ID: {}", id);
        PQR pqr = pqrRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("PQR no encontrada con ID: " + id));
        return mapToDTO(pqr);
    }
    
    /**
     * Actualiza una PQR
     */
    public PQRResponseDTO updatePQR(Long id, UpdatePQRRequest request) {
        log.info("Updating PQR with ID: {}", id);
        
        PQR pqr = pqrRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("PQR no encontrada con ID: " + id));
        
        // Validar que no se cierre fuera del SLA
        if ("CERRADA".equals(request.getStatus()) && pqr.getSlaDeadline() != null) {
            if (LocalDateTime.now().isBefore(pqr.getSlaDeadline())) {
                throw new RuntimeException("No se puede cerrar la PQR antes de la fecha límite del SLA");
            }
        }
        
        // Actualizar campos
        if (request.getStatus() != null) {
            pqr.setStatus(request.getStatus());
            
            // Actualizar fechas según el estado
            if ("RESUELTA".equals(request.getStatus()) && pqr.getResolutionDate() == null) {
                pqr.setResolutionDate(LocalDateTime.now());
            }
            if ("EN_RESPUESTA".equals(request.getStatus()) && pqr.getResponseDate() == null) {
                pqr.setResponseDate(LocalDateTime.now());
            }
        }
        
        if (request.getPriority() != null) {
            pqr.setPriority(request.getPriority());
        }
        
        if (request.getAssignedTo() != null) {
            pqr.setAssignedTo(request.getAssignedTo());
        }
        
        if (request.getResponsibleArea() != null) {
            pqr.setResponsibleArea(request.getResponsibleArea());
        }
        
        if (request.getRealType() != null) {
            pqr.setRealType(request.getRealType());
        }
        
        if (request.getInternalNotes() != null) {
            pqr.setInternalNotes(request.getInternalNotes());
        }
        
        if (request.getResponse() != null) {
            pqr.setResponse(request.getResponse());
            if (pqr.getResponseDate() == null) {
                pqr.setResponseDate(LocalDateTime.now());
            }
        }
        
        PQR savedPQR = pqrRepository.save(pqr);
        log.info("PQR updated successfully: {}", savedPQR.getId());
        
        return mapToDTO(savedPQR);
    }
    
    /**
     * Obtiene PQRs que están próximas a vencer (SLA)
     */
    @Transactional(readOnly = true)
    public List<PQRResponseDTO> getPQRsNearDeadline(int daysBeforeDeadline) {
        log.debug("Fetching PQRs near deadline ({} days before)", daysBeforeDeadline);
        LocalDateTime deadlineThreshold = LocalDateTime.now().plusDays(daysBeforeDeadline);
        
        return pqrRepository.findAll().stream()
            .filter(pqr -> pqr.getSlaDeadline() != null)
            .filter(pqr -> {
                LocalDateTime deadline = pqr.getSlaDeadline();
                return deadline.isAfter(LocalDateTime.now()) 
                    && deadline.isBefore(deadlineThreshold)
                    && !"CERRADA".equals(pqr.getStatus())
                    && !"RESUELTA".equals(pqr.getStatus());
            })
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtiene PQRs vencidas (SLA)
     */
    @Transactional(readOnly = true)
    public List<PQRResponseDTO> getOverduePQRs() {
        log.debug("Fetching overdue PQRs");
        
        return pqrRepository.findAll().stream()
            .filter(pqr -> pqr.getSlaDeadline() != null)
            .filter(pqr -> {
                LocalDateTime deadline = pqr.getSlaDeadline();
                return deadline.isBefore(LocalDateTime.now())
                    && !"CERRADA".equals(pqr.getStatus())
                    && !"RESUELTA".equals(pqr.getStatus());
            })
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Mapea la entidad PQR a DTO
     */
    private PQRResponseDTO mapToDTO(PQR pqr) {
        return PQRResponseDTO.builder()
            .id(pqr.getId())
            .cun(pqr.getCun())
            .type(pqr.getType())
            .customerName(pqr.getCustomerName())
            .customerEmail(pqr.getCustomerEmail())
            .customerPhone(pqr.getCustomerPhone())
            .customerDocumentType(pqr.getCustomerDocumentType())
            .customerDocumentNumber(pqr.getCustomerDocumentNumber())
            .customerAddress(pqr.getCustomerAddress())
            .subject(pqr.getSubject())
            .description(pqr.getDescription())
            .status(pqr.getStatus())
            .priority(pqr.getPriority())
            .assignedTo(pqr.getAssignedTo())
            .responsibleArea(pqr.getResponsibleArea())
            .realType(pqr.getRealType())
            .resourceType(pqr.getResourceType())
            .internalNotes(pqr.getInternalNotes())
            .response(pqr.getResponse())
            .createdAt(pqr.getCreatedAt())
            .updatedAt(pqr.getUpdatedAt())
            .responseDate(pqr.getResponseDate())
            .resolutionDate(pqr.getResolutionDate())
            .slaDeadline(pqr.getSlaDeadline())
            .build();
    }
}
