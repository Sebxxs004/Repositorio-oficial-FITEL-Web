package co.com.fitel.modules.pqr.application.service;

import co.com.fitel.common.service.EmailService;
import co.com.fitel.modules.pqr.application.dto.CreatePQRRequest;
import co.com.fitel.modules.pqr.application.dto.PQRConstancyDTO;
import co.com.fitel.modules.pqr.application.dto.PQRResponseDTO;
import co.com.fitel.modules.pqr.domain.model.PQR;
import co.com.fitel.modules.pqr.domain.repository.PQRRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    
    // SLA: 15 días hábiles para respuesta
    private static final int SLA_DAYS = 15;
    
    /**
     * Crea una nueva PQR desde el frontend
     */
    public PQRResponseDTO createPQR(CreatePQRRequest request) {
        log.info("Creating new PQR for customer: {}", request.getCustomerEmail());
        
        // El CUN se genera automáticamente por el trigger
        PQR pqr = PQR.builder()
            .type(request.getType().toUpperCase())
            .customerName(request.getCustomerName())
            .customerEmail(request.getCustomerEmail())
            .customerPhone(request.getCustomerPhone())
            .customerDocumentType(request.getCustomerDocumentType())
            .customerDocumentNumber(request.getCustomerDocumentNumber())
            .customerAddress(request.getCustomerAddress())
            .subject(request.getSubject())
            .description(request.getDescription())
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
        if (savedPQR.getCun() == null || savedPQR.getCun().isEmpty()) {
            log.error("El CUN no fue generado por el trigger para la PQR ID: {}", savedPQR.getId());
            throw new RuntimeException("Error: El CUN no fue generado automáticamente. Por favor contacte al administrador.");
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
    public PQRResponseDTO searchPQR(String query) {
        log.debug("Searching PQR with query: {}", query);
        
        // Intentar buscar por CUN primero
        PQR pqr = pqrRepository.findByCun(query)
            .orElse(null);
        
        // Si no se encuentra por CUN, buscar por documento
        if (pqr == null) {
            pqr = pqrRepository.findByCustomerDocumentNumber(query)
                .orElse(null);
        }
        
        if (pqr == null) {
            throw new RuntimeException("PQR no encontrada");
        }
        
        return mapToDTO(pqr);
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
