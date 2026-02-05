package co.com.fitel.modules.pqr.application.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para respuesta de PQR (para consulta pública y admin)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
}
