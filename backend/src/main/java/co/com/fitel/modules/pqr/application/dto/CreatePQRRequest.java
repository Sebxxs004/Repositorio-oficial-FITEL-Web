package co.com.fitel.modules.pqr.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para crear una nueva PQR desde el frontend
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePQRRequest {
    
    @NotBlank(message = "El tipo de PQR es requerido")
    @Size(max = 20)
    private String type; // PETICION, QUEJA, RECURSO
    
    @NotBlank(message = "El nombre completo es requerido")
    @Size(max = 200)
    private String customerName;
    
    @NotBlank(message = "El email es requerido")
    @Email(message = "El email debe ser válido")
    @Size(max = 255)
    private String customerEmail;
    
    @NotBlank(message = "El teléfono es requerido")
    @Size(max = 20)
    private String customerPhone;
    
    @NotBlank(message = "El tipo de documento es requerido")
    @Size(max = 20)
    private String customerDocumentType; // CC, NIT, CE, etc.
    
    @NotBlank(message = "El número de documento es requerido")
    @Size(max = 50)
    private String customerDocumentNumber;
    
    @Size(max = 500)
    private String customerAddress;
    
    @NotBlank(message = "El asunto es requerido")
    @Size(max = 500)
    private String subject;
    
    @NotBlank(message = "La descripción es requerida")
    @Size(min = 20, message = "La descripción debe tener al menos 20 caracteres")
    private String description;
    
    @Size(max = 50)
    private String resourceType; // Tipo de recurso (si aplica)
    
    @Size(max = 500)
    private String expectedResolution; // Resolución esperada (opcional)
}
