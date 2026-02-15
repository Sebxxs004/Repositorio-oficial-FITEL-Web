package co.com.fitel.modules.pqr.application.dto;

import jakarta.validation.constraints.Size;

/**
 * DTO para actualizar una PQR desde el panel admin
 */
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

    public UpdatePQRRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getResponsibleArea() { return responsibleArea; }
    public void setResponsibleArea(String responsibleArea) { this.responsibleArea = responsibleArea; }
    public String getRealType() { return realType; }
    public void setRealType(String realType) { this.realType = realType; }
    public String getInternalNotes() { return internalNotes; }
    public void setInternalNotes(String internalNotes) { this.internalNotes = internalNotes; }
    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }
    public Boolean getSkipStatusChangeEmail() { return skipStatusChangeEmail; }
    public void setSkipStatusChangeEmail(Boolean skipStatusChangeEmail) { this.skipStatusChangeEmail = skipStatusChangeEmail; }
    public Boolean getSkipResponseEmail() { return skipResponseEmail; }
    public void setSkipResponseEmail(Boolean skipResponseEmail) { this.skipResponseEmail = skipResponseEmail; }
}
