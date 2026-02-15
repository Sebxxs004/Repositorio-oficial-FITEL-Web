package co.com.fitel.modules.pqr.application.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

/**
 * DTO para respuesta de PQR (para consulta pública y admin)
 */
public class PQRResponseDTO {
    
    private Long id;
    private String cun;
    private String type;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String customerDocumentType;
    private String customerDocumentNumber;
    private String customerAddress;
    private String subject;
    private String description;
    private String status;
    private String priority;
    private String responsibleArea;
    private String realType;
    private String resourceType;
    private String internalNotes;
    private String response;
    private String responseAttachmentPath;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime responseDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime resolutionDate;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime slaDeadline;

    public PQRResponseDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCun() { return cun; }
    public void setCun(String cun) { this.cun = cun; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
    public String getCustomerDocumentType() { return customerDocumentType; }
    public void setCustomerDocumentType(String customerDocumentType) { this.customerDocumentType = customerDocumentType; }
    public String getCustomerDocumentNumber() { return customerDocumentNumber; }
    public void setCustomerDocumentNumber(String customerDocumentNumber) { this.customerDocumentNumber = customerDocumentNumber; }
    public String getCustomerAddress() { return customerAddress; }
    public void setCustomerAddress(String customerAddress) { this.customerAddress = customerAddress; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getResponsibleArea() { return responsibleArea; }
    public void setResponsibleArea(String responsibleArea) { this.responsibleArea = responsibleArea; }
    public String getRealType() { return realType; }
    public void setRealType(String realType) { this.realType = realType; }
    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }
    public String getInternalNotes() { return internalNotes; }
    public void setInternalNotes(String internalNotes) { this.internalNotes = internalNotes; }
    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }
    public String getResponseAttachmentPath() { return responseAttachmentPath; }
    public void setResponseAttachmentPath(String responseAttachmentPath) { this.responseAttachmentPath = responseAttachmentPath; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public LocalDateTime getResponseDate() { return responseDate; }
    public void setResponseDate(LocalDateTime responseDate) { this.responseDate = responseDate; }
    public LocalDateTime getResolutionDate() { return resolutionDate; }
    public void setResolutionDate(LocalDateTime resolutionDate) { this.resolutionDate = resolutionDate; }
    public LocalDateTime getSlaDeadline() { return slaDeadline; }
    public void setSlaDeadline(LocalDateTime slaDeadline) { this.slaDeadline = slaDeadline; }
}
