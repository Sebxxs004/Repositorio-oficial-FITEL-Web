package co.com.fitel.modules.auth.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordConfirmRequest {
    
    @NotBlank(message = "El código es requerido")
    private String verificationCode;
    
    @NotBlank(message = "La nueva contraseña es requerida")
    private String newPassword;
}
