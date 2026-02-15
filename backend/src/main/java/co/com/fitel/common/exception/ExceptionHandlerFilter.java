package co.com.fitel.common.exception;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * Filtro que atrapa excepciones ocurridas en la cadena de filtros de seguridad.
 * Se ejecuta antes que cualquier otro filtro.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class ExceptionHandlerFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            log.error("CRITICAL ERROR: Exception caught in Filter Chain", e);
            
            // Si la respuesta ya fue enviada, no podemos hacer nada
            if (response.isCommitted()) {
                log.warn("Response already committed, cannot write error response");
                return;
            }

            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            String stackTrace = sw.toString();

            // JSON manual simple para no depender de Jackson aquí si falla
            String jsonError = String.format("{\"error\": \"Internal Server Error\", \"message\": \"%s\", \"trace\": \"%s\"}", 
                e.getMessage().replace("\"", "'"), 
                stackTrace.replace("\n", "\\n").replace("\r", "").replace("\"", "'").replace("\t", "  "));

            response.getWriter().write(jsonError);
        }
    }
}
