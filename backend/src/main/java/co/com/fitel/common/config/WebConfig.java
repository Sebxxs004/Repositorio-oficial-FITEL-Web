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
     * Mapea URLs /assets/** a archivos en el sistema de archivos
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Mapear solicitudes a /assets/** a la carpeta de cargas
        registry.addResourceHandler("/assets/**")
                .addResourceLocations("file:uploads/assets/");
                
        // Mapear solicitudes a /uploads/** a la carpeta raíz de cargas
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }

    /**
     * Establece un orden bajo para que los controladores REST se registren primero
     */
    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE;
    }
}
