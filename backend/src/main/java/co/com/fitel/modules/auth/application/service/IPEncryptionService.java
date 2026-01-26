package co.com.fitel.modules.auth.application.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

/**
 * Servicio para encriptar/desencriptar IPs
 * Usa AES-256 para encriptación simétrica
 */
@Service
@Slf4j
public class IPEncryptionService {
    
    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES";
    
    @Value("${spring.security.ip.encryption.key:${IP_ENCRYPTION_KEY:FITEL-IP-ENC-KEY-32CHARS-LONG!!}}")
    private String encryptionKey;
    
    /**
     * Genera una clave AES de 32 bytes desde la clave de configuración
     */
    private SecretKeySpec getSecretKey() {
        try {
            MessageDigest sha = MessageDigest.getInstance("SHA-256");
            byte[] key = encryptionKey.getBytes(StandardCharsets.UTF_8);
            key = sha.digest(key);
            // AES-256 requiere 32 bytes
            byte[] key256 = new byte[32];
            System.arraycopy(key, 0, key256, 0, Math.min(key.length, 32));
            return new SecretKeySpec(key256, ALGORITHM);
        } catch (Exception e) {
            log.error("Error generando clave de encriptación", e);
            throw new RuntimeException("Error en configuración de encriptación", e);
        }
    }
    
    /**
     * Encripta una IP o rango
     */
    public byte[] encrypt(String ip) {
        try {
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.ENCRYPT_MODE, getSecretKey());
            return cipher.doFinal(ip.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            log.error("Error encriptando IP: {}", ip, e);
            throw new RuntimeException("Error encriptando IP", e);
        }
    }
    
    /**
     * Desencripta una IP o rango
     */
    public String decrypt(byte[] encryptedIp) {
        try {
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.DECRYPT_MODE, getSecretKey());
            byte[] decrypted = cipher.doFinal(encryptedIp);
            return new String(decrypted, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Error desencriptando IP", e);
            throw new RuntimeException("Error desencriptando IP", e);
        }
    }
    
    /**
     * Genera hash SHA-256 de una IP para búsquedas rápidas
     */
    public String generateHash(String ip) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(ip.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            log.error("Error generando hash de IP: {}", ip, e);
            throw new RuntimeException("Error generando hash", e);
        }
    }
    
    /**
     * Verifica si una IP coincide con una IP encriptada
     */
    public boolean matches(String ip, byte[] encryptedIp, String hash) {
        // Primero verificar hash (rápido)
        String ipHash = generateHash(ip);
        if (!ipHash.equals(hash)) {
            return false;
        }
        
        // Si el hash coincide, desencriptar y verificar (más lento pero seguro)
        try {
            String decrypted = decrypt(encryptedIp);
            return ip.equals(decrypted);
        } catch (Exception e) {
            log.warn("Error verificando IP encriptada", e);
            return false;
        }
    }
}
