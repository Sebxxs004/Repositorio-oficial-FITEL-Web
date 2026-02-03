package co.com.fitel.modules.config.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para el formulario de contacto desde el frontend
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactFormRequest {
    
    @NotBlank(message = "El nombre es requerido")
    @Size(max = 200, message = "El nombre no puede exceder 200 caracteres")
    private String name;
    
    @NotBlank(message = "El email es requerido")
    @Email(message = "El email debe ser válido")
    @Size(max = 255, message = "El email no puede exceder 255 caracteres")
    private String email;
    
    @NotBlank(message = "El teléfono es requerido")
    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    private String phone;
    
    @NotBlank(message = "El asunto es requerido")
    @Size(max = 100, message = "El asunto no puede exceder 100 caracteres")
    private String subject;
    
    @NotBlank(message = "El mensaje es requerido")
    @Size(min = 10, message = "El mensaje debe tener al menos 10 caracteres")
    @Size(max = 2000, message = "El mensaje no puede exceder 2000 caracteres")
    private String message;
}
