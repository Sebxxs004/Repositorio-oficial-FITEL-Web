package co.com.fitel.modules.plans.application.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

/**
 * DTO para crear un nuevo plan
 */
public class CreatePlanRequest {
    
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
    
    // Precio opcional: null o 0 indica que el plan no muestra precio públicamente
    private BigDecimal monthlyPrice;
    
    private Boolean active = true;
    
    private Boolean popular = false;
    
    @Size(max = 50, message = "El tipo de plan no puede exceder 50 caracteres")
    private String planType;
    
    @Size(max = 500, message = "La URL de la imagen de fondo no puede exceder 500 caracteres")
    private String backgroundImage;

    public CreatePlanRequest() {}

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
