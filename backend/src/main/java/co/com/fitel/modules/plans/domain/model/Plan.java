package co.com.fitel.modules.plans.domain.model;

import co.com.fitel.common.audit.AuditableEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;

/**
 * Entidad Plan
 * 
 * Módulo de Planes - Dominio
 * Implementa el principio de Responsabilidad Única (SRP)
 */
@Entity
@Table(name = "plans")
public class Plan extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Integer internetSpeedMbps;

    @Column(nullable = false)
    private Integer tvChannels;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyPrice;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    private Boolean popular = false;

    @Column(length = 50)
    private String planType; // BASIC, FAMILY, BUSINESS

    @Column(length = 500)
    private String backgroundImage; // URL o ruta de la imagen de fondo

    public Plan() {
    }

    public Plan(Long id, String name, String description, Integer internetSpeedMbps, Integer tvChannels, BigDecimal monthlyPrice, Boolean active, Boolean popular, String planType, String backgroundImage) {
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
    }

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
}
