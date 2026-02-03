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
                .orElseThrow(() -> {
                    log.warn("Configuración de email no encontrada en la base de datos");
                    return new RuntimeException("Configuración de email no encontrada");
                });
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
     * Envía notificación de nueva PQR a la empresa
     */
    public void sendPQRNotificationToCompany(String customerName, String customerEmail, 
                                            String customerPhone, String customerDocumentType,
                                            String customerDocumentNumber, String customerAddress,
                                            String cun, String type, String subject, String description,
                                            String radicationDate, String maxResponseDate) {
        try {
            // Obtener el email de la empresa desde la configuración
            EmailConfig config = getEmailConfig();
            String companyEmail = config.getEmail();
            
            // Convertir tipo a español para el email
            String typeSpanish = switch (type.toUpperCase()) {
                case "PETICION" -> "Petición";
                case "QUEJA" -> "Queja";
                case "RECURSO" -> "Recurso";
                default -> type;
            };
            
            String htmlContent = buildPQRCompanyNotificationEmail(customerName, customerEmail,
                customerPhone, customerDocumentType, customerDocumentNumber, customerAddress,
                cun, typeSpanish, subject, description, radicationDate, maxResponseDate);
            
            sendHtmlEmail(companyEmail, "Nueva PQR Recibida - CUN: " + cun, htmlContent);
            log.info("Notificación de PQR enviada a la empresa: {}", companyEmail);
        } catch (RuntimeException e) {
            // Si el email está deshabilitado o no configurado, solo loguear el warning
            if (e.getMessage() != null && 
                (e.getMessage().contains("no encontrada") || 
                 e.getMessage().contains("deshabilitado"))) {
                log.warn("No se pudo enviar la notificación a la empresa (configuración no disponible): {}", e.getMessage());
            } else {
                log.error("Error enviando notificación de PQR a la empresa: {}", e.getMessage(), e);
            }
            // No fallar la creación de PQR si falla el envío de email a la empresa
        }
    }
    
    /**
     * Construye el HTML del correo de notificación para la empresa
     */
    private String buildPQRCompanyNotificationEmail(String customerName, String customerEmail,
                                                   String customerPhone, String customerDocumentType,
                                                   String customerDocumentNumber, String customerAddress,
                                                   String cun, String type, String subject,
                                                   String description, String radicationDate,
                                                   String maxResponseDate) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        line-height: 1.6; 
                        color: #1f2937; 
                        background-color: #f3f4f6;
                        padding: 20px;
                    }
                    .email-wrapper { 
                        max-width: 700px; 
                        margin: 0 auto; 
                        background-color: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .header { 
                        /* Gradiente sin porcentajes para evitar conflictos con String.formatted */
                        background: linear-gradient(135deg, #dc2626, #b91c1c);
                        color: white; 
                        padding: 30px;
                        text-align: center;
                    }
                    .header-title {
                        font-size: 24px;
                        font-weight: 600;
                        margin-top: 10px;
                    }
                    .alert-badge {
                        background-color: #fef3c7;
                        color: #92400e;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 600;
                        display: inline-block;
                        margin-top: 10px;
                    }
                    .content { 
                        padding: 40px 30px; 
                        background-color: #ffffff;
                    }
                    .cun-highlight {
                        /* Gradiente sin porcentajes para evitar conflictos con String.formatted */
                        background: linear-gradient(135deg, #fef2f2, #fee2e2);
                        border: 3px solid #dc2626;
                        padding: 20px;
                        margin: 25px 0;
                        text-align: center;
                        border-radius: 10px;
                    }
                    .cun-number {
                        font-size: 28px;
                        font-weight: bold;
                        color: #dc2626;
                        font-family: 'Courier New', monospace;
                        letter-spacing: 2px;
                        margin-top: 10px;
                    }
                    .section {
                        margin: 25px 0;
                        padding: 20px;
                        background-color: #f9fafb;
                        border-left: 5px solid #dc2626;
                        border-radius: 6px;
                    }
                    .section-title {
                        color: #dc2626;
                        font-size: 18px;
                        font-weight: 600;
                        margin-bottom: 15px;
                        display: flex;
                        align-items: center;
                    }
                    .info-row {
                        display: flex;
                        margin: 10px 0;
                        padding: 8px 0;
                        border-bottom: 1px solid #e5e7eb;
                    }
                    .info-row:last-child {
                        border-bottom: none;
                    }
                    .info-label {
                        font-weight: 600;
                        color: #374151;
                        min-width: 200px;
                        flex-shrink: 0;
                    }
                    .info-value {
                        color: #1f2937;
                        flex: 1;
                    }
                    .description-box {
                        background-color: #ffffff;
                        border: 2px solid #e5e7eb;
                        padding: 20px;
                        margin: 15px 0;
                        border-radius: 8px;
                        border-left: 4px solid #3b82f6;
                    }
                    .description-text {
                        color: #374151;
                        line-height: 1.8;
                        white-space: pre-wrap;
                    }
                    .deadline-box {
                        background-color: #fef3c7;
                        border: 2px solid #fbbf24;
                        padding: 20px;
                        margin: 25px 0;
                        border-radius: 8px;
                        text-align: center;
                    }
                    .deadline-label {
                        color: #92400e;
                        font-size: 14px;
                        font-weight: 600;
                        margin-bottom: 8px;
                    }
                    .deadline-date {
                        color: #78350f;
                        font-size: 20px;
                        font-weight: bold;
                    }
                    .footer { 
                        background-color: #1f2937;
                        color: #9ca3af;
                        text-align: center; 
                        padding: 25px 20px; 
                        font-size: 12px;
                        line-height: 1.8;
                    }
                    .footer-brand {
                        color: #ffffff;
                        font-weight: 600;
                        font-size: 14px;
                        margin-bottom: 10px;
                    }
                    @media only screen and (max-width: 600px) {
                        .content { padding: 25px 20px; }
                        .header { padding: 25px 20px; }
                        .info-row { flex-direction: column; }
                        .info-label { min-width: auto; margin-bottom: 5px; }
                    }
                </style>
            </head>
            <body>
                <div class="email-wrapper">
                    <div class="header">
                        <div style="font-size: 40px; font-weight: bold; letter-spacing: 3px;">FITEL</div>
                        <div class="header-title">Nueva PQR Recibida</div>
                        <div class="alert-badge">⚠️ Requiere Atención</div>
                    </div>
                    
                    <div class="content">
                        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                            Se ha recibido una nueva <strong>%s</strong> en el sistema de gestión de PQRs.
                        </p>
                        
                        <div class="cun-highlight">
                            <div style="color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase;">
                                Código Único Numérico (CUN)
                            </div>
                            <div class="cun-number">%s</div>
                        </div>
                        
                        <div class="section">
                            <div class="section-title">👤 Información del Cliente</div>
                            <div class="info-row">
                                <span class="info-label">Nombre:</span>
                                <span class="info-value"><strong>%s</strong></span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Email:</span>
                                <span class="info-value">%s</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Teléfono:</span>
                                <span class="info-value">%s</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Tipo de Documento:</span>
                                <span class="info-value">%s</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Número de Documento:</span>
                                <span class="info-value"><strong>%s</strong></span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Dirección:</span>
                                <span class="info-value">%s</span>
                            </div>
                        </div>
                        
                        <div class="section">
                            <div class="section-title">📋 Detalles de la PQR</div>
                            <div class="info-row">
                                <span class="info-label">Tipo:</span>
                                <span class="info-value"><strong style="color: #dc2626;">%s</strong></span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Asunto:</span>
                                <span class="info-value"><strong>%s</strong></span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Fecha de Radicación:</span>
                                <span class="info-value">%s</span>
                            </div>
                        </div>
                        
                        <div class="description-box">
                            <div style="color: #3b82f6; font-weight: 600; margin-bottom: 10px; font-size: 15px;">
                                📝 Descripción:
                            </div>
                            <div class="description-text">%s</div>
                        </div>
                        
                        <div class="deadline-box">
                            <div class="deadline-label">⏰ Fecha Máxima de Respuesta (SLA)</div>
                            <div class="deadline-date">%s</div>
                            <div style="color: #92400e; font-size: 12px; margin-top: 8px;">
                                Tiempo restante: 15 días hábiles
                            </div>
                        </div>
                        
                        <div style="background-color: #eff6ff; border: 2px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 8px;">
                            <div style="color: #1e40af; font-weight: 600; margin-bottom: 10px;">
                                💡 Acción Requerida
                            </div>
                            <div style="color: #1e3a8a; font-size: 14px;">
                                Por favor, revise esta PQR en el panel de administración y asigne un responsable para su gestión.
                                El cliente ya ha recibido su constancia de radicación con el CUN correspondiente.
                            </div>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <div class="footer-brand">FITEL - Sistema de Gestión de PQRs</div>
                        <div style="color: #9ca3af; font-size: 11px;">
                            Este es un correo automático del sistema.<br>
                            Acceda al panel de administración para gestionar esta PQR.
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(type, cun, customerName, customerEmail, customerPhone, 
                customerDocumentType, customerDocumentNumber, customerAddress != null ? customerAddress : "No especificada",
                type, subject, radicationDate, description != null ? description : "Sin descripción", maxResponseDate);
    }
    
    /**
     * Construye el HTML del correo de constancia
     *
     * Nota: usamos placeholders de texto en lugar de %s para evitar errores de formateo
     * con String.formatted cuando el HTML/CSS contiene caracteres especiales.
     */
    private String buildPQRConstancyEmail(String customerName, String cun, String type,
                                         String subject, String radicationDate,
                                         String maxResponseDate, String silenceText) {
        String template = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #1f2937;
                        background-color: #f3f4f6;
                        padding: 20px;
                    }
                    .email-wrapper {
                        max-width: 650px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        /* Gradiente sin porcentajes para evitar conflictos con String.formatted */
                        background: linear-gradient(135deg, #dc2626, #b91c1c);
                        color: white;
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .logo-container {
                        margin-bottom: 20px;
                    }
                    .logo-text {
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 2px;
                        margin-top: 10px;
                    }
                    .header-title {
                        font-size: 24px;
                        font-weight: 600;
                        margin-top: 10px;
                    }
                    .content {
                        padding: 40px 30px;
                        background-color: #ffffff;
                    }
                    .greeting {
                        font-size: 16px;
                        margin-bottom: 20px;
                        color: #374151;
                    }
                    .cun-box {
                        /* Gradiente sin porcentajes para evitar conflictos con String.formatted */
                        background: linear-gradient(135deg, #fef2f2, #fee2e2);
                        border: 3px solid #dc2626;
                        padding: 25px;
                        margin: 30px 0;
                        text-align: center;
                        border-radius: 10px;
                        box-shadow: 0 2px 4px rgba(220, 38, 38, 0.1);
                    }
                    .cun-label {
                        color: #6b7280;
                        font-size: 14px;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-bottom: 10px;
                    }
                    .cun-number {
                        font-size: 32px;
                        font-weight: bold;
                        color: #dc2626;
                        font-family: 'Courier New', monospace;
                        letter-spacing: 2px;
                    }
                    .info-section {
                        background-color: #f9fafb;
                        border-left: 5px solid #dc2626;
                        padding: 25px;
                        margin: 25px 0;
                        border-radius: 6px;
                    }
                    .info-title {
                        color: #dc2626;
                        font-size: 18px;
                        font-weight: 600;
                        margin-bottom: 15px;
                        display: flex;
                        align-items: center;
                    }
                    .info-item {
                        margin: 12px 0;
                        display: flex;
                        align-items: flex-start;
                    }
                    .info-label {
                        font-weight: 600;
                        color: #374151;
                        min-width: 180px;
                        margin-right: 10px;
                    }
                    .info-value {
                        color: #1f2937;
                        flex: 1;
                    }
                    .warning-box {
                        background-color: #fef3c7;
                        border: 2px solid #fbbf24;
                        padding: 20px;
                        margin: 25px 0;
                        border-radius: 8px;
                        border-left: 5px solid #f59e0b;
                    }
                    .warning-title {
                        color: #92400e;
                        font-size: 16px;
                        font-weight: 600;
                        margin-bottom: 10px;
                        display: flex;
                        align-items: center;
                    }
                    .warning-text {
                        color: #78350f;
                        font-size: 14px;
                        line-height: 1.7;
                    }
                    .action-box {
                        background-color: #eff6ff;
                        border: 2px solid #3b82f6;
                        padding: 20px;
                        margin: 25px 0;
                        border-radius: 8px;
                        text-align: center;
                    }
                    .action-text {
                        color: #1e40af;
                        font-size: 15px;
                        font-weight: 500;
                    }
                    .signature {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 2px solid #e5e7eb;
                    }
                    .signature-text {
                        color: #374151;
                        font-size: 15px;
                        margin-bottom: 5px;
                    }
                    .signature-name {
                        color: #dc2626;
                        font-weight: 600;
                        font-size: 16px;
                    }
                    .footer {
                        background-color: #1f2937;
                        color: #9ca3af;
                        text-align: center;
                        padding: 30px 20px;
                        font-size: 12px;
                        line-height: 1.8;
                    }
                    .footer-brand {
                        color: #ffffff;
                        font-weight: 600;
                        font-size: 14px;
                        margin-bottom: 10px;
                    }
                    .footer-text {
                        color: #9ca3af;
                        font-size: 11px;
                    }
                    @media only screen and (max-width: 600px) {
                        .content { padding: 25px 20px; }
                        .header { padding: 30px 20px; }
                        .cun-number { font-size: 24px; }
                        .info-item { flex-direction: column; }
                        .info-label { min-width: auto; margin-bottom: 5px; }
                    }
                </style>
            </head>
            <body>
                <div class="email-wrapper">
                    <div class="header">
                        <div class="logo-container">
                            <div style="font-size: 48px; font-weight: bold; letter-spacing: 3px;">FITEL</div>
                        </div>
                        <div class="header-title">Constancia de Radicación de PQR</div>
                    </div>
                    
                    <div class="content">
                        <div class="greeting">
                            <p>Estimado/a <strong style="color: #dc2626;">{{CUSTOMER_NAME}}</strong>,</p>
                        </div>
                        
                        <p style="margin-bottom: 20px; color: #374151; font-size: 15px;">
                            Hemos recibido su <strong>{{TYPE}}</strong> y le informamos que ha sido registrada exitosamente en nuestro sistema de gestión de Peticiones, Quejas y Recursos (PQR).
                        </p>
                        
                        <div class="cun-box">
                            <div class="cun-label">Código Único Numérico (CUN)</div>
                            <div class="cun-number">{{CUN}}</div>
                            <p style="margin-top: 15px; color: #6b7280; font-size: 13px;">
                                Guarde este código para consultar el estado de su PQR
                            </p>
                        </div>
                        
                        <div class="info-section">
                            <div class="info-title">
                                📋 Información de su PQR
                            </div>
                            <div class="info-item">
                                <span class="info-label">Tipo de PQR:</span>
                                <span class="info-value"><strong>{{TYPE}}</strong></span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Asunto:</span>
                                <span class="info-value">{{SUBJECT}}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Fecha de Radicación:</span>
                                <span class="info-value"><strong>{{RAD_DATE}}</strong></span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Fecha Máxima de Respuesta:</span>
                                <span class="info-value" style="color: #dc2626; font-weight: bold; font-size: 15px;">{{MAX_DATE}}</span>
                            </div>
                        </div>
                        
                        <div class="warning-box">
                            <div class="warning-title">
                                ⚠️ Silencio Administrativo Positivo
                            </div>
                            <div class="warning-text">
                                {{SILENCE}}
                            </div>
                        </div>
                        
                        <div class="action-box">
                            <div class="action-text">
                                💡 Puede consultar el estado de su PQR en cualquier momento ingresando a nuestro sitio web y utilizando su CUN o número de documento.
                            </div>
                        </div>
                        
                        <div class="signature">
                            <div class="signature-text">Atentamente,</div>
                            <div class="signature-name">Equipo FITEL</div>
                            <div style="color: #6b7280; font-size: 13px; margin-top: 5px;">
                                Uniendo Familias
                            </div>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <div class="footer-brand">FITEL - Uniendo Familias</div>
                        <div class="footer-text">
                            Este es un correo automático generado por nuestro sistema.<br>
                            Por favor no responda a este mensaje.<br><br>
                            Si tiene alguna consulta, puede contactarnos a través de nuestro sitio web.
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """;

        return template
                .replace("{{CUSTOMER_NAME}}", customerName != null ? customerName : "")
                .replace("{{TYPE}}", type != null ? type : "")
                .replace("{{CUN}}", cun != null ? cun : "")
                .replace("{{SUBJECT}}", subject != null ? subject : "")
                .replace("{{RAD_DATE}}", radicationDate != null ? radicationDate : "")
                .replace("{{MAX_DATE}}", maxResponseDate != null ? maxResponseDate : "")
                .replace("{{SILENCE}}", silenceText != null ? silenceText : "");
    }
    
    /**
     * Envía notificación de formulario de contacto a la empresa
     */
    public void sendContactFormNotification(String customerName, String customerEmail,
                                           String customerPhone, String subject, String message) {
        try {
            // Obtener el email de la empresa desde la configuración
            EmailConfig config = getEmailConfig();
            String companyEmail = config.getEmail();
            
            String htmlContent = buildContactFormNotificationEmail(customerName, customerEmail,
                customerPhone, subject, message);
            
            sendHtmlEmail(companyEmail, "Nuevo Mensaje de Contacto - " + subject, htmlContent);
            log.info("Notificación de formulario de contacto enviada a la empresa: {}", companyEmail);
        } catch (RuntimeException e) {
            // Re-lanzar para que el controlador maneje el error
            throw e;
        }
    }
    
    /**
     * Construye el HTML del correo de notificación de formulario de contacto
     */
    private String buildContactFormNotificationEmail(String customerName, String customerEmail,
                                                    String customerPhone, String subject, String message) {
        String template = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #1f2937;
                        background-color: #f3f4f6;
                        padding: 20px;
                    }
                    .email-wrapper {
                        max-width: 700px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #dc2626, #b91c1c);
                        color: white;
                        padding: 30px;
                        text-align: center;
                    }
                    .header-title {
                        font-size: 24px;
                        font-weight: 600;
                        margin-top: 10px;
                    }
                    .alert-badge {
                        background-color: #fef3c7;
                        color: #92400e;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 600;
                        display: inline-block;
                        margin-top: 10px;
                    }
                    .content {
                        padding: 40px 30px;
                        background-color: #ffffff;
                    }
                    .section {
                        margin: 25px 0;
                        padding: 20px;
                        background-color: #f9fafb;
                        border-left: 5px solid #dc2626;
                        border-radius: 6px;
                    }
                    .section-title {
                        color: #dc2626;
                        font-size: 18px;
                        font-weight: 600;
                        margin-bottom: 15px;
                        display: flex;
                        align-items: center;
                    }
                    .info-row {
                        display: flex;
                        margin: 10px 0;
                        padding: 8px 0;
                        border-bottom: 1px solid #e5e7eb;
                    }
                    .info-row:last-child {
                        border-bottom: none;
                    }
                    .info-label {
                        font-weight: 600;
                        color: #374151;
                        min-width: 200px;
                        flex-shrink: 0;
                    }
                    .info-value {
                        color: #1f2937;
                        flex: 1;
                    }
                    .message-box {
                        background-color: #ffffff;
                        border: 2px solid #e5e7eb;
                        padding: 20px;
                        margin: 15px 0;
                        border-radius: 8px;
                        border-left: 4px solid #3b82f6;
                    }
                    .message-text {
                        color: #374151;
                        line-height: 1.8;
                        white-space: pre-wrap;
                    }
                    .action-box {
                        background-color: #eff6ff;
                        border: 2px solid #3b82f6;
                        padding: 20px;
                        margin: 25px 0;
                        border-radius: 8px;
                    }
                    .action-text {
                        color: #1e40af;
                        font-size: 14px;
                    }
                    .footer {
                        background-color: #1f2937;
                        color: #9ca3af;
                        text-align: center;
                        padding: 25px 20px;
                        font-size: 12px;
                        line-height: 1.8;
                    }
                    .footer-brand {
                        color: #ffffff;
                        font-weight: 600;
                        font-size: 14px;
                        margin-bottom: 10px;
                    }
                    @media only screen and (max-width: 600px) {
                        .content { padding: 25px 20px; }
                        .header { padding: 25px 20px; }
                        .info-row { flex-direction: column; }
                        .info-label { min-width: auto; margin-bottom: 5px; }
                    }
                </style>
            </head>
            <body>
                <div class="email-wrapper">
                    <div class="header">
                        <div style="font-size: 40px; font-weight: bold; letter-spacing: 3px;">FITEL</div>
                        <div class="header-title">Nuevo Mensaje de Contacto</div>
                        <div class="alert-badge">📧 Requiere Respuesta</div>
                    </div>
                    
                    <div class="content">
                        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                            Se ha recibido un nuevo mensaje a través del formulario de contacto del sitio web.
                        </p>
                        
                        <div class="section">
                            <div class="section-title">👤 Información del Cliente</div>
                            <div class="info-row">
                                <span class="info-label">Nombre:</span>
                                <span class="info-value"><strong>{{CUSTOMER_NAME}}</strong></span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Email:</span>
                                <span class="info-value"><a href="mailto:{{CUSTOMER_EMAIL}}" style="color: #3b82f6; text-decoration: none;">{{CUSTOMER_EMAIL}}</a></span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Teléfono:</span>
                                <span class="info-value"><a href="tel:{{CUSTOMER_PHONE}}" style="color: #3b82f6; text-decoration: none;">{{CUSTOMER_PHONE}}</a></span>
                            </div>
                        </div>
                        
                        <div class="section">
                            <div class="section-title">📋 Detalles del Mensaje</div>
                            <div class="info-row">
                                <span class="info-label">Asunto:</span>
                                <span class="info-value"><strong style="color: #dc2626;">{{SUBJECT}}</strong></span>
                            </div>
                        </div>
                        
                        <div class="message-box">
                            <div style="color: #3b82f6; font-weight: 600; margin-bottom: 10px; font-size: 15px;">
                                💬 Mensaje:
                            </div>
                            <div class="message-text">{{MESSAGE}}</div>
                        </div>
                        
                        <div class="action-box">
                            <div class="action-text">
                                💡 <strong>Acción Requerida:</strong> Por favor, responda al cliente a la brevedad posible utilizando el email o teléfono proporcionado.
                            </div>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <div class="footer-brand">FITEL - Sistema de Gestión de Contacto</div>
                        <div style="color: #9ca3af; font-size: 11px;">
                            Este es un correo automático del sistema.<br>
                            El mensaje fue enviado desde el formulario de contacto del sitio web.
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """;
        
        return template
                .replace("{{CUSTOMER_NAME}}", customerName != null ? customerName : "")
                .replace("{{CUSTOMER_EMAIL}}", customerEmail != null ? customerEmail : "")
                .replace("{{CUSTOMER_PHONE}}", customerPhone != null ? customerPhone : "")
                .replace("{{SUBJECT}}", subject != null ? subject : "")
                .replace("{{MESSAGE}}", message != null ? message.replace("\n", "<br>") : "");
    }
}
