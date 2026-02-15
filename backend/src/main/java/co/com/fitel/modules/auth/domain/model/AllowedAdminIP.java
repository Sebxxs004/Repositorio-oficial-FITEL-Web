package co.com.fitel.modules.auth.domain.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * Entidad para IPs permitidas para acceso al panel de administración
 */
@Entity
@Table(name = "allowed_admin_ips")
public class AllowedAdminIP {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(columnDefinition = "VARBINARY(128)")
    private byte[] ipAddressEncrypted;
    
    @Column(columnDefinition = "VARBINARY(128)")
    private byte[] ipRangeEncrypted; // Para rangos CIDR (ej: 192.168.1.0/24)
    
    @Column(length = 64, unique = true)
    private String ipHash; // Hash SHA-256 para búsquedas rápidas
    
    @Column(length = 64, unique = true)
    private String rangeHash; // Hash SHA-256 del rango
    
    @Column(length = 255)
    private String description;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(length = 100)
    private String createdBy;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    /**
     * Getters y setters para IPs desencriptadas (solo para uso interno)
     * No se persisten, solo para facilitar el trabajo con la entidad
     */
    @Transient
    private transient String ipAddress;
    
    @Transient
    private transient String ipRange;
    
    public String getIpAddress() {
        return ipAddress;
    }
    
    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }
    
    public String getIpRange() {
        return ipRange;
    }
    
    public void setIpRange(String ipRange) {
        this.ipRange = ipRange;
    }
    
    /**
     * Verifica si una IP coincide con este registro
     * Requiere el servicio de encriptación para desencriptar
     */
    public boolean matches(String ip, co.com.fitel.modules.auth.application.service.IPEncryptionService encryptionService) {
        // Si es una IP exacta encriptada
        if (ipAddressEncrypted != null && ipHash != null) {
            return encryptionService.matches(ip, ipAddressEncrypted, ipHash);
        }
        
        // Si es un rango CIDR encriptado
        if (ipRangeEncrypted != null && rangeHash != null) {
            try {
                String decryptedRange = encryptionService.decrypt(ipRangeEncrypted);
                return matchesCIDR(ip, decryptedRange);
            } catch (Exception e) {
                return false;
            }
        }
        
        return false;
    }
    
    /**
     * Verificación básica de CIDR
     */
    private boolean matchesCIDR(String ip, String cidr) {
        try {
            String[] parts = cidr.split("/");
            String network = parts[0];
            int prefixLength = Integer.parseInt(parts[1]);
            
            // Verificación simplificada: comparar prefijo
            String[] networkParts = network.split("\\.");
            String[] ipParts = ip.split("\\.");
            
            int octetsToCheck = Math.min(prefixLength / 8, 4);
            for (int i = 0; i < octetsToCheck; i++) {
                if (i >= networkParts.length || i >= ipParts.length) {
                    return false;
                }
                if (!networkParts[i].equals(ipParts[i])) {
                    return false;
                }
            }
            
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public AllowedAdminIP() {}
    
    public AllowedAdminIP(Long id, byte[] ipAddressEncrypted, byte[] ipRangeEncrypted, String ipHash, String rangeHash, String description, Boolean active, LocalDateTime createdAt, LocalDateTime updatedAt, String ipAddress, String ipRange) {
        this.id = id;
        this.ipAddressEncrypted = ipAddressEncrypted;
        this.ipRangeEncrypted = ipRangeEncrypted;
        this.ipHash = ipHash;
        this.rangeHash = rangeHash;
        this.description = description;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.ipAddress = ipAddress;
        this.ipRange = ipRange;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public byte[] getIpAddressEncrypted() { return ipAddressEncrypted; }
    public void setIpAddressEncrypted(byte[] ipAddressEncrypted) { this.ipAddressEncrypted = ipAddressEncrypted; }
    public byte[] getIpRangeEncrypted() { return ipRangeEncrypted; }
    public void setIpRangeEncrypted(byte[] ipRangeEncrypted) { this.ipRangeEncrypted = ipRangeEncrypted; }
    public String getIpHash() { return ipHash; }
    public void setIpHash(String ipHash) { this.ipHash = ipHash; }
    public String getRangeHash() { return rangeHash; }
    public void setRangeHash(String rangeHash) { this.rangeHash = rangeHash; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    // ipAddress and ipRange getters/setters are already defined above
}
