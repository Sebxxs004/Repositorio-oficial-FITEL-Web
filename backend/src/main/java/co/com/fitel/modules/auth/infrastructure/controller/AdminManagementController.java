package co.com.fitel.modules.auth.infrastructure.controller;

import co.com.fitel.common.dto.ApiResponse;
import co.com.fitel.modules.auth.application.dto.AddIPRequest;
import co.com.fitel.modules.auth.application.dto.CreateUserRequest;
import co.com.fitel.modules.auth.application.dto.AdminUserDTO;
import co.com.fitel.modules.auth.application.dto.AllowedIPDTO;
import co.com.fitel.modules.auth.application.dto.UpdateUserRequest;
import co.com.fitel.modules.auth.application.service.AdminManagementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(originPatterns = "*", allowCredentials = "true", maxAge = 3600)
public class AdminManagementController {
    
    @jakarta.annotation.PostConstruct
    public void init() {
        log.info("AdminManagementController initialized successfully");
    }

    private final AdminManagementService adminManagementService;
    
    // ========== Endpoints de Usuarios ==========
    
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<AdminUserDTO>>> getAllUsers() {
        log.info("GET /api/admin/users - Fetching all admin users");
        List<AdminUserDTO> users = adminManagementService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Usuarios obtenidos exitosamente", users));
    }
    
    @GetMapping("/users/test-endpoint")
    public ResponseEntity<String> testEndpoint() {
        log.info("GET /api/admin/users/test-endpoint called");
        return ResponseEntity.ok("Controller is working for GET");
    }

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<AdminUserDTO>> createUser(@RequestBody CreateUserRequest request) {
        log.info("POST /api/admin/users - Creating new user: {}", request.getEmail());
        try {
            AdminUserDTO newUser = adminManagementService.createUser(request);
            return ResponseEntity.ok(ApiResponse.success("Usuario creado exitosamente. Se han enviado las credenciales al correo.", newUser));
        } catch (RuntimeException e) {
            log.error("Error creating user (Runtime): {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error creating user", e);
            return ResponseEntity.status(500)
                    .body(ApiResponse.error("Error interno del servidor: " + e.getMessage()));
        }
    }
    
    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<AdminUserDTO>> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request) {
        log.info("PUT /api/admin/users/{} - Updating user", id);
        try {
            AdminUserDTO updated = adminManagementService.updateUser(id, request);
            return ResponseEntity.ok(ApiResponse.success("Usuario actualizado exitosamente", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/users/{id}/toggle-active")
    public ResponseEntity<ApiResponse<Void>> toggleUserActive(@PathVariable Long id) {
        log.info("PUT /api/admin/users/{}/toggle-active - Toggling user active status", id);
        try {
            adminManagementService.toggleUserActive(id);
            return ResponseEntity.ok(ApiResponse.success("Estado del usuario actualizado", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        log.info("DELETE /api/admin/users/{} - Deleting user", id);
        try {
            adminManagementService.deleteUser(id);
            return ResponseEntity.ok(ApiResponse.success("Usuario eliminado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // ========== Endpoints de IPs ==========
    
    @GetMapping("/ips")
    public ResponseEntity<ApiResponse<List<AllowedIPDTO>>> getAllIPs() {
        log.info("GET /api/admin/ips - Fetching all allowed IPs");
        List<AllowedIPDTO> ips = adminManagementService.getAllIPs();
        return ResponseEntity.ok(ApiResponse.success("IPs obtenidas exitosamente", ips));
    }
    
    @PostMapping("/ips")
    public ResponseEntity<ApiResponse<AllowedIPDTO>> addIP(@RequestBody AddIPRequest request) {
        log.info("POST /api/admin/ips - Adding new IP");
        try {
            AllowedIPDTO added = adminManagementService.addIP(request);
            return ResponseEntity.ok(ApiResponse.success("IP agregada exitosamente", added));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/ips/{id}/toggle-active")
    public ResponseEntity<ApiResponse<Void>> toggleIPActive(@PathVariable Long id) {
        log.info("PUT /api/admin/ips/{}/toggle-active - Toggling IP active status", id);
        try {
            adminManagementService.toggleIPActive(id);
            return ResponseEntity.ok(ApiResponse.success("Estado de la IP actualizado", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/ips/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteIP(@PathVariable Long id) {
        log.info("DELETE /api/admin/ips/{} - Deleting IP", id);
        try {
            adminManagementService.deleteIP(id);
            return ResponseEntity.ok(ApiResponse.success("IP eliminada exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
