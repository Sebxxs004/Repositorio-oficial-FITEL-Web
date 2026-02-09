package co.com.fitel.modules.plans.application.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO para actualizar un plan existente
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePlanRequest {
    
    @NotBlank(message = "El nombre del plan es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String name;
    
    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    private String description;
    
    @NotNull(message = "La velocidad de Internet es obligatoria")
    @Min(value = 1, message = "La velocidad debe ser mayor a 0")
    private Integer internetSpeedMbps;
    
    @NotNull(message = "El número de canales es obligatorio")
    @Min(value = 1, message = "El número de canales debe ser mayor a 0")
    private Integer tvChannels;
    
    @NotNull(message = "El precio mensual es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    private BigDecimal monthlyPrice;
    
    private Boolean active;
    
    private Boolean popular;
    
    @Size(max = 50, message = "El tipo de plan no puede exceder 50 caracteres")
    private String planType;
    
    @Size(max = 500, message = "La URL de la imagen de fondo no puede exceder 500 caracteres")
    private String backgroundImage;
}
