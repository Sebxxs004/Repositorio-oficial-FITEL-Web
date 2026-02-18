package co.com.fitel.modules.pqr.application.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para la constancia de radicación de PQR
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PQRConstancyDTO {
    
    private String cun;
    private String customerName;
    private String type;
    private String subject;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime radicationDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime maxResponseDate;
    
    // Texto legal sobre silencio administrativo
    private String silenceAdministrativeText;
}
