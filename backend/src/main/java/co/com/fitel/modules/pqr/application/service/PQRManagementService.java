package co.com.fitel.modules.pqr.application.service;

import co.com.fitel.modules.pqr.application.dto.PQRResponseDTO;
import co.com.fitel.modules.pqr.application.dto.UpdatePQRRequest;
import co.com.fitel.modules.pqr.domain.model.PQR;
import co.com.fitel.modules.pqr.domain.repository.PQRRepository;
import co.com.fitel.common.service.EmailService;
import co.com.fitel.modules.audit.application.service.OperationLogService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    private final EmailService emailService;
    private final OperationLogService operationLogService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
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
    public PQRResponseDTO updatePQR(Long id, UpdatePQRRequest request, String performedBy, String ipAddress) {
        log.info("Updating PQR with ID: {} by user: {}", id, performedBy);
        
        PQR pqr = pqrRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("PQR no encontrada con ID: " + id));

        // Guardar valores anteriores para el log
        Map<String, Object> oldValues = new HashMap<>();
        oldValues.put("status", pqr.getStatus());
        oldValues.put("priority", pqr.getPriority());
        oldValues.put("responsibleArea", pqr.getResponsibleArea());
        oldValues.put("realType", pqr.getRealType());
        oldValues.put("internalNotes", pqr.getInternalNotes());
        oldValues.put("response", pqr.getResponse());
        
        String previousStatus = pqr.getStatus();
        
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

            // Enviar respuesta por correo al cliente, incluyendo adjunto si existe
            try {
                String attachmentPath = pqr.getResponseAttachmentPath();
                // Si guardamos rutas relativas, construir la ruta absoluta
                String absolutePath = null;
                if (attachmentPath != null && !attachmentPath.isBlank()) {
                    java.nio.file.Path path = java.nio.file.Paths.get(attachmentPath);
                    if (!path.isAbsolute()) {
                        path = java.nio.file.Paths.get("").toAbsolutePath().resolve(path);
                    }
                    absolutePath = path.toString();
                }

                emailService.sendPQRResponseToCustomer(
                    pqr.getCustomerEmail(),
                    pqr.getCustomerName(),
                    pqr.getCun(),
                    pqr.getType(),
                    pqr.getSubject(),
                    request.getResponse(),
                    absolutePath
                );
            } catch (Exception e) {
                log.error("Error enviando correo de respuesta de PQR {}: {}", pqr.getId(), e.getMessage(), e);
                // No revertir la actualización de la PQR si falla el correo
            }
        }
        
        PQR savedPQR = pqrRepository.save(pqr);
        
        // Guardar valores nuevos para el log
        Map<String, Object> newValues = new HashMap<>();
        newValues.put("status", savedPQR.getStatus());
        newValues.put("priority", savedPQR.getPriority());
        newValues.put("responsibleArea", savedPQR.getResponsibleArea());
        newValues.put("realType", savedPQR.getRealType());
        newValues.put("internalNotes", savedPQR.getInternalNotes());
        newValues.put("response", savedPQR.getResponse() != null ? "RESPUESTA_AGREGADA" : null);
        
        // Registrar en el log de operaciones
        try {
            String oldValuesJson = objectMapper.writeValueAsString(oldValues);
            String newValuesJson = objectMapper.writeValueAsString(newValues);
            
            StringBuilder description = new StringBuilder("Actualización de PQR");
            if (request.getStatus() != null && !request.getStatus().equals(previousStatus)) {
                description.append(String.format(" - Cambio de estado: %s → %s", previousStatus, request.getStatus()));
            }
            if (request.getPriority() != null) {
                description.append(String.format(" - Prioridad: %s", request.getPriority()));
            }
            if (request.getResponsibleArea() != null) {
                description.append(String.format(" - Área responsable: %s", request.getResponsibleArea()));
            }
            if (request.getResponse() != null) {
                description.append(" - Respuesta agregada");
            }
            
            operationLogService.logOperation(
                "PQR",
                savedPQR.getId(),
                "UPDATE",
                description.toString(),
                performedBy,
                oldValuesJson,
                newValuesJson,
                ipAddress
            );
        } catch (Exception e) {
            log.error("Error registrando log de operación para PQR {}: {}", id, e.getMessage(), e);
            // No fallar la actualización si falla el log
        }
        
        // Marcador explícito para verificar que esta versión del código está en app.jar
        log.info("PQR UPDATED_MARKER: id={}, status={}, customerEmail={}",
            savedPQR.getId(), savedPQR.getStatus(), savedPQR.getCustomerEmail());

        // Determinar un estado efectivo legible, aunque venga nulo/vacío
        String effectiveStatus = request.getStatus();
        if (effectiveStatus == null || effectiveStatus.isBlank()) {
            effectiveStatus = savedPQR.getStatus();
        }

        // Solo enviar correo de cambio de estado si no se indica que se debe omitir
        // (por ejemplo, cuando se marca como RESUELTA y se envía respuesta, solo se envía la respuesta)
        if (request.getSkipStatusChangeEmail() == null || !request.getSkipStatusChangeEmail()) {
            String previousLabel = previousStatus != null && !previousStatus.isBlank() ? previousStatus : "DESCONOCIDO";
            String newLabel = effectiveStatus != null && !effectiveStatus.isBlank() ? effectiveStatus : "DESCONOCIDO";

            try {
                log.info("Sending PQR status change email for PQR {}: {} -> {}",
                    savedPQR.getId(), previousLabel, newLabel);
                emailService.sendPQRStatusChangeToCustomer(
                    savedPQR.getCustomerEmail(),
                    savedPQR.getCustomerName(),
                    savedPQR.getCun(),
                    savedPQR.getType(),
                    savedPQR.getSubject(),
                    previousLabel,
                    newLabel
                );
            } catch (Exception e) {
                log.error("Error enviando notificación de cambio de estado para PQR {}: {}", savedPQR.getId(), e.getMessage(), e);
            }
        } else {
            log.info("Skipping status change email for PQR {} as requested", savedPQR.getId());
        }
        
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
            .responsibleArea(pqr.getResponsibleArea())
            .realType(pqr.getRealType())
            .resourceType(pqr.getResourceType())
            .internalNotes(pqr.getInternalNotes())
            .response(pqr.getResponse())
            .responseAttachmentPath(pqr.getResponseAttachmentPath())
            .createdAt(pqr.getCreatedAt())
            .updatedAt(pqr.getUpdatedAt())
            .responseDate(pqr.getResponseDate())
            .resolutionDate(pqr.getResolutionDate())
            .slaDeadline(pqr.getSlaDeadline())
            .build();
    }

    /**
     * Guarda un archivo adjunto asociado a la respuesta de una PQR
     */
    public String saveResponseAttachment(Long id, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("El archivo adjunto está vacío");
        }

        try {
            PQR pqr = pqrRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PQR no encontrada con ID: " + id));

            // Directorio base para adjuntos de PQR
            Path uploadDir = Paths.get("uploads", "pqr-responses", String.valueOf(id));
            Files.createDirectories(uploadDir);

            String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "adjunto";
            String cleanedFilename = originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
            String filename = System.currentTimeMillis() + "_" + cleanedFilename;

            Path targetPath = uploadDir.resolve(filename);
            Files.write(targetPath, file.getBytes());

            // Guardar ruta relativa en la PQR
            String relativePath = uploadDir.resolve(filename).toString();
            pqr.setResponseAttachmentPath(relativePath);
            pqrRepository.save(pqr);

            return relativePath;
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar el archivo adjunto: " + e.getMessage(), e);
        }
    }
}
