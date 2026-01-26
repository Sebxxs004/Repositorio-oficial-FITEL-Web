package co.com.fitel.modules.pqr.infrastructure.controller;

import co.com.fitel.common.dto.ApiResponse;
import co.com.fitel.modules.pqr.application.dto.DashboardStatsDTO;
import co.com.fitel.modules.pqr.application.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para el Dashboard
 * 
 * Implementa el principio de Responsabilidad Única (SRP) - solo maneja HTTP
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:*"}, allowCredentials = "true", maxAge = 3600)
public class DashboardController {
    
    private final DashboardService dashboardService;
    
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboardStats() {
        log.info("GET /api/admin/dashboard/stats - Fetching dashboard statistics");
        try {
            DashboardStatsDTO stats = dashboardService.getDashboardStats();
            return ResponseEntity.ok(ApiResponse.success("Estadísticas del dashboard obtenidas", stats));
        } catch (Exception e) {
            log.error("Error obteniendo estadísticas del dashboard: {}", e.getMessage(), e);
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error al obtener estadísticas: " + e.getMessage()));
        }
    }
}
