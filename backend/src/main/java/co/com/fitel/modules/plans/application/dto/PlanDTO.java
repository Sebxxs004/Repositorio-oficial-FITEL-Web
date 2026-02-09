package co.com.fitel.modules.plans.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para Plan
 * 
 * Implementa el principio de Separación de Intereses (SoC) - separa la capa de dominio de la API
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanDTO {
    private Long id;
    private String name;
    private String description;
    private Integer internetSpeedMbps;
    private Integer tvChannels;
    private BigDecimal monthlyPrice;
    private Boolean active;
    private Boolean popular;
    private String planType;
    private String backgroundImage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
