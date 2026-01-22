package co.com.fitel.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Excepción de negocio personalizada
 * 
 * Implementa el principio de Abierto/Cerrado (OCP) - extensible para diferentes tipos de errores
 */
public class BusinessException extends RuntimeException {
    
    private final HttpStatus status;

    public BusinessException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public BusinessException(String message, HttpStatus status, Throwable cause) {
        super(message, cause);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
