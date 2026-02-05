package co.com.fitel.modules.pqr.application.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para actualizar una PQR desde el panel admin
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePQRRequest {
    
    @Size(max = 50)
    private String status; // RECIBIDA, EN_ANALISIS, EN_RESPUESTA, RESUELTA, CERRADA
    
    @Size(max = 20)
    private String priority; // BAJA, NORMAL, ALTA, URGENTE
    
    @Size(max = 100)
    private String responsibleArea; // soporte, facturacion, tecnica
    
    @Size(max = 20)
    private String realType; // Tipo real asignado por operador
    
    @Size(max = 500)
    private String internalNotes; // Notas internas
    
    @Size(max = 5000)
    private String response; // Respuesta formal
    
    private Boolean skipStatusChangeEmail; // Si es true, no se envía correo de cambio de estado
    
    private Boolean skipResponseEmail; // Si es true, no se envía correo de respuesta
}
