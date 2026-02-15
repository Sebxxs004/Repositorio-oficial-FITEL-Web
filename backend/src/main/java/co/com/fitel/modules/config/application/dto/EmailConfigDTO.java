package co.com.fitel.modules.config.application.dto;

public class EmailConfigDTO {
    private String email;
    private String appPassword; // Solo para actualización, no se devuelve en lectura
    private String smtpHost;
    private Integer smtpPort;
    private Boolean enabled;

    public EmailConfigDTO() {}

    public EmailConfigDTO(String email, String appPassword, String smtpHost, Integer smtpPort, Boolean enabled) {
        this.email = email;
        this.appPassword = appPassword;
        this.smtpHost = smtpHost;
        this.smtpPort = smtpPort;
        this.enabled = enabled;
    }

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAppPassword() { return appPassword; }
    public void setAppPassword(String appPassword) { this.appPassword = appPassword; }
    public String getSmtpHost() { return smtpHost; }
    public void setSmtpHost(String smtpHost) { this.smtpHost = smtpHost; }
    public Integer getSmtpPort() { return smtpPort; }
    public void setSmtpPort(Integer smtpPort) { this.smtpPort = smtpPort; }
    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}
