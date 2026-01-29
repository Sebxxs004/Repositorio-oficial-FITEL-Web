package co.com.fitel.modules.pqr.infrastructure.controller;

import co.com.fitel.common.dto.ApiResponse;
import co.com.fitel.modules.pqr.application.dto.CreatePQRRequest;
import co.com.fitel.modules.pqr.application.dto.PQRConstancyDTO;
import co.com.fitel.modules.pqr.application.dto.PQRResponseDTO;
import co.com.fitel.modules.pqr.application.service.PQRService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para PQRs públicas
 * 
 * Implementa el principio de Responsabilidad Única (SRP) - solo maneja HTTP
 */
@Slf4j
@RestController
@RequestMapping("/api/pqrs")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:*"}, allowCredentials = "true", maxAge = 3600)
public class PQRController {
    
    private final PQRService pqrService;
    
    // Método PostConstruct para logging de inicialización
    @jakarta.annotation.PostConstruct
    public void init() {
        log.info("PQRController inicializado - Endpoint: /api/pqrs");
    }
    
    /**
     * Endpoint de prueba para verificar que el controlador está registrado
     */
    @GetMapping("/test")
    public ResponseEntity<ApiResponse<String>> test() {
        log.info("GET /api/pqrs/test - Test endpoint");
        return ResponseEntity.ok(ApiResponse.success("Controlador PQR funcionando correctamente", "OK"));
    }
    
    /**
     * Crea una nueva PQR
     */
    @PostMapping
    public ResponseEntity<ApiResponse<PQRResponseDTO>> createPQR(@Valid @RequestBody CreatePQRRequest request) {
        log.info("POST /api/pqrs - Creating new PQR for customer: {}", request != null ? request.getCustomerEmail() : "null request");
        try {
            if (request == null) {
                log.error("Request body is null");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("El cuerpo de la petición está vacío"));
            }
            
            log.debug("PQR Request details - Type: {}, Name: {}, Email: {}", 
                request.getType(), request.getCustomerName(), request.getCustomerEmail());
            
            PQRResponseDTO pqr = pqrService.createPQR(request);
            log.info("PQR created successfully with CUN: {}", pqr.getCun());
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("PQR creada exitosamente", pqr));
        } catch (RuntimeException e) {
            log.error("Runtime error creating PQR: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al crear PQR: " + e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error creating PQR: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error inesperado al crear PQR. Por favor contacte al soporte."));
        }
    }
    
    /**
     * Consulta una PQR por CUN o documento
     */
    @GetMapping("/consultar")
    public ResponseEntity<ApiResponse<PQRResponseDTO>> consultPQR(@RequestParam String query) {
        log.info("GET /api/pqrs/consultar?query={}", query);
        try {
            PQRResponseDTO pqr = pqrService.searchPQR(query);
            return ResponseEntity.ok(ApiResponse.success("PQR encontrada", pqr));
        } catch (Exception e) {
            log.error("Error searching PQR: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("PQR no encontrada: " + e.getMessage()));
        }
    }
    
    /**
     * Obtiene la constancia de radicación
     */
    @GetMapping("/constancia/{cun}")
    public ResponseEntity<ApiResponse<PQRConstancyDTO>> getConstancy(@PathVariable String cun) {
        log.info("GET /api/pqrs/constancia/{}", cun);
        try {
            PQRConstancyDTO constancy = pqrService.generateConstancy(cun);
            return ResponseEntity.ok(ApiResponse.success("Constancia generada", constancy));
        } catch (Exception e) {
            log.error("Error generating constancy: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Error al generar constancia: " + e.getMessage()));
        }
    }
}
