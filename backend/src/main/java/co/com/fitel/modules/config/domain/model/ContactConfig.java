package co.com.fitel.modules.config.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "contact_config")
public class ContactConfig {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "phone", nullable = false, length = 20)
    private String phone;
    
    @Column(name = "phone_display", nullable = false, length = 30)
    private String phoneDisplay;
    
    @Column(name = "email", nullable = false)
    private String email;
    
    @Column(name = "whatsapp", nullable = false, length = 20)
    private String whatsapp;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public ContactConfig() {}

    public ContactConfig(Long id, String phone, String phoneDisplay, String email, String whatsapp, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.phone = phone;
        this.phoneDisplay = phoneDisplay;
        this.email = email;
        this.whatsapp = whatsapp;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getPhoneDisplay() { return phoneDisplay; }
    public void setPhoneDisplay(String phoneDisplay) { this.phoneDisplay = phoneDisplay; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
