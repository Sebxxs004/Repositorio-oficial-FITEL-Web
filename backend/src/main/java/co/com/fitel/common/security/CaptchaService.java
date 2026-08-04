package co.com.fitel.common.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

/**
 * Servicio de verificación de CAPTCHA usando Cloudflare Turnstile.
 */
@Slf4j
@Service
public class CaptchaService {

    @Value("${fitel.captcha.secret-key:}")
    private String captchaSecretKey;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    /**
     * Verifica un token de CAPTCHA.
     * Si no hay llave secreta configurada (desarrollo/testing), permite el paso registrando un warning.
     */
    public boolean verifyToken(String token) {
        if (captchaSecretKey == null || captchaSecretKey.trim().isEmpty()) {
            log.warn("[SECURITY] Captcha key no configurada. Saltándose verificación de seguridad.");
            return true;
        }

        if (token == null || token.trim().isEmpty()) {
            log.warn("[SECURITY] Intento de envío de formulario sin token de Captcha.");
            return false;
        }

        try {
            Map<String, String> params = new HashMap<>();
            params.put("secret", captchaSecretKey);
            params.put("response", token);

            // Realizar llamada REST al endpoint de Cloudflare
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(
                VERIFY_URL + "?secret={secret}&response={response}",
                null,
                Map.class,
                params
            );

            boolean success = response != null && Boolean.TRUE.equals(response.get("success"));
            if (!success) {
                log.warn("[SECURITY] Verificación de Captcha fallida. Proveedor respondió: {}", response);
            }
            return success;
        } catch (Exception e) {
            log.error("[SECURITY] Error al conectar con el servidor de verificación de Captcha: {}", e.getMessage(), e);
            // Dependiendo de la política se puede denegar (default) o permitir para no bloquear usuarios si CF se cae.
            return false;
        }
    }
}
