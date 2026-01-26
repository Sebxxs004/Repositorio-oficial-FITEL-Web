package co.com.fitel.modules.auth.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddIPRequest {
    private String ipAddress; // IP individual (opcional si es rango)
    private String ipRange; // Rango CIDR (opcional si es IP individual)
    private String description;
}
