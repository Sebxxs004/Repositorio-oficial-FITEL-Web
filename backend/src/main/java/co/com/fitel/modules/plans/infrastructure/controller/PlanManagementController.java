package co.com.fitel.modules.plans.infrastructure.controller;

import co.com.fitel.common.dto.ApiResponse;
import co.com.fitel.modules.plans.application.dto.CreatePlanRequest;
import co.com.fitel.modules.plans.application.dto.PlanDTO;
import co.com.fitel.modules.plans.application.dto.UpdatePlanRequest;
import co.com.fitel.modules.plans.application.service.PlanManagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

/**
 * Controlador REST para gestión de planes desde el panel admin
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/plans")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "*", allowCredentials = "true", maxAge = 3600)
public class PlanManagementController {
    
    private final PlanManagementService planManagementService;
    private static final String UPLOAD_DIR = "uploads/assets/plans/";
    
    /**
     * Lista todos los planes (activos e inactivos)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<PlanDTO>>> getAllPlans() {
        log.info("GET /api/admin/plans - Fetching all plans");
        try {
            List<PlanDTO> plans = planManagementService.getAllPlans();
            return ResponseEntity.ok(ApiResponse.success("Planes obtenidos exitosamente", plans));
        } catch (Exception e) {
            log.error("Error fetching plans: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener planes: " + e.getMessage()));
        }
    }
    
    /**
     * Obtiene un plan por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlanDTO>> getPlanById(@PathVariable Long id) {
        log.info("GET /api/admin/plans/{}", id);
        try {
            PlanDTO plan = planManagementService.getPlanById(id);
            return ResponseEntity.ok(ApiResponse.success("Plan obtenido exitosamente", plan));
        } catch (RuntimeException e) {
            log.error("Error fetching plan: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Plan no encontrado: " + e.getMessage()));
        }
    }
    
    /**
     * Crea un nuevo plan
     */
    @PostMapping
    public ResponseEntity<ApiResponse<PlanDTO>> createPlan(@Valid @RequestBody CreatePlanRequest request) {
        log.info("POST /api/admin/plans - Creating new plan");
        try {
            PlanDTO plan = planManagementService.createPlan(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Plan creado exitosamente", plan));
        } catch (RuntimeException e) {
            log.error("Error creating plan: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Actualiza un plan existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PlanDTO>> updatePlan(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePlanRequest request
    ) {
        log.info("PUT /api/admin/plans/{} - Updating plan", id);
        try {
            PlanDTO plan = planManagementService.updatePlan(id, request);
            return ResponseEntity.ok(ApiResponse.success("Plan actualizado exitosamente", plan));
        } catch (RuntimeException e) {
            log.error("Error updating plan: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Elimina un plan
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePlan(@PathVariable Long id) {
        log.info("DELETE /api/admin/plans/{} - Deleting plan", id);
        try {
            planManagementService.deletePlan(id);
            return ResponseEntity.ok(ApiResponse.success("Plan eliminado exitosamente", null));
        } catch (RuntimeException e) {
            log.error("Error deleting plan: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Activa o desactiva un plan
     */
    @PutMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<PlanDTO>> togglePlanActive(@PathVariable Long id) {
        log.info("PUT /api/admin/plans/{}/toggle-active - Toggling plan active status", id);
        try {
            PlanDTO plan = planManagementService.togglePlanActive(id);
            return ResponseEntity.ok(ApiResponse.success("Estado del plan actualizado exitosamente", plan));
        } catch (RuntimeException e) {
            log.error("Error toggling plan active status: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Sube una imagen de fondo para un plan
     */
    @PostMapping("/upload-image")
    public ResponseEntity<ApiResponse<String>> uploadPlanImage(@RequestParam("image") MultipartFile file) {
        log.info("POST /api/admin/plans/upload-image - Uploading plan background image");
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("El archivo está vacío"));
        }
        
        // Validar que sea una imagen
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("El archivo debe ser una imagen"));
        }
        
        try {
            // Generar nombre único para el archivo
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                    : ".png";
            String filename = "plan_" + UUID.randomUUID().toString() + extension;
            String filePath = "/uploads/assets/plans/" + filename;
            
            // Crear directorio si no existe
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Guardar el archivo
            Path filePathFull = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePathFull, StandardCopyOption.REPLACE_EXISTING);
            
            log.info("Plan image uploaded successfully: {}", filePath);
            return ResponseEntity.ok(ApiResponse.success("Imagen subida correctamente", filePath));
        } catch (IOException e) {
            log.error("Error uploading plan image", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al subir la imagen: " + e.getMessage()));
        }
    }
}
