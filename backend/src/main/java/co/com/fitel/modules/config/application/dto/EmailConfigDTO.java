package co.com.fitel.modules.config.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailConfigDTO {
    private String email;
    private String appPassword; // Solo para actualización, no se devuelve en lectura
    private String smtpHost;
    private Integer smtpPort;
    private Boolean enabled;
}
