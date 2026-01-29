package co.com.fitel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Aplicación principal de Spring Boot para FITEL Web
 * 
 * Arquitectura modular siguiendo principios SOLID:
 * - Separación de responsabilidades por módulos
 * - Inversión de dependencias
 * - Abierto para extensión, cerrado para modificación
 */
@SpringBootApplication(scanBasePackages = "co.com.fitel")
@EnableJpaAuditing
public class FitelWebApplication {

    public static void main(String[] args) {
        SpringApplication.run(FitelWebApplication.class, args);
        System.out.println("FITEL Web Application started");
    }
}
