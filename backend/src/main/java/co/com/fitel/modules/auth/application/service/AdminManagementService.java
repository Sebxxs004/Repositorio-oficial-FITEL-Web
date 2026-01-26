package co.com.fitel.modules.auth.application.service;

import co.com.fitel.modules.auth.application.dto.AddIPRequest;
import co.com.fitel.modules.auth.application.dto.AdminUserDTO;
import co.com.fitel.modules.auth.application.dto.AllowedIPDTO;
import co.com.fitel.modules.auth.application.dto.UpdateUserRequest;
import co.com.fitel.modules.auth.domain.model.AdminUser;
import co.com.fitel.modules.auth.domain.model.AllowedAdminIP;
import co.com.fitel.modules.auth.domain.repository.AdminUserRepository;
import co.com.fitel.modules.auth.domain.repository.AllowedAdminIPRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminManagementService {
    
    private final AdminUserRepository adminUserRepository;
    private final AllowedAdminIPRepository allowedAdminIPRepository;
    private final PasswordEncoder passwordEncoder;
    private final IPEncryptionService ipEncryptionService;
    
    @Transactional(readOnly = true)
    public List<AdminUserDTO> getAllUsers() {
        return adminUserRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public AdminUserDTO updateUser(Long userId, UpdateUserRequest request) {
        AdminUser user = adminUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName());
        }
        
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            // Validar longitud mínima
            if (request.getPassword().length() < 6) {
                throw new RuntimeException("La contraseña debe tener al menos 6 caracteres");
            }
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        
        AdminUser saved = adminUserRepository.save(user);
        log.info("Usuario actualizado: id={}, username={}", saved.getId(), saved.getUsername());
        return toDTO(saved);
    }
    
    @Transactional
    public void toggleUserActive(Long userId) {
        AdminUser user = adminUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        user.setActive(!user.getActive());
        adminUserRepository.save(user);
        log.info("Estado de usuario cambiado: id={}, active={}", userId, user.getActive());
    }
    
    @Transactional
    public void deleteUser(Long userId) {
        if (!adminUserRepository.existsById(userId)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        adminUserRepository.deleteById(userId);
        log.info("Usuario eliminado: id={}", userId);
    }
    
    @Transactional(readOnly = true)
    public List<AllowedIPDTO> getAllIPs() {
        List<AllowedAdminIP> ips = allowedAdminIPRepository.findAll();
        return ips.stream()
                .map(this::toIPDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public AllowedIPDTO addIP(AddIPRequest request) {
        // Validar que se proporcione IP o rango
        if ((request.getIpAddress() == null || request.getIpAddress().trim().isEmpty()) &&
            (request.getIpRange() == null || request.getIpRange().trim().isEmpty())) {
            throw new RuntimeException("Debe proporcionar una IP o un rango");
        }
        
        AllowedAdminIP ip = new AllowedAdminIP();
        ip.setActive(true);
        ip.setDescription(request.getDescription());
        
        if (request.getIpAddress() != null && !request.getIpAddress().trim().isEmpty()) {
            // IP individual
            String ipAddress = request.getIpAddress().trim();
            ip.setIpAddressEncrypted(ipEncryptionService.encrypt(ipAddress));
            ip.setIpHash(ipEncryptionService.generateHash(ipAddress));
            ip.setIpAddress(ipAddress); // Para uso transitorio
        } else if (request.getIpRange() != null && !request.getIpRange().trim().isEmpty()) {
            // Rango CIDR
            String ipRange = request.getIpRange().trim();
            ip.setIpRangeEncrypted(ipEncryptionService.encrypt(ipRange));
            ip.setRangeHash(ipEncryptionService.generateHash(ipRange));
            ip.setIpRange(ipRange); // Para uso transitorio
        }
        
        AllowedAdminIP saved = allowedAdminIPRepository.save(ip);
        log.info("IP agregada: id={}", saved.getId());
        return toIPDTO(saved);
    }
    
    @Transactional
    public void toggleIPActive(Long ipId) {
        AllowedAdminIP ip = allowedAdminIPRepository.findById(ipId)
                .orElseThrow(() -> new RuntimeException("IP no encontrada"));
        
        ip.setActive(!ip.getActive());
        allowedAdminIPRepository.save(ip);
        log.info("Estado de IP cambiado: id={}, active={}", ipId, ip.getActive());
    }
    
    @Transactional
    public void deleteIP(Long ipId) {
        if (!allowedAdminIPRepository.existsById(ipId)) {
            throw new RuntimeException("IP no encontrada");
        }
        
        allowedAdminIPRepository.deleteById(ipId);
        log.info("IP eliminada: id={}", ipId);
    }
    
    private AdminUserDTO toDTO(AdminUser user) {
        AdminUserDTO dto = new AdminUserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole());
        dto.setActive(user.getActive());
        dto.setLastLogin(user.getLastLogin());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
    
    private AllowedIPDTO toIPDTO(AllowedAdminIP ip) {
        AllowedIPDTO dto = new AllowedIPDTO();
        dto.setId(ip.getId());
        dto.setDescription(ip.getDescription());
        dto.setActive(ip.getActive());
        dto.setCreatedAt(ip.getCreatedAt());
        
        // Desencriptar IP para mostrar
        try {
            if (ip.getIpAddressEncrypted() != null) {
                dto.setIpAddress(ipEncryptionService.decrypt(ip.getIpAddressEncrypted()));
            }
            if (ip.getIpRangeEncrypted() != null) {
                dto.setIpRange(ipEncryptionService.decrypt(ip.getIpRangeEncrypted()));
            }
        } catch (Exception e) {
            log.warn("Error desencriptando IP para mostrar: id={}", ip.getId(), e);
            dto.setIpAddress("Error al desencriptar");
            dto.setIpRange("Error al desencriptar");
        }
        
        return dto;
    }
}
