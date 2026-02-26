package co.com.fitel.common.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro que antepone /api al path cuando NEXT_PUBLIC_API_URL está configurado
 * en Azure sin el sufijo /api.
 *
 * Ejemplo: GET /pqrs  →  GET /api/pqrs
 *          POST /contact → POST /api/contact
 *
 * Corre antes del SecurityFilterChain (HIGHEST_PRECEDENCE) para que
 * Spring Security evalúe el path ya reescrito y los controladores respondan
 * con sus mappings existentes (/api/**).
 *
 * Rutas excluidas de la reescritura:
 *   - /api/**      (ya tiene el prefijo correcto)
 *   - /uploads/**  (archivos estáticos del storage local)
 *   - /actuator/** (health checks de Azure)
 *   - /           (raíz)
 */
@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ApiPrefixRewriteFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        if (needsRewrite(path)) {
            String newPath = "/api" + path;
            log.debug("ApiPrefixRewrite: {} {} → {}", request.getMethod(), path, newPath);

            HttpServletRequest wrapped = new HttpServletRequestWrapper(request) {
                @Override
                public String getRequestURI() {
                    return newPath;
                }

                @Override
                public String getServletPath() {
                    return newPath;
                }
            };

            filterChain.doFilter(wrapped, response);
        } else {
            filterChain.doFilter(request, response);
        }
    }

    /**
     * Determina si el path necesita que se le añada /api delante.
     */
    private boolean needsRewrite(String path) {
        if (path == null || path.equals("/")) return false;
        if (path.startsWith("/api/") || path.equals("/api")) return false;
        if (path.startsWith("/uploads/")) return false;
        if (path.startsWith("/actuator/")) return false;
        // Recursos estáticos de Spring Boot
        if (path.startsWith("/static/") || path.startsWith("/public/static/")) return false;
        // Llamadas de Next.js que podrían llegar al backend accidentalmente
        if (path.startsWith("/_next/")) return false;
        if (path.equals("/favicon.ico")) return false;
        return true;
    }
}
