package co.com.fitel.modules.plans.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para Plan
 * 
 * Implementa el principio de Separación de Intereses (SoC) - separa la capa de dominio de la API
 */
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

    public PlanDTO() {}

    public PlanDTO(Long id, String name, String description, Integer internetSpeedMbps, Integer tvChannels, BigDecimal monthlyPrice, Boolean active, Boolean popular, String planType, String backgroundImage, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.internetSpeedMbps = internetSpeedMbps;
        this.tvChannels = tvChannels;
        this.monthlyPrice = monthlyPrice;
        this.active = active;
        this.popular = popular;
        this.planType = planType;
        this.backgroundImage = backgroundImage;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
