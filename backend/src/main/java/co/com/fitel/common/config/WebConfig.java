package co.com.fitel.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración web global
 * 
 * Implementa el principio de Abierto/Cerrado (OCP) - abierto para extensión
 */
@Configuration
public class WebConfig implements WebMvcConfigurer, Ordered {

    /**
     * Configuración de recursos estáticos
     * Excluye explícitamente /api/** del manejo de recursos estáticos
     * para asegurar que los endpoints REST tengan prioridad
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // NO configurar recursos estáticos para /api/**
        // Los controladores REST manejarán estas rutas
        // Solo configurar recursos estáticos para otras rutas si es necesario
        // Por defecto, Spring Boot ya maneja recursos estáticos correctamente
    }

    /**
     * Establece un orden bajo para que los controladores REST se registren primero
     */
    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE;
    }
}
