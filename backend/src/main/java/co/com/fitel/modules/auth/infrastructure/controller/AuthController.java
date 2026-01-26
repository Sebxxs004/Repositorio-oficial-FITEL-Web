package co.com.fitel.modules.auth.infrastructure.controller;

import co.com.fitel.common.dto.ApiResponse;
import co.com.fitel.modules.auth.application.dto.LoginRequest;
import co.com.fitel.modules.auth.application.dto.LoginResponse;
import co.com.fitel.modules.auth.application.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador de autenticación para administradores
 */
@RestController
@RequestMapping("/api/auth/admin")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:*"}, allowCredentials = "true", maxAge = 3600)
public class AuthController {
    
    private final AuthService authService;
    
    @GetMapping("/test")
    public ResponseEntity<ApiResponse<String>> test() {
        return ResponseEntity.ok(
            ApiResponse.<String>builder()
                .success(true)
                .data("Test endpoint funcionando")
                .message("OK")
                .build()
        );
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        try {
            LoginResponse loginResponse = authService.login(request);
            
            // Configurar cookies httpOnly para mayor seguridad
            Cookie tokenCookie = new Cookie("admin_token", loginResponse.getToken());
            tokenCookie.setHttpOnly(true);
            tokenCookie.setSecure(false); // Cambiar a true en producción con HTTPS
            tokenCookie.setPath("/");
            tokenCookie.setMaxAge(7 * 24 * 60 * 60); // 7 días
            response.addCookie(tokenCookie);
            
            Cookie sessionCookie = new Cookie("admin_session", loginResponse.getSessionToken());
            sessionCookie.setHttpOnly(true);
            sessionCookie.setSecure(false);
            sessionCookie.setPath("/");
            sessionCookie.setMaxAge(60 * 60); // 1 hora
            response.addCookie(sessionCookie);
            
            return ResponseEntity.ok(
                ApiResponse.<LoginResponse>builder()
                    .success(true)
                    .data(loginResponse)
                    .message("Login exitoso")
                    .build()
            );
        } catch (Exception e) {
            log.error("Error en login: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiResponse.<LoginResponse>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build()
            );
        }
    }
    
    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<Boolean>> verify(@CookieValue(value = "admin_token", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiResponse.<Boolean>builder()
                    .success(false)
                    .message("No autenticado")
                    .build()
            );
        }
        
        boolean isValid = authService.verifyToken(token);
        
        if (isValid) {
            return ResponseEntity.ok(
                ApiResponse.<Boolean>builder()
                    .success(true)
                    .data(true)
                    .message("Token válido")
                    .build()
            );
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiResponse.<Boolean>builder()
                    .success(false)
                    .message("Token inválido o expirado")
                    .build()
            );
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<LoginResponse>> getCurrentUser(@CookieValue(value = "admin_token", required = false) String token) {
        if (token == null || token.isEmpty()) {
            log.warn("GET /api/auth/admin/me - No token provided");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiResponse.<LoginResponse>builder()
                    .success(false)
                    .message("No autenticado")
                    .build()
            );
        }
        
        try {
            log.debug("GET /api/auth/admin/me - Validating token");
            LoginResponse userInfo = authService.getCurrentUser(token);
            log.info("GET /api/auth/admin/me - User retrieved: {}", userInfo.getUsername());
            return ResponseEntity.ok(
                ApiResponse.<LoginResponse>builder()
                    .success(true)
                    .data(userInfo)
                    .message("Usuario obtenido exitosamente")
                    .build()
            );
        } catch (Exception e) {
            log.error("Error obteniendo usuario actual: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiResponse.<LoginResponse>builder()
                    .success(false)
                    .message("Token inválido o expirado: " + e.getMessage())
                    .build()
            );
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        // Eliminar cookies
        Cookie tokenCookie = new Cookie("admin_token", "");
        tokenCookie.setHttpOnly(true);
        tokenCookie.setPath("/");
        tokenCookie.setMaxAge(0);
        response.addCookie(tokenCookie);
        
        Cookie sessionCookie = new Cookie("admin_session", "");
        sessionCookie.setHttpOnly(true);
        sessionCookie.setPath("/");
        sessionCookie.setMaxAge(0);
        response.addCookie(sessionCookie);
        
        return ResponseEntity.ok(
            ApiResponse.<Void>builder()
                .success(true)
                .message("Sesión cerrada")
                .build()
        );
    }
}
