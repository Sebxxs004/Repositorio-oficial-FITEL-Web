package co.com.fitel.modules.plans.infrastructure.controller;

import co.com.fitel.common.dto.ApiResponse;
import co.com.fitel.modules.plans.application.dto.PlanDTO;
import co.com.fitel.modules.plans.application.service.PlanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para Planes
 * 
 * Implementa el principio de Responsabilidad Única (SRP) - solo maneja HTTP
 * Implementa el principio de Inversión de Dependencias (DIP) - depende de PlanService
 */
@Slf4j
@RestController
@RequestMapping("/api/public/plans")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PlanController {

    private final PlanService planService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PlanDTO>>> getAllPlans() {
        log.info("GET /api/public/plans - Fetching all active plans");
        List<PlanDTO> plans = planService.getAllActivePlans();
        return ResponseEntity.ok(ApiResponse.success("Planes obtenidos exitosamente", plans));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlanDTO>> getPlanById(@PathVariable Long id) {
        log.info("GET /api/public/plans/{} - Fetching plan", id);
        PlanDTO plan = planService.getPlanById(id);
        return ResponseEntity.ok(ApiResponse.success("Plan obtenido exitosamente", plan));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<PlanDTO>>> getPopularPlans() {
        log.info("GET /api/public/plans/popular - Fetching popular plans");
        List<PlanDTO> plans = planService.getPopularPlans();
        return ResponseEntity.ok(ApiResponse.success("Planes populares obtenidos exitosamente", plans));
    }
}
