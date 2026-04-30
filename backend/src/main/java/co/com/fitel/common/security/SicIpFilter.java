package co.com.fitel.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
public class SicIpFilter extends OncePerRequestFilter {

    @Value("${fitel.sic.allowed-ips:}")
    private String allowedIpsConfig;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String path = request.getRequestURI();
        
        // Solo aplicar filtro a la ruta SOAP de la SIC
        if (path.startsWith("/ws/") || path.equals("/ws")) {
            String clientIp = getClientIp(request);
            
            if (allowedIpsConfig == null || allowedIpsConfig.trim().isEmpty()) {
                log.warn("No hay IPs configuradas para la SIC. Bloqueando acceso a {}", clientIp);
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied: Unconfigured IP Whitelist");
                return;
            }

            boolean isAllowed = java.util.Arrays.stream(allowedIpsConfig.split(","))
                .map(String::trim)
                .anyMatch(ip -> ip.equals(clientIp) || ip.equals("*"));
            
            System.out.println("DEBUG SIC FILTER -> Client IP: " + clientIp + " | Allowed: " + allowedIpsConfig + " | isAllowed: " + isAllowed);

            if (!isAllowed) {
                log.warn("Acceso denegado a la SIC desde IP no autorizada: {}", clientIp);
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied: IP not whitelisted");
                return;
            }
            
            log.debug("Acceso permitido a la SIC desde IP: {}", clientIp);
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
}
