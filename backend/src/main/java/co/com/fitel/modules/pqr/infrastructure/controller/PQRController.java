package co.com.fitel.modules.pqr.infrastructure.controller;

import co.com.fitel.common.dto.ApiResponse;
import co.com.fitel.modules.pqr.application.dto.CreatePQRRequest;
import co.com.fitel.modules.pqr.application.dto.ReanalysisRequest;
import co.com.fitel.modules.pqr.application.dto.PQRConstancyDTO;
import co.com.fitel.modules.pqr.application.dto.PQRResponseDTO;
import co.com.fitel.modules.pqr.application.service.PQRService;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
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
     * Crea una nueva PQR con soporte para archivos adjuntos
     */
    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<PQRResponseDTO>> createPQR(
            @RequestPart("data") @Valid CreatePQRRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
            
        log.info("POST /api/pqrs - Creating new PQR for customer: {} with {} files", 
            request != null ? request.getCustomerEmail() : "null request",
            files != null ? files.size() : 0);
            
        try {
            if (request == null) {
                log.error("Request body is null");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("El cuerpo de la petición está vacío"));
            }
            
            log.debug("PQR Request details - Type: {}, Name: {}, Email: {}", 
                request.getType(), request.getCustomerName(), request.getCustomerEmail());
            
            PQRResponseDTO pqr = pqrService.createPQR(request, files);
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
     * Endpoint legacy para soporte JSON puro (sin archivos)
     */
    @PostMapping(consumes = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<PQRResponseDTO>> createPQRJson(@Valid @RequestBody CreatePQRRequest request) {
        return createPQR(request, null);
    }
    
    /**
     * Consulta una PQR por CUN o documento
     */
    @GetMapping("/consultar")
    public ResponseEntity<ApiResponse<List<PQRResponseDTO>>> consultPQR(@RequestParam String query) {
        log.info("GET /api/pqrs/consultar?query={}", query);
        try {
            List<PQRResponseDTO> pqrs = pqrService.searchPQR(query);
            return ResponseEntity.ok(ApiResponse.success("PQR encontrada", pqrs));
        } catch (Exception e) {
            log.error("Error searching PQR: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("PQR no encontrada: " + e.getMessage()));
        }
    }
    
    /**
     * Solicita reanálisis (recurso) para una PQR
     */
    @PostMapping("/{cun}/reanalisis")
    public ResponseEntity<ApiResponse<PQRResponseDTO>> requestReanalysis(
            @PathVariable String cun,
            @Valid @RequestBody ReanalysisRequest request) {
        log.info("POST /api/pqrs/{}/reanalisis", cun);
        try {
            PQRResponseDTO pqr = pqrService.requestReanalysis(cun, request);
            return ResponseEntity.ok(ApiResponse.success("Solicitud de reanálisis enviada exitosamente", pqr));
        } catch (co.com.fitel.common.exception.BusinessException e) {
            return ResponseEntity.status(e.getStatus())
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error requesting reanalysis: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error inesperado al solicitar reanálisis"));
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
