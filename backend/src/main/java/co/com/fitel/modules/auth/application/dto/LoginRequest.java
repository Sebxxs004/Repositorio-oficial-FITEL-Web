package co.com.fitel.modules.auth.application.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO para solicitud de login
 */
public class LoginRequest {
    
    @NotBlank(message = "El usuario es requerido")
    private String username;
    
    @NotBlank(message = "La contraseña es requerida")
    private String password;

    public LoginRequest() {}

    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
