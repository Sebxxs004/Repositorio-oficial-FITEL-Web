package co.com.fitel.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * Filtro de Rate Limiting para evitar abusos en endpoints públicos críticos.
 * Implementa el algoritmo Token Bucket de forma atómica y por IP de cliente.
 */
@Slf4j
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static class TokenBucket {
        private final double capacity;
        private final double refillRatePerSecond;
        private double tokens;
        private long lastRefillTimestamp;

        public TokenBucket(double capacity, double refillRatePerSecond) {
            this.capacity = capacity;
            this.refillRatePerSecond = refillRatePerSecond;
            this.tokens = capacity;
            this.lastRefillTimestamp = System.nanoTime();
        }

        public synchronized boolean tryConsume() {
            refill();
            if (tokens >= 1.0) {
                tokens -= 1.0;
                return true;
            }
            return false;
        }

        private void refill() {
            long now = System.nanoTime();
            long elapsedNanos = now - lastRefillTimestamp;
            double elapsedSeconds = (double) elapsedNanos / TimeUnit.SECONDS.toNanos(1);
            if (elapsedSeconds > 0) {
                tokens = Math.min(capacity, tokens + (elapsedSeconds * refillRatePerSecond));
                lastRefillTimestamp = now;
            }
        }
    }

    // Estructuras en memoria por IP del cliente
    private final Map<String, TokenBucket> loginBuckets = new ConcurrentHashMap<>();
    private final Map<String, TokenBucket> formBuckets = new ConcurrentHashMap<>();

    // Límites de peticiones:
    // Login: capacidad máxima 5 intentos, recupera 1 intento cada 10 segundos
    private static final double LOGIN_CAPACITY = 5.0;
    private static final double LOGIN_REFILL_RATE = 0.1; 

    // Formularios (Contacto y creación de PQR): capacidad máxima 3 peticiones, recupera 1 petición cada 30 segundos
    private static final double FORM_CAPACITY = 3.0;
    private static final double FORM_REFILL_RATE = 1.0 / 30.0; 

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        if ("POST".equalsIgnoreCase(method)) {
            String clientIp = getClientIp(request);

            if (path.equals("/api/auth/admin/login")) {
                TokenBucket bucket = loginBuckets.computeIfAbsent(clientIp, 
                    ip -> new TokenBucket(LOGIN_CAPACITY, LOGIN_REFILL_RATE));
                if (!bucket.tryConsume()) {
                    log.warn("[SECURITY] Rate limit excedido para LOGIN de la IP: {}", clientIp);
                    sendTooManyRequestsResponse(response, "Demasiados intentos de inicio de sesión. Por favor intenta más tarde.");
                    return;
                }
            } else if (path.startsWith("/api/pqrs") || path.startsWith("/api/contact")) {
                TokenBucket bucket = formBuckets.computeIfAbsent(clientIp, 
                    ip -> new TokenBucket(FORM_CAPACITY, FORM_REFILL_RATE));
                if (!bucket.tryConsume()) {
                    log.warn("[SECURITY] Rate limit excedido para ENVÍO DE FORMULARIOS de la IP: {}", clientIp);
                    sendTooManyRequestsResponse(response, "Límite de envíos excedido. Por favor espera un momento antes de enviar otra solicitud.");
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isEmpty()) {
            return xfHeader.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private void sendTooManyRequestsResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(String.format("{\"success\":false,\"message\":\"%s\",\"data\":null}", message));
    }
}
