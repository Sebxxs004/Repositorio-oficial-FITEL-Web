package co.com.fitel.common.security;

import co.com.fitel.modules.auth.application.service.JwtService;
import co.com.fitel.modules.auth.domain.model.AdminUser;
import co.com.fitel.modules.auth.domain.repository.AdminUserRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final AdminUserRepository adminUserRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String jwt = null;
        final String username;

        // Primero intentar obtener el JWT del header Authorization
        final String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
        }

        // Si no está en el header, buscar en las cookies
        if (jwt == null && request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("admin_token".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    log.debug("JWT encontrado en cookie: admin_token");
                    break;
                }
            }
        }

        if (jwt == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            if (jwtService.validateToken(jwt)) {
                Claims claims = jwtService.getClaims(jwt);
                username = claims.getSubject();

                // Verificar si las sesiones del usuario han sido revocadas
                if (username != null) {
                    Optional<AdminUser> userOpt = adminUserRepository.findByUsername(username);
                    if (userOpt.isPresent() && userOpt.get().getSessionRevokedAt() != null) {
                        LocalDateTime tokenIssuedAt = jwtService.getIssuedAt(jwt);
                        if (tokenIssuedAt.isBefore(userOpt.get().getSessionRevokedAt())) {
                            log.warn("[SECURITY] Token revocado para usuario '{}', emitido en: {}", username, tokenIssuedAt);
                            filterChain.doFilter(request, response);
                            return;
                        }
                    }
                }

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    String role = claims.get("role", String.class);
                    List<GrantedAuthority> authorities = new ArrayList<>();
                    if (role != null) {
                        authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
                    }

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            authorities
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.debug("Usuario autenticado: {}, Rol: {}", username, role);
                }
            }
        } catch (Exception e) {
            log.error("Error al autenticar usuario: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}