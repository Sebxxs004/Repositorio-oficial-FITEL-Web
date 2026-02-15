package co.com.fitel.modules.auth.application.service;

import co.com.fitel.common.service.EmailService;
import co.com.fitel.modules.auth.application.dto.CreateUserRequest;
import co.com.fitel.modules.auth.application.dto.LoginRequest;
import co.com.fitel.modules.auth.application.dto.LoginResponse;
import co.com.fitel.modules.auth.domain.model.AdminUser;
import co.com.fitel.modules.auth.domain.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Servicio de autenticación para administradores
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    
    @Transactional
    public LoginResponse login(LoginRequest request) {
        log.info("Intento de login para usuario: {}", request.getUsername());
        
        Optional<AdminUser> userOpt = adminUserRepository.findByUsername(request.getUsername());
        
        if (userOpt.isEmpty()) {
            log.warn("Usuario no encontrado: {}", request.getUsername());
            throw new RuntimeException("Credenciales inválidas");
        }
        
        AdminUser user = userOpt.get();
        
        if (!user.getActive()) {
            log.warn("Intento de login con usuario inactivo: {}", request.getUsername());
            throw new RuntimeException("Usuario inactivo");
        }
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            log.warn("Contraseña incorrecta para usuario: {}", request.getUsername());
            throw new RuntimeException("Credenciales inválidas");
        }
        
        // Actualizar último login
        user.updateLastLogin();
        adminUserRepository.save(user);
        
        // Generar tokens
        String token = jwtService.generateToken(user.getUsername(), user.getRole());
        String sessionToken = jwtService.generateSessionToken(user.getUsername());
        
        log.info("Login exitoso para usuario: {}", request.getUsername());
        
        return new LoginResponse(
            token,
            sessionToken,
            user.getUsername(),
            user.getFullName(),
            user.getRole(),
            "Login exitoso"
        );
    }
    
    public boolean verifyToken(String token) {
        try {
            return jwtService.validateToken(token);
        } catch (Exception e) {
            log.warn("Token inválido: {}", e.getMessage());
            return false;
        }
    }
    
    @Transactional(readOnly = true)
    public LoginResponse getCurrentUser(String token) {
        try {
            String username = jwtService.getUsernameFromToken(token);
            log.debug("Obteniendo usuario actual para: {}", username);
            
            Optional<AdminUser> userOpt = adminUserRepository.findByUsername(username);
            
            if (userOpt.isEmpty()) {
                log.warn("Usuario no encontrado: {}", username);
                throw new RuntimeException("Usuario no encontrado");
            }
            
            AdminUser user = userOpt.get();
            
            return new LoginResponse(
                null, // No devolver el token
                null, // No devolver el session token
                user.getUsername(),
                user.getFullName(),
                user.getRole(),
                "Usuario obtenido exitosamente"
            );
        } catch (io.jsonwebtoken.JwtException e) {
            log.error("Error validando token JWT: {}", e.getMessage());
            throw new RuntimeException("Token inválido o expirado: " + e.getMessage());
        } catch (Exception e) {
            log.error("Error obteniendo usuario actual: {}", e.getMessage(), e);
            throw new RuntimeException("Error al obtener usuario: " + e.getMessage());
        }
    }
    
    @Transactional
    public void initiatePasswordChange(String username, String currentPassword) {
        log.info("Iniciando cambio de contraseña para usuario: {}", username);
        
        Optional<AdminUser> userOpt = adminUserRepository.findByUsername(username);
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        AdminUser user = userOpt.get();
        
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new RuntimeException("Contraseña actual incorrecta");
        }
        
        // Generar código de 6 dígitos
        String code = String.format("%06d", new java.util.Random().nextInt(999999));
        
        user.setVerificationCode(code);
        user.setVerificationCodeExpiresAt(java.time.LocalDateTime.now().plusMinutes(10)); // Valido por 10 min
        adminUserRepository.save(user);
        
        // Enviar correo
        try {
            emailService.sendEmail(
                user.getUsername(), // Asumimos que username es el email
                "Código de Verificación - Cambio de Contraseña",
                "Su código de verificación para cambiar la contraseña es: <b>" + code + "</b><br>Este código expira en 10 minutos."
            );
        } catch (Exception e) {
            log.error("Error enviando correo de verificación: {}", e.getMessage());
            throw new RuntimeException("Error enviando el correo de verificación");
        }
    }

    @Transactional
    public void confirmPasswordChange(String username, String newPassword, String code) {
        log.info("Confirmando cambio de contraseña para usuario: {}", username);
        
        Optional<AdminUser> userOpt = adminUserRepository.findByUsername(username);
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        AdminUser user = userOpt.get();
        
        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(code)) {
            throw new RuntimeException("Código de verificación inválido");
        }
        
        if (user.getVerificationCodeExpiresAt().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("El código de verificación ha expirado");
        }
        
        // Cambiar la contraseña
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setVerificationCode(null); // Limpiar código
        user.setVerificationCodeExpiresAt(null);
        
        adminUserRepository.save(user);
        log.info("Contraseña actualizada exitosamente para usuario: {}", username);
    }

    /**
     * Crear un nuevo usuario administrador
     * La contraseña se hashea automáticamente con BCrypt antes de guardarse
     */
    @Transactional
    public AdminUser createAdminUser(String username, String password, String fullName, String role) {
        if (adminUserRepository.existsByUsername(username)) {
            throw new RuntimeException("El usuario ya existe");
        }
        
        // Hashear la contraseña antes de guardarla
        String hashedPassword = passwordEncoder.encode(password);
        
        AdminUser newUser = AdminUser.builder()
            .username(username)
            .passwordHash(hashedPassword) // Contraseña hasheada, NO en texto plano
            .fullName(fullName)
            .role(role != null ? role : "ADMIN")
            .active(true)
            .build();
        
        AdminUser savedUser = adminUserRepository.save(newUser);
        log.info("Usuario administrador creado: {}", username);
        
        return savedUser;
    }
    
    /**
     * Crear un usuario desde una petición y enviar correo
     */
    @Transactional
    public void createUser(CreateUserRequest request) {
        // Crear usuario (ya hashea la contraseña)
        createAdminUser(
            request.getEmail(),
            request.getPassword(), 
            request.getFullName(),
            request.getRole()
        );
        
        // Enviar correo con la contraseña original (no hasheada)
        try {
            emailService.sendAccountCreationEmail(
                request.getEmail(), 
                request.getFullName(), 
                request.getPassword()
            );
        } catch (Exception e) {
            log.error("Usuario creado exitosamente pero falló el envío del correo de bienvenida a {}: {}", 
                     request.getEmail(), e.getMessage());
        }
    }

    /**
     * Actualizar la contraseña de un usuario
     * La nueva contraseña se hashea automáticamente
     */
    @Transactional
    public void updatePassword(String username, String newPassword) {
        Optional<AdminUser> userOpt = adminUserRepository.findByUsername(username);
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        AdminUser user = userOpt.get();
        // Hashear la nueva contraseña antes de guardarla
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        adminUserRepository.save(user);
        
        log.info("Contraseña actualizada para usuario: {}", username);
    }
}
