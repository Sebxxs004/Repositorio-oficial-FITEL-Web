package co.com.fitel.modules.pqr.application.service;

import co.com.fitel.common.service.EmailService;
import co.com.fitel.common.exception.BusinessException;
import co.com.fitel.modules.pqr.application.dto.CreatePQRRequest;
import co.com.fitel.modules.pqr.application.dto.ReanalysisRequest;
import co.com.fitel.modules.pqr.application.dto.PQRConstancyDTO;
import co.com.fitel.modules.pqr.application.dto.PQRResponseDTO;
import co.com.fitel.modules.pqr.domain.model.PQR;
import co.com.fitel.modules.pqr.domain.repository.PQRRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Servicio para gestión de PQRs
 * Implementa el principio de Responsabilidad Única (SRP)
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PQRService {
    
    private final PQRRepository pqrRepository;
    private final EmailService emailService;
    private final EntityManager entityManager;
    private final co.com.fitel.common.service.StorageService storageService;
    
    // SLA: 15 días hábiles para respuesta
    private static final int SLA_DAYS = 15;
    
    /**
     * Crea una nueva PQR desde el frontend (con archivos opcionales)
     */
    public PQRResponseDTO createPQR(CreatePQRRequest request, java.util.List<org.springframework.web.multipart.MultipartFile> files) {
        log.info("Creating new PQR for customer: {}", request.getCustomerEmail());
        
        // Cargar archivos si existen
        java.util.List<String> uploadedUrls = new java.util.ArrayList<>();
        if (files != null && !files.isEmpty()) {
            uploadedUrls = storageService.uploadFiles(files);
            log.info("Uploaded {} files for PQR", uploadedUrls.size());
        }

        // El CUN se genera automáticamente por el trigger
        // NOTA: Para guardar las URLs de archivos, deberíamos tener un campo en la entidad PQR
        // o una tabla relacionada. Por ahora, las concatenaremos en la descripción si no existe campo.
        // TODO: Actualizar entidad PQR para soportar attachments
        
        String descriptionWithLinks = request.getDescription();
        /* BLOQUE ELIMINADO: No adjuntar links antes de tener el CUN
        if (!uploadedUrls.isEmpty()) {
            StringBuilder sb = new StringBuilder(descriptionWithLinks);
            sb.append("\n\n--- Archivos Adjuntos ---\n");
            for (String url : uploadedUrls) {
                sb.append(url).append("\n");
            }
            descriptionWithLinks = sb.toString();
        }
        */

        PQR pqr = PQR.builder()
            .type(request.getType().toUpperCase())
            .customerName(request.getCustomerName())
            .customerEmail(request.getCustomerEmail())
            .customerPhone(request.getCustomerPhone())
            .customerDocumentType(request.getCustomerDocumentType())
            .customerDocumentNumber(request.getCustomerDocumentNumber())
            .customerAddress(request.getCustomerAddress())
            .subject(request.getSubject())
            .description(descriptionWithLinks)
            .resourceType(request.getResourceType())
            .status("RECIBIDA")
            .priority("NORMAL")
            .slaDeadline(calculateSLADeadline())
            .constancyGenerated(false)
            .build();
        
        PQR savedPQR = pqrRepository.save(pqr);
        
        // El CUN se asigna después del save por el trigger SQL
        // Necesitamos hacer flush para asegurar que el INSERT se ejecute en la BD
        pqrRepository.flush();
        
        // Limpiar el contexto de persistencia para forzar una nueva consulta
        entityManager.clear();
        
        // Recargar la entidad desde la base de datos para obtener el CUN generado por el trigger
        savedPQR = pqrRepository.findById(savedPQR.getId())
            .orElseThrow(() -> new RuntimeException("Error al guardar PQR"));
        
        // Verificar que el CUN fue generado por el trigger
        if (!uploadedUrls.isEmpty()) {
            StringBuilder sb = new StringBuilder(descriptionWithLinks);
            sb.append("\n\n--- Archivos Adjuntos ---\n");
            for (String url : uploadedUrls) {
                // Agregar el parámetro CUN a la URL guardada para facilitar el acceso posterior
                if (url.contains("/uploads/") && !url.contains("?cun=")) {
                   sb.append(url).append("?cun=").append(savedPQR.getCun()).append("\n");
                } else {
                   sb.append(url).append("\n");
                }
            }
            descriptionWithLinks = sb.toString();
            
            // Actualizar la descripción con los links que incluyen el CUN
            savedPQR.setDescription(descriptionWithLinks);
            savedPQR = pqrRepository.save(savedPQR);
        }
        
        log.info("PQR created successfully with ID: {}, CUN: {}", savedPQR.getId(), savedPQR.getCun());
        
        // Enviar constancia por correo
        try {
            PQRConstancyDTO constancy = generateConstancy(savedPQR.getCun());
            
            if (constancy != null && constancy.getCun() != null) {
                try {
            emailService.sendPQRConstancy(
                savedPQR.getCustomerEmail(),
                savedPQR.getCustomerName(),
                constancy.getCun(),
                constancy.getType(),
                savedPQR.getSubject(),
                constancy.getRadicationDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
                constancy.getMaxResponseDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                constancy.getSilenceAdministrativeText()
            );
            
            // Marcar constancia como enviada
            savedPQR.setConstancyGenerated(true);
            savedPQR.setConstancySentAt(LocalDateTime.now());
            pqrRepository.save(savedPQR);
            
            log.info("Constancia enviada por correo a: {}", savedPQR.getCustomerEmail());
                    
                    // Enviar notificación a la empresa
                    try {
                        emailService.sendPQRNotificationToCompany(
                            savedPQR.getCustomerName(),
                            savedPQR.getCustomerEmail(),
                            savedPQR.getCustomerPhone(),
                            savedPQR.getCustomerDocumentType(),
                            savedPQR.getCustomerDocumentNumber(),
                            savedPQR.getCustomerAddress(),
                            constancy.getCun(),
                            constancy.getType(),
                            savedPQR.getSubject(),
                            savedPQR.getDescription(),
                            constancy.getRadicationDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
                            constancy.getMaxResponseDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                        );
                        log.info("Notificación de PQR enviada a la empresa");
                    } catch (Exception companyEmailEx) {
                        log.warn("No se pudo enviar la notificación a la empresa: {}", companyEmailEx.getMessage());
                        // No fallar si no se puede enviar a la empresa
                    }
                } catch (RuntimeException emailEx) {
                    // Si el email está deshabilitado o no configurado, solo loguear el warning
                    if (emailEx.getMessage() != null && 
                        (emailEx.getMessage().contains("no encontrada") || 
                         emailEx.getMessage().contains("deshabilitado"))) {
                        log.warn("No se pudo enviar el correo (configuración no disponible): {}", emailEx.getMessage());
                    } else {
                        log.error("Error enviando constancia por correo: {}", emailEx.getMessage(), emailEx);
                    }
                    // No fallar la creación de PQR si falla el envío de email
                }
            } else {
                log.warn("No se pudo generar la constancia para la PQR CUN: {}", savedPQR.getCun());
            }
        } catch (Exception e) {
            log.error("Error procesando constancia por correo: {}", e.getMessage(), e);
            // No fallar la creación de PQR si falla el envío de email
            // La PQR ya fue creada exitosamente, solo falló el envío del correo
        }
        
        return mapToDTO(savedPQR);
    }
    
    /**
     * Busca una PQR por CUN o número de documento
     */
    @Transactional(readOnly = true)
    public List<PQRResponseDTO> searchPQR(String query) {
        log.debug("Searching PQR with query: {}", query);
        
        // Intentar buscar por CUN primero (es único)
        Optional<PQR> pqrByCun = pqrRepository.findByCun(query);
        if (pqrByCun.isPresent()) {
            return List.of(mapToDTO(pqrByCun.get()));
        }
        
        // Si no se encuentra por CUN, buscar por documento (puede haber varios)
        List<PQR> pqrsByDoc = pqrRepository.findByCustomerDocumentNumber(query);
        
        if (pqrsByDoc != null && !pqrsByDoc.isEmpty()) {
            return pqrsByDoc.stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        }
        
        throw new RuntimeException("PQR no encontrada");
    }
    
    /**
     * Genera la constancia de radicación
     */
    @Transactional(readOnly = true)
    public PQRConstancyDTO generateConstancy(String cun) {
        if (cun == null || cun.isEmpty()) {
            throw new RuntimeException("El CUN no puede ser nulo o vacío");
        }
        
        PQR pqr = pqrRepository.findByCun(cun)
            .orElseThrow(() -> new RuntimeException("PQR no encontrada con CUN: " + cun));
        
        if (pqr.getCun() == null) {
            throw new RuntimeException("La PQR encontrada no tiene CUN asignado");
        }
        
        LocalDateTime maxResponseDate = pqr.getSlaDeadline() != null 
            ? pqr.getSlaDeadline() 
            : calculateSLADeadline();
        
        String silenceText = "De conformidad con el artículo 14 de la Ley 1437 de 2011, " +
            "si dentro del término señalado no se ha notificado la decisión, " +
            "se entenderá resuelta la solicitud en sentido positivo (SILENCIO ADMINISTRATIVO POSITIVO).";
        
        return PQRConstancyDTO.builder()
            .cun(pqr.getCun())
            .customerName(pqr.getCustomerName())
            .type(pqr.getType())
            .subject(pqr.getSubject())
            .radicationDate(pqr.getCreatedAt() != null ? pqr.getCreatedAt() : LocalDateTime.now())
            .maxResponseDate(maxResponseDate)
            .silenceAdministrativeText(silenceText)
            .build();
    }
    
    /**
     * Calcula la fecha límite según SLA (15 días hábiles)
     */
    /**
     * Mantiene compatibilidad con llamadas sin archivos
     */
    public PQRResponseDTO createPQR(CreatePQRRequest request) {
        return createPQR(request, null);
    }
    
    /**
     * Solicita reanálisis de una PQR resuelta
     */
    public PQRResponseDTO requestReanalysis(String cun, ReanalysisRequest request) {
        log.info("Requesting reanalysis for PQR: {}", cun);
        
        PQR pqr = pqrRepository.findByCun(cun)
            .orElseThrow(() -> new BusinessException("PQR no encontrada", HttpStatus.NOT_FOUND));
            
        if (!"RESUELTA".equals(pqr.getStatus()) && !"CERRADA".equals(pqr.getStatus())) {
             throw new BusinessException("La PQR no está en estado Resuelta o Cerrada para solicitar reanálisis", HttpStatus.BAD_REQUEST);
        }
        
        // Actualizar estado y agregar motivo
        pqr.setStatus("EN_ANALISIS");
        pqr.setAppealReason(request.getReason());
        pqr.setUpdatedAt(LocalDateTime.now());
        
        // Opcional: Agregar como nota interna también o descripción
        String note = "\n\n[SOLICITUD DE REANÁLISIS - " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) + "]\n" + request.getReason();
        if (pqr.getDescription() != null) {
            pqr.setDescription(pqr.getDescription() + note);
        }
        
        PQR savedPqr = pqrRepository.save(pqr);
        log.info("PQR {} re-opened for analysis", cun);
        
        // Enviar notificaciones de reanálisis
        try {
            emailService.sendReanalysisNotification(
                savedPqr.getCustomerEmail(), 
                savedPqr.getCustomerName(), 
                savedPqr.getCun(), 
                request.getReason()
            );
        } catch (Exception e) {
            log.error("Failed to send reanalysis notification for PQR {}: {}", cun, e.getMessage());
        }
        
        return mapToDTO(savedPqr);
    }

    private LocalDateTime calculateSLADeadline() {
        LocalDateTime now = LocalDateTime.now();
        int daysAdded = 0;
        int businessDays = 0;
        
        while (businessDays < SLA_DAYS) {
            LocalDateTime checkDate = now.plusDays(daysAdded);
            int dayOfWeek = checkDate.getDayOfWeek().getValue();
            // Lunes a Viernes (1-5) son días hábiles
            if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                businessDays++;
            }
            daysAdded++;
        }
        
        return now.plusDays(daysAdded - 1).withHour(23).withMinute(59).withSecond(59);
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
            .createdAt(pqr.getCreatedAt())
            .updatedAt(pqr.getUpdatedAt())
            .responseDate(pqr.getResponseDate())
            .resolutionDate(pqr.getResolutionDate())
            .slaDeadline(pqr.getSlaDeadline())
            .build();
    }
}
