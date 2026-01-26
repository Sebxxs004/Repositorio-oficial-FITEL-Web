package co.com.fitel.modules.auth.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AllowedIPDTO {
    private Long id;
    private String ipAddress; // IP desencriptada para mostrar
    private String ipRange; // Rango desencriptado para mostrar
    private String description;
    private Boolean active;
    private LocalDateTime createdAt;
}
