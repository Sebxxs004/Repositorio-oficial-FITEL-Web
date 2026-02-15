package co.com.fitel.modules.pqr.application.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

/**
 * DTO para la constancia de radicación de PQR
 */
public class PQRConstancyDTO {
    
    private String cun;
    private String customerName;
    private String type;
    private String subject;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime radicationDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDateTime maxResponseDate;
    
    // Texto legal sobre silencio administrativo
    private String silenceAdministrativeText;

    public PQRConstancyDTO() {}

    public PQRConstancyDTO(String cun, String customerName, String type, String subject, LocalDateTime radicationDate, LocalDateTime maxResponseDate, String silenceAdministrativeText) {
        this.cun = cun;
        this.customerName = customerName;
        this.type = type;
        this.subject = subject;
        this.radicationDate = radicationDate;
        this.maxResponseDate = maxResponseDate;
        this.silenceAdministrativeText = silenceAdministrativeText;
    }

    public String getCun() { return cun; }
    public void setCun(String cun) { this.cun = cun; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public LocalDateTime getRadicationDate() { return radicationDate; }
    public void setRadicationDate(LocalDateTime radicationDate) { this.radicationDate = radicationDate; }
    public LocalDateTime getMaxResponseDate() { return maxResponseDate; }
    public void setMaxResponseDate(LocalDateTime maxResponseDate) { this.maxResponseDate = maxResponseDate; }
    public String getSilenceAdministrativeText() { return silenceAdministrativeText; }
    public void setSilenceAdministrativeText(String silenceAdministrativeText) { this.silenceAdministrativeText = silenceAdministrativeText; }
}
