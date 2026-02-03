package co.com.fitel.modules.config.infrastructure.controller;

import co.com.fitel.common.dto.ApiResponse;
import co.com.fitel.common.service.EmailService;
import co.com.fitel.modules.config.application.dto.ContactFormRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para el formulario de contacto público
 */
@Slf4j
@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:*"}, allowCredentials = "true", maxAge = 3600)
public class ContactController {
    
    private final EmailService emailService;
    
    /**
     * Procesa el formulario de contacto y envía notificación a la empresa
     */
    @PostMapping
    public ResponseEntity<ApiResponse<String>> submitContactForm(@Valid @RequestBody ContactFormRequest request) {
        log.info("POST /api/contact - Processing contact form from: {}", request.getEmail());
        
        try {
            // Obtener el label del asunto
            String subjectLabel = getSubjectLabel(request.getSubject());
            
            // Enviar notificación a la empresa
            emailService.sendContactFormNotification(
                request.getName(),
                request.getEmail(),
                request.getPhone(),
                subjectLabel,
                request.getMessage()
            );
            
            log.info("Contact form processed successfully for: {}", request.getEmail());
            return ResponseEntity.ok(ApiResponse.success("Mensaje enviado correctamente. Nos pondremos en contacto pronto.", "OK"));
        } catch (RuntimeException e) {
            // Si el email está deshabilitado o no configurado, no fallar el envío
            if (e.getMessage() != null && 
                (e.getMessage().contains("no encontrada") || 
                 e.getMessage().contains("deshabilitado"))) {
                log.warn("No se pudo enviar la notificación de contacto (configuración no disponible): {}", e.getMessage());
                return ResponseEntity.ok(ApiResponse.success("Mensaje recibido. Nos pondremos en contacto pronto.", "OK"));
            } else {
                log.error("Error procesando formulario de contacto: {}", e.getMessage(), e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al enviar el mensaje. Por favor intenta de nuevo."));
            }
        } catch (Exception e) {
            log.error("Error inesperado procesando formulario de contacto: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error inesperado al procesar el mensaje. Por favor intenta de nuevo."));
        }
    }
    
    /**
     * Convierte el valor del asunto a su label legible
     */
    private String getSubjectLabel(String subjectValue) {
        return switch (subjectValue) {
            case "plan-informacion" -> "Información sobre Planes";
            case "plan-contratacion" -> "Contratar un Plan";
            case "cobertura" -> "Consulta de Cobertura";
            case "soporte-tecnico" -> "Soporte Técnico";
            case "facturacion" -> "Facturación y Pagos";
            case "cambio-plan" -> "Cambio o Actualización de Plan";
            case "servicios-adicionales" -> "Servicios Adicionales";
            case "promociones" -> "Promociones y Ofertas";
            case "otro" -> "Otro";
            default -> subjectValue;
        };
    }
}
