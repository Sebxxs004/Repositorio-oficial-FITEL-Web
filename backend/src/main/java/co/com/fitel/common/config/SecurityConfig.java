package co.com.fitel.common.config;

import co.com.fitel.common.exception.ExceptionHandlerFilter;
import co.com.fitel.common.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;

/**
 * Configuración de seguridad
 * 
 * Implementa el principio de Responsabilidad Única (SRP) - solo maneja seguridad
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private ExceptionHandlerFilter exceptionHandlerFilter;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(java.util.Arrays.asList("*"));
        configuration.setAllowedMethods(java.util.Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(java.util.Arrays.asList("*"));
        configuration.setExposedHeaders(java.util.Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .addFilterBefore(exceptionHandlerFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                // Permitir explícitamente pre-flight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // Endpoints Públicos (Login, Frontend público, Archivos)
                .requestMatchers("/api/auth/admin/login").permitAll()
                .requestMatchers("/api/auth/admin/verify").permitAll() // Verificación de email/cuenta si aplica
                .requestMatchers("/api/auth/admin/forgot-password").permitAll() // Solicitar recuperación de contraseña
                .requestMatchers("/api/auth/admin/validate-reset-token").permitAll() // Validar token de recuperación
                .requestMatchers("/api/auth/admin/reset-password").permitAll() // Resetear contraseña con token
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/channels").permitAll() // Canales públicos
                .requestMatchers("/api/contact").permitAll() // Formulario de contacto público
                .requestMatchers("/api/pqrs/**").permitAll() // Creación pública de PQR
                .requestMatchers("/uploads/**").permitAll() // Acceso a imágenes/archivos

                // Endpoints Compartidos (ADMIN y OPERARIO)
                .requestMatchers("/api/admin/dashboard/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_OPERARIO")
                .requestMatchers("/api/admin/pqrs/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_OPERARIO") // Gestión de PQRs
                .requestMatchers("/api/auth/admin/me").authenticated() // Obtener usuario actual
                .requestMatchers("/api/auth/admin/logout").authenticated()
                .requestMatchers("/api/auth/admin/change-password/**").authenticated() // Cambiar contraseña (todos los usuarios autenticados)

                // Endpoints Exclusivos de Administrador (ADMIN)
                .requestMatchers("/api/admin/users/**").hasAuthority("ROLE_ADMIN") // Gestión de usuarios (Crear, listar, borrar)
                .requestMatchers("/api/admin/channels/**").hasAuthority("ROLE_ADMIN") // Gestión de canales
                .requestMatchers("/api/admin/plans/**").hasAuthority("ROLE_ADMIN") // Gestión de planes
                .requestMatchers("/api/config/**").hasAuthority("ROLE_ADMIN") // Configuración general
                .requestMatchers("/api/admin/ips/**").hasAuthority("ROLE_ADMIN") // Gestión de IPs permitidas

                // Cualquier otra petición debe estar autenticada
                .anyRequest().authenticated()
            )
            // Deshabilitar login por formulario y http basic explícitamente para evitar redirecciones
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()));

        return http.build();
    }
}
