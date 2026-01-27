package co.com.fitel.common.service;

import co.com.fitel.modules.config.domain.model.EmailConfig;
import co.com.fitel.modules.config.domain.repository.EmailConfigRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Properties;

/**
 * Servicio para envío de correos electrónicos
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final EmailConfigRepository emailConfigRepository;
    
    /**
     * Obtiene la configuración de email desde la base de datos
     */
    private EmailConfig getEmailConfig() {
        return emailConfigRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new RuntimeException("Configuración de email no encontrada"));
    }
    
    /**
     * Crea un JavaMailSender dinámico basado en la configuración de la BD
     */
    private JavaMailSender getConfiguredMailSender() {
        EmailConfig config = getEmailConfig();
        
        if (!config.getEnabled()) {
            throw new RuntimeException("El envío de correos está deshabilitado");
        }
        
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(config.getSmtpHost());
        mailSender.setPort(config.getSmtpPort());
        mailSender.setUsername(config.getEmail());
        mailSender.setPassword(config.getAppPassword());
        
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");
        props.put("mail.smtp.connectiontimeout", "5000");
        props.put("mail.smtp.timeout", "5000");
        props.put("mail.smtp.writetimeout", "5000");
        
        return mailSender;
    }
    
    /**
     * Envía un correo de texto plano
     */
    public void sendSimpleEmail(String to, String subject, String text) {
        try {
            JavaMailSender configuredSender = getConfiguredMailSender();
            EmailConfig config = getEmailConfig();
            
            MimeMessage message = configuredSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(config.getEmail());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, false);
            
            configuredSender.send(message);
            log.info("Email enviado exitosamente a: {}", to);
        } catch (MessagingException e) {
            log.error("Error enviando email a {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Error al enviar email: " + e.getMessage(), e);
        }
    }
    
    /**
     * Envía un correo HTML
     */
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            JavaMailSender configuredSender = getConfiguredMailSender();
            EmailConfig config = getEmailConfig();
            
            MimeMessage message = configuredSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(config.getEmail());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            
            configuredSender.send(message);
            log.info("Email HTML enviado exitosamente a: {}", to);
        } catch (MessagingException e) {
            log.error("Error enviando email HTML a {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Error al enviar email: " + e.getMessage(), e);
        }
    }
    
    /**
     * Envía la constancia de radicación de PQR
     */
    public void sendPQRConstancy(String to, String customerName, String cun, String type, 
                                 String subject, String radicationDate, String maxResponseDate, 
                                 String silenceText) {
        // Convertir tipo a español para el email
        String typeSpanish = switch (type.toUpperCase()) {
            case "PETICION" -> "Petición";
            case "QUEJA" -> "Queja";
            case "RECURSO" -> "Recurso";
            default -> type;
        };
        
        String htmlContent = buildPQRConstancyEmail(customerName, cun, typeSpanish, subject, 
                                                    radicationDate, maxResponseDate, silenceText);
        
        sendHtmlEmail(to, "Constancia de Radicación de PQR - FITEL", htmlContent);
    }
    
    /**
     * Construye el HTML del correo de constancia
     */
    private String buildPQRConstancyEmail(String customerName, String cun, String type, 
                                         String subject, String radicationDate, 
                                         String maxResponseDate, String silenceText) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
                    .cun-box { background-color: white; border: 2px solid #dc2626; padding: 15px; margin: 20px 0; text-align: center; border-radius: 8px; }
                    .cun-number { font-size: 24px; font-weight: bold; color: #dc2626; font-family: monospace; }
                    .info-box { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #dc2626; border-radius: 4px; }
                    .warning-box { background-color: #fef3c7; border: 1px solid #fbbf24; padding: 15px; margin: 15px 0; border-radius: 4px; }
                    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>FITEL - Constancia de Radicación</h1>
                    </div>
                    <div class="content">
                        <p>Estimado/a <strong>%s</strong>,</p>
                        <p>Hemos recibido su %s y le informamos que ha sido registrada exitosamente en nuestro sistema.</p>
                        
                        <div class="cun-box">
                            <p style="margin: 0; color: #6b7280; font-size: 14px;">Código Único Numérico (CUN)</p>
                            <p class="cun-number">%s</p>
                        </div>
                        
                        <div class="info-box">
                            <h3 style="margin-top: 0; color: #dc2626;">Información de su PQR</h3>
                            <p><strong>Asunto:</strong> %s</p>
                            <p><strong>Fecha de Radicación:</strong> %s</p>
                            <p><strong>Fecha Máxima de Respuesta:</strong> <span style="color: #dc2626; font-weight: bold;">%s</span></p>
                        </div>
                        
                        <div class="warning-box">
                            <h4 style="margin-top: 0; color: #92400e;">⚠️ Silencio Administrativo Positivo</h4>
                            <p style="margin: 0; color: #78350f;">%s</p>
                        </div>
                        
                        <p>Puede consultar el estado de su PQR en cualquier momento ingresando a nuestro sitio web y utilizando su CUN o número de documento.</p>
                        
                        <p>Atentamente,<br><strong>Equipo FITEL</strong></p>
                    </div>
                    <div class="footer">
                        <p>Este es un correo automático, por favor no responda a este mensaje.</p>
                        <p>FITEL - Uniendo Familias</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(customerName, type, cun, subject, radicationDate, maxResponseDate, silenceText);
    }
}
