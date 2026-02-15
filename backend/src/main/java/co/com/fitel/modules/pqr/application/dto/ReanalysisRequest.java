package co.com.fitel.modules.pqr.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para solicitar reanálisis de una PQR
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReanalysisRequest {
    
    @NotBlank(message = "El motivo es requerido")
    @Size(min = 20, max = 2000, message = "El motivo debe tener entre 20 y 2000 caracteres")
    private String reason;
}
