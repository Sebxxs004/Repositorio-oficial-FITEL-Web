package co.com.fitel.common.security;

import co.com.fitel.modules.auth.application.service.JwtService;
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
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

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

        // Si no hay JWT en header ni en cookies, continuar sin autenticar
        if (jwt == null) {
            filterChain.doFilter(request, response);
            return;
        }
        // Si no hay JWT en header ni en cookies, continuar sin autenticar
        if (jwt == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // Validar y procesar el JWT
        try {
            if (jwtService.validateToken(jwt)) {
                Claims claims = jwtService.getClaims(jwt);
                username = claims.getSubject();
                String role = claims.get("role", String.class);

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    List<GrantedAuthority> authorities = new ArrayList<>();
                    if (role != null) {
                        // Spring Security usually expects roles to prevent with custom authority checks
                        // Using hasAuthority instead of hasRole gives more flexibility if prefix isn't standard
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
