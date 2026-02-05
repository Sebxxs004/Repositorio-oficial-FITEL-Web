package co.com.fitel.modules.pqr.infrastructure.controller;

import co.com.fitel.common.dto.ApiResponse;
import co.com.fitel.modules.pqr.application.dto.PQRResponseDTO;
import co.com.fitel.modules.pqr.application.dto.UpdatePQRRequest;
import co.com.fitel.modules.pqr.application.service.PQRManagementService;
import co.com.fitel.modules.auth.application.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestión de PQRs desde el panel admin
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/pqrs")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:*"}, allowCredentials = "true", maxAge = 3600)
public class PQRManagementController {
    
    private final PQRManagementService pqrManagementService;
    private final JwtService jwtService;
    
    /**
     * Lista todas las PQRs
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<PQRResponseDTO>>> getAllPQRs(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "50") int size
    ) {
        log.info("GET /api/admin/pqrs - Fetching all PQRs");
        try {
            List<PQRResponseDTO> pqrs = pqrManagementService.getAllPQRsList();
            return ResponseEntity.ok(ApiResponse.success("PQRs obtenidas exitosamente", pqrs));
        } catch (Exception e) {
            log.error("Error fetching PQRs: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener PQRs: " + e.getMessage()));
        }
    }
    
    /**
     * Obtiene una PQR por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PQRResponseDTO>> getPQRById(@PathVariable Long id) {
        log.info("GET /api/admin/pqrs/{}", id);
        try {
            PQRResponseDTO pqr = pqrManagementService.getPQRById(id);
            return ResponseEntity.ok(ApiResponse.success("PQR obtenida exitosamente", pqr));
        } catch (Exception e) {
            log.error("Error fetching PQR: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("PQR no encontrada: " + e.getMessage()));
        }
    }
    
    /**
     * Actualiza una PQR
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PQRResponseDTO>> updatePQR(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePQRRequest request,
            @CookieValue(value = "admin_token", required = false) String token,
            @RequestHeader(value = "X-Forwarded-For", required = false) String forwardedFor,
            jakarta.servlet.http.HttpServletRequest httpRequest
    ) {
        log.info("PUT /api/admin/pqrs/{} - Updating PQR", id);
        try {
            // Obtener usuario del token
            String username = "SYSTEM";
            if (token != null && !token.isEmpty()) {
                try {
                    username = jwtService.getUsernameFromToken(token);
                } catch (Exception e) {
                    log.warn("No se pudo obtener usuario del token: {}", e.getMessage());
                }
            }
            
            // Obtener IP del cliente
            String ipAddress = forwardedFor != null ? forwardedFor.split(",")[0].trim() : 
                              httpRequest.getRemoteAddr();
            
            PQRResponseDTO pqr = pqrManagementService.updatePQR(id, request, username, ipAddress);
            return ResponseEntity.ok(ApiResponse.success("PQR actualizada exitosamente", pqr));
        } catch (Exception e) {
            log.error("Error updating PQR: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Error al actualizar PQR: " + e.getMessage()));
        }
    }

    /**
     * Sube un archivo adjunto para la respuesta de una PQR
     */
    @PostMapping("/{id}/response-attachment")
    public ResponseEntity<ApiResponse<String>> uploadResponseAttachment(
            @PathVariable Long id,
            @RequestPart("file") MultipartFile file
    ) {
        log.info("POST /api/admin/pqrs/{}/response-attachment - Uploading response attachment", id);
        try {
            String path = pqrManagementService.saveResponseAttachment(id, file);
            return ResponseEntity.ok(ApiResponse.success("Archivo adjunto guardado exitosamente", path));
        } catch (Exception e) {
            log.error("Error uploading response attachment for PQR {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Error al subir archivo adjunto: " + e.getMessage()));
        }
    }
    
    /**
     * Obtiene PQRs próximas a vencer
     */
    @GetMapping("/alerts/near-deadline")
    public ResponseEntity<ApiResponse<List<PQRResponseDTO>>> getPQRsNearDeadline(
            @RequestParam(required = false, defaultValue = "3") int days
    ) {
        log.info("GET /api/admin/pqrs/alerts/near-deadline?days={}", days);
        try {
            List<PQRResponseDTO> pqrs = pqrManagementService.getPQRsNearDeadline(days);
            return ResponseEntity.ok(ApiResponse.success("PQRs próximas a vencer obtenidas", pqrs));
        } catch (Exception e) {
            log.error("Error fetching PQRs near deadline: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener PQRs próximas a vencer: " + e.getMessage()));
        }
    }
    
    /**
     * Obtiene PQRs vencidas
     */
    @GetMapping("/alerts/overdue")
    public ResponseEntity<ApiResponse<List<PQRResponseDTO>>> getOverduePQRs() {
        log.info("GET /api/admin/pqrs/alerts/overdue");
        try {
            List<PQRResponseDTO> pqrs = pqrManagementService.getOverduePQRs();
            return ResponseEntity.ok(ApiResponse.success("PQRs vencidas obtenidas", pqrs));
        } catch (Exception e) {
            log.error("Error fetching overdue PQRs: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener PQRs vencidas: " + e.getMessage()));
        }
    }
}
