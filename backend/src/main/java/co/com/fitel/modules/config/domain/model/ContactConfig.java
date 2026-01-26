package co.com.fitel.modules.config.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "contact_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
