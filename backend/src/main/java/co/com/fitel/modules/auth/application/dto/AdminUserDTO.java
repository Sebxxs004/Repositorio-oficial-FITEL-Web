package co.com.fitel.modules.auth.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDTO {
    private Long id;
    private String username;
    private String fullName;
    private String role;
    private Boolean active;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
}
