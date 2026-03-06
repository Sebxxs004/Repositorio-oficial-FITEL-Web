package co.com.fitel.modules.auth.infrastructure.controller;

import co.com.fitel.common.dto.ApiResponse;
import co.com.fitel.modules.auth.application.dto.CreateUserRequest;
import co.com.fitel.modules.auth.application.dto.LoginRequest;
import co.com.fitel.modules.auth.application.dto.LoginResponse;
import co.com.fitel.modules.auth.application.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * Controlador de autenticación para administradores
 */
@RestController
@RequestMapping("/api/auth/admin")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(originPatterns = "*", allowCredentials = "true", maxAge = 3600)
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
            HttpServletResponse response,
            HttpServletRequest httpRequest) {
        try {
            LoginResponse loginResponse = authService.login(request);
            
            // Configurar cookies httpOnly para mayor seguridad con SameSite=None para cross-domain
            ResponseCookie tokenCookie = ResponseCookie.from("admin_token", loginResponse.getToken())
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(7 * 24 * 60 * 60)
                    .sameSite("None")
                    .build();
            
            ResponseCookie sessionCookie = ResponseCookie.from("admin_session", loginResponse.getSessionToken())
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(60 * 60)
                    .sameSite("None")
                    .build();
            
            response.addHeader(HttpHeaders.SET_COOKIE, tokenCookie.toString());
            response.addHeader(HttpHeaders.SET_COOKIE, sessionCookie.toString());

            // Enviar notificación de login (no bloquea la respuesta si falla)
            String ip = httpRequest.getHeader("X-Forwarded-For");
            if (ip == null || ip.isBlank()) ip = httpRequest.getRemoteAddr();
            String userAgent = httpRequest.getHeader("User-Agent");
            authService.sendLoginNotification(request.getUsername(), ip, userAgent);
            
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
    
    @PostMapping("/users")
    public ResponseEntity<ApiResponse<Void>> createUser(@Valid @RequestBody CreateUserRequest request) {
        try {
            authService.createUser(request);
            return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                    .success(true)
                    .message("Usuario creado exitosamente")
                    .build()
            );
        } catch (Exception e) {
            log.error("Error creando usuario: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ApiResponse.<Void>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build()
            );
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        // Eliminar cookies con SameSite=None para que funcione en cross-domain
        ResponseCookie tokenCookie = ResponseCookie.from("admin_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("None")
                .build();
        
        ResponseCookie sessionCookie = ResponseCookie.from("admin_session", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("None")
                .build();
        
        response.addHeader(HttpHeaders.SET_COOKIE, tokenCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, sessionCookie.toString());
        
        return ResponseEntity.ok(
            ApiResponse.<Void>builder()
                .success(true)
                .message("Sesión cerrada")
                .build()
        );
    }

    @PostMapping("/change-password/init")
    public ResponseEntity<ApiResponse<String>> initChangePassword(
            @Valid @RequestBody co.com.fitel.modules.auth.application.dto.ChangePasswordInitRequest request) {
        
        try {
            String username = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
            
            if (username == null || "anonymousUser".equals(username)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ApiResponse.<String>builder()
                        .success(false)
                        .message("No autenticado")
                        .build()
                );
            }

            String fallbackCode = authService.initiatePasswordChange(username, request.getCurrentPassword());
            
            if (fallbackCode != null) {
                // Email falló → devolver código directamente (admin ya autenticado con JWT + contraseña)
                return ResponseEntity.ok(
                    ApiResponse.<String>builder()
                        .success(true)
                        .message("No se pudo enviar el correo (configura el email en el panel). Usa el código que aparece en pantalla.")
                        .data(fallbackCode)
                        .build()
                );
            }

            return ResponseEntity.ok(
                ApiResponse.<String>builder()
                    .success(true)
                    .message("Código de verificación enviado al correo")
                    .build()
            );
        } catch (Exception e) {
            log.error("Error iniciando cambio contraseña: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                ApiResponse.<String>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build()
            );
        }
    }

    @PostMapping("/change-password/confirm")
    public ResponseEntity<ApiResponse<Void>> confirmChangePassword(
            @Valid @RequestBody co.com.fitel.modules.auth.application.dto.ChangePasswordConfirmRequest request) {
        
        try {
            String username = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
            
            if (username == null || "anonymousUser".equals(username)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ApiResponse.<Void>builder()
                        .success(false)
                        .message("No autenticado")
                        .build()
                );
            }

            authService.confirmPasswordChange(username, request.getNewPassword(), request.getVerificationCode());
            
            return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                    .success(true)
                    .message("Contraseña actualizada exitosamente")
                    .build()
            );
        } catch (Exception e) {
             log.error("Error confirmando cambio contraseña: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                ApiResponse.<Void>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build()
            );
        }
    }
    
    /**
     * Endpoint para solicitar recuperación de contraseña
     * Endpoint público - no requiere autenticación
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody co.com.fitel.modules.auth.application.dto.ForgotPasswordRequest request) {
        try {
            authService.initiateForgotPassword(request.getUsernameOrEmail());
        } catch (Exception e) {
            log.error("Error en forgot password: {}", e.getMessage());
        }
        // Por seguridad, SIEMPRE devolver el mismo mensaje genérico
        // independientemente de si el usuario existe, si el email se envió o no
        return ResponseEntity.ok(
            ApiResponse.<Void>builder()
                .success(true)
                .message("Si el usuario existe, recibirás un correo con las instrucciones para recuperar tu contraseña")
                .build()
        );
    }
    
    /**
     * Endpoint para validar token de recuperación
     * Endpoint público - no requiere autenticación
     */
    @GetMapping("/validate-reset-token")
    public ResponseEntity<ApiResponse<Boolean>> validateResetToken(@RequestParam String token) {
        try {
            boolean isValid = authService.validatePasswordResetToken(token);
            
            return ResponseEntity.ok(
                ApiResponse.<Boolean>builder()
                    .success(true)
                    .data(isValid)
                    .message(isValid ? "Token válido" : "Token inválido o expirado")
                    .build()
            );
        } catch (Exception e) {
            log.error("Error validando token: {}", e.getMessage());
            return ResponseEntity.ok(
                ApiResponse.<Boolean>builder()
                    .success(true)
                    .data(false)
                    .message("Token inválido")
                    .build()
            );
        }
    }
    
    /**
     * Endpoint para resetear contraseña con token
     * Endpoint público - no requiere autenticación
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody co.com.fitel.modules.auth.application.dto.ResetPasswordRequest request) {
        try {
            authService.resetPasswordWithToken(request.getToken(), request.getNewPassword());
            
            return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                    .success(true)
                    .message("Contraseña restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.")
                    .build()
            );
        } catch (Exception e) {
            log.error("Error reseteando contraseña: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ApiResponse.<Void>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build()
            );
        }
    }

    /**
     * Endpoint público - revocar todas las sesiones activas (acción "No fui yo")
     * Recibe el securityAlertToken enviado por email, invalida todas las sesiones
     * y devuelve un token para resetear la contraseña.
     */
    @PostMapping("/revoke-sessions")
    public ResponseEntity<ApiResponse<String>> revokeSessions(@RequestBody Map<String, String> body) {
        try {
            String token = body.get("token");
            if (token == null || token.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ApiResponse.<String>builder()
                        .success(false)
                        .message("Token de seguridad requerido")
                        .build()
                );
            }
            String resetToken = authService.revokeAllSessions(token);
            return ResponseEntity.ok(
                ApiResponse.<String>builder()
                    .success(true)
                    .message("Sesiones revocadas correctamente. Ahora puedes cambiar tu contraseña.")
                    .data(resetToken)
                    .build()
            );
        } catch (Exception e) {
            log.error("Error revocando sesiones: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ApiResponse.<String>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build()
            );
        }
    }
}
