package co.com.fitel.modules.config.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailConfig {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "email", nullable = false, length = 255)
    private String email;
    
    @Column(name = "app_password", nullable = false, length = 100)
    private String appPassword;
    
    @Column(name = "smtp_host", length = 100)
    private String smtpHost = "smtp.gmail.com";
    
    @Column(name = "smtp_port")
    private Integer smtpPort = 587;
    
    @Column(name = "enabled")
    private Boolean enabled = true;
    
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
}
