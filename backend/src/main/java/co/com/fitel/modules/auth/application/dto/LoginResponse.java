package co.com.fitel.modules.auth.application.dto;

/**
 * DTO para respuesta de login
 */
public class LoginResponse {
    private String token;
    private String sessionToken;
    private String username;
    private String fullName;
    private String role;
    private String message;

    public LoginResponse() {}

    public LoginResponse(String token, String sessionToken, String username, String fullName, String role, String message) {
        this.token = token;
        this.sessionToken = sessionToken;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
        this.message = message;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getSessionToken() { return sessionToken; }
    public void setSessionToken(String sessionToken) { this.sessionToken = sessionToken; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
