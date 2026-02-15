package co.com.fitel.modules.plans.application.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

/**
 * DTO para actualizar un plan existente
 */
public class UpdatePlanRequest {
    
    @NotBlank(message = "El nombre del plan es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String name;
    
    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    private String description;
    
    @NotNull(message = "La velocidad de Internet es obligatoria")
    @Min(value = 1, message = "La velocidad debe ser mayor a 0")
    private Integer internetSpeedMbps;

    private Integer tvChannels;
    private BigDecimal monthlyPrice;
    private Boolean active;
    private Boolean popular;
    private String planType;
    private String backgroundImage;

    public UpdatePlanRequest() {}

    public UpdatePlanRequest(String name, String description, Integer internetSpeedMbps, Integer tvChannels, BigDecimal monthlyPrice, Boolean active, Boolean popular, String planType, String backgroundImage) {
        this.name = name;
        this.description = description;
        this.internetSpeedMbps = internetSpeedMbps;
        this.tvChannels = tvChannels;
        this.monthlyPrice = monthlyPrice;
        this.active = active;
        this.popular = popular;
        this.planType = planType;
        this.backgroundImage = backgroundImage;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getInternetSpeedMbps() { return internetSpeedMbps; }
    public void setInternetSpeedMbps(Integer internetSpeedMbps) { this.internetSpeedMbps = internetSpeedMbps; }
    public Integer getTvChannels() { return tvChannels; }
    public void setTvChannels(Integer tvChannels) { this.tvChannels = tvChannels; }
    public BigDecimal getMonthlyPrice() { return monthlyPrice; }
    public void setMonthlyPrice(BigDecimal monthlyPrice) { this.monthlyPrice = monthlyPrice; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public Boolean getPopular() { return popular; }
    public void setPopular(Boolean popular) { this.popular = popular; }
    public String getPlanType() { return planType; }
    public void setPlanType(String planType) { this.planType = planType; }
    public String getBackgroundImage() { return backgroundImage; }
    public void setBackgroundImage(String backgroundImage) { this.backgroundImage = backgroundImage; }
}
