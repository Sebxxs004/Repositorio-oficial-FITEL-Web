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
     * Envía un correo electrónico simple (usado por ejemplo para códigos de verificación)
     */
    public void sendEmail(String to, String subject, String body) {
        try {
            JavaMailSender configuredSender = getConfiguredMailSender();
            EmailConfig config = getEmailConfig();

            MimeMessage message = configuredSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(config.getFromEmail(), "FITEL Admin");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            configuredSender.send(message);
            log.info("Correo enviado a: {}", to);
        } catch (Exception e) {
            log.error("Error enviando email a {}: {}", to, e.getMessage());
            throw new RuntimeException("Error al enviar el correo: " + e.getMessage());
        }
    }

    /**
     * Envía al cliente la respuesta de su PQR, opcionalmente con un archivo adjunto.
     */
    public void sendPQRResponseToCustomer(String to,
                                          String customerName,
                                          String cun,
                                          String type,
                                          String subject,
                                          String responseText,
                                          String attachmentAbsolutePath) {
        try {
            EmailConfig config = getEmailConfig();
            JavaMailSender configuredSender = getConfiguredMailSender();

            MimeMessage message = configuredSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, attachmentAbsolutePath != null && !attachmentAbsolutePath.isBlank());

            helper.setFrom(config.getEmail());
            helper.setTo(to);
            helper.setSubject("Respuesta a su PQR - CUN: " + cun);

            String typeSpanish = switch (type.toUpperCase()) {
                case "PETICION" -> "Petición";
                case "QUEJA" -> "Queja";
                case "RECLAMO" -> "Reclamo";
                case "SUGERENCIA" -> "Sugerencia";
                default -> type;
            };

            String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
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
                            background: linear-gradient(135deg, #dc2626, #b91c1c);
                            color: white;
                            padding: 30px;
                            text-align: center;
                        }
                        .header-title {
                            font-size: 22px;
                            font-weight: 600;
                            margin-top: 8px;
                        }
                        .content {
                            padding: 30px;
                        }
                        .greeting {
                            font-size: 16px;
                            margin-bottom: 12px;
                        }
                        .pqr-info {
                            margin: 16px 0;
                            padding: 12px 16px;
                            background-color: #fef2f2;
                            border-radius: 8px;
                            border-left: 4px solid #dc2626;
                            font-size: 14px;
                        }
                        .response-box {
                            margin-top: 20px;
                            padding: 16px;
                            background-color: #f9fafb;
                            border-radius: 8px;
                            border: 1px solid #e5e7eb;
                            font-size: 14px;
                        }
                        .legal-box {
                            margin-top: 24px;
                            padding: 16px;
                            background-color: #fffbeb;
                            border-radius: 8px;
                            border: 1px solid #fcd34d;
                            font-size: 13px;
                            color: #92400e;
                        }
                        .legal-box h4 {
                            margin: 0 0 8px 0;
                            font-size: 13px;
                            font-weight: 700;
                            color: #78350f;
                        }
                        .footer {
                            margin-top: 24px;
                            font-size: 12px;
                            color: #6b7280;
                            text-align: center;
                            padding: 16px 24px 24px;
                            border-top: 1px solid #e5e7eb;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-wrapper">
                        <div class="header">
                            <div class="header-title">Respuesta a su PQR</div>
                        </div>
                        <div class="content">
                            <p class="greeting">Hola %s,</p>
                            <p>Hemos revisado su <strong>%s</strong> con CUN <strong>%s</strong> y a continuación encontrará nuestra respuesta:</p>
                            <div class="pqr-info">
                                <div><strong>Asunto:</strong> %s</div>
                            </div>
                            <div class="response-box">
                                %s
                            </div>
                            <p style="margin-top: 18px;">
                                Si tiene dudas adicionales o requiere más información, puede responder a este correo
                                o comunicarse con nosotros a través de nuestros canales de atención.
                            </p>
                            <div class="legal-box">
                                <h4>⚖️ Derecho a Recurso de Reposición y en Subsidio de Apelación</h4>
                                <p style="margin: 0;">
                                    De conformidad con la <strong>Ley 1480 de 2011 (Estatuto del Consumidor)</strong> y la
                                    <strong>Resolución CRC 5111 de 2017</strong>, usted tiene derecho a interponer
                                    <strong>Recurso de Reposición</strong> ante FITEL dentro de los
                                    <strong>quince (15) días hábiles</strong> siguientes a la notificación de esta respuesta,
                                    si no está de acuerdo con la misma.<br/><br/>
                                    En caso de que el recurso de reposición no sea favorable a sus intereses, podrá interponer
                                    <strong>Recurso de Apelación en subsidio</strong> ante la
                                    <strong>Superintendencia de Industria y Comercio (SIC)</strong>,
                                    entidad encargada de la vigilancia y control de los derechos de los consumidores
                                    en Colombia.
                                </p>
                            </div>
                        </div>
                        <div class="footer">
                            Este es un correo automático del sistema de PQR de FITEL.
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(customerName, typeSpanish, cun, subject, responseText != null ? responseText.replace("\n", "<br/>") : "");

            helper.setText(htmlContent, true);

            if (attachmentAbsolutePath != null && !attachmentAbsolutePath.isBlank()) {
                java.io.File file = new java.io.File(attachmentAbsolutePath);
                if (file.exists()) {
                    helper.addAttachment(file.getName(), file);
                }
            }

            configuredSender.send(message);
            log.info("Respuesta de PQR enviada a cliente {} para CUN {}", to, cun);
        } catch (Exception e) {
            log.error("Error enviando respuesta de PQR al cliente {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Error al enviar la respuesta de PQR por correo: " + e.getMessage(), e);
        }
    }

    /**
     * Notifica al cliente que el estado de su PQR ha cambiado.
     */
    public void sendPQRStatusChangeToCustomer(String to,
                                              String customerName,
                                              String cun,
                                              String type,
                                              String subject,
                                              String oldStatus,
                                              String newStatus) {
        try {
            String typeSpanish = switch (type.toUpperCase()) {
                case "PETICION" -> "Petición";
                case "QUEJA" -> "Queja";
                case "RECURSO" -> "Recurso";
                default -> type;
            };

            String statusSpanishOld = translateStatus(oldStatus);
            String statusSpanishNew = translateStatus(newStatus);

            String html = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; padding: 20px; }
                        .wrapper { max-width: 650px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: #fff; padding: 24px 30px; text-align: center; }
                        .header-title { font-size: 20px; font-weight: 600; }
                        .content { padding: 26px 30px 24px; font-size: 14px; color: #111827; }
                        .status-box { margin: 18px 0; padding: 14px 16px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #2563eb; }
                        .footer { border-top: 1px solid #e5e7eb; padding: 14px 24px 20px; font-size: 12px; color: #6b7280; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="wrapper">
                        <div class="header">
                            <div class="header-title">Actualización del estado de su PQR</div>
                        </div>
                        <div class="content">
                            <p>Hola %s,</p>
                            <p>Te informamos que el estado de tu <strong>%s</strong> con CUN <strong>%s</strong> ha sido actualizado.</p>
                            <div class="status-box">
                                <div><strong>Asunto:</strong> %s</div>
                                <div style="margin-top:8px;">
                                    <strong>Estado anterior:</strong> %s<br/>
                                    <strong>Nuevo estado:</strong> %s
                                </div>
                            </div>
                            <p>Si tienes dudas sobre esta actualización, puedes responder a este correo o consultar el estado de tu PQR en nuestro sitio web.</p>
                        </div>
                        <div class="footer">
                            Este es un correo automático del sistema de PQR de FITEL.
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(customerName, typeSpanish, cun, subject, statusSpanishOld, statusSpanishNew);

            sendHtmlEmail(to, "Actualización del estado de su PQR - CUN: " + cun, html);
        } catch (Exception e) {
            log.error("Error enviando notificación de cambio de estado de PQR al cliente {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Error al enviar notificación de cambio de estado de PQR: " + e.getMessage(), e);
        }
    }

    private String translateStatus(String status) {
        if (status == null) return "Desconocido";
        return switch (status) {
            case "RECIBIDA" -> "Recibida";
            case "EN_ANALISIS" -> "En análisis";
            case "EN_RESPUESTA" -> "En respuesta";
            case "RESUELTA" -> "Resuelta";
            case "CERRADA" -> "Cerrada";
            default -> status;
        };
    }
    
    /**
     * Envía un correo de creación de cuenta administrativa con las credenciales.
     */
    public void sendAccountCreationEmail(String to, String name, String password) {
        try {
            EmailConfig config = getEmailConfig();
            JavaMailSender configuredSender = getConfiguredMailSender();

            MimeMessage message = configuredSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(config.getEmail());
            helper.setTo(to);
            helper.setSubject("Bienvenido al Panel Administrativo de Fitel");

            String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            line-height: 1.6;
                            color: #1f2937;
                            background-color: #f3f4f6;
                            padding: 20px;
                        }
                        .email-wrapper {
                            max-width: 600px;
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
                            margin: 0;
                        }
                        .content {
                            padding: 40px;
                        }
                        .welcome-text {
                            font-size: 18px;
                            color: #374151;
                            margin-bottom: 20px;
                        }
                        .credentials-box {
                            background-color: #f8fafc;
                            border-left: 4px solid #dc2626;
                            padding: 20px;
                            margin: 20px 0;
                            border-radius: 4px;
                        }
                        .credential-item {
                            margin-bottom: 10px;
                        }
                        .credential-label {
                            font-weight: 600;
                            color: #4b5563;
                            display: block;
                            font-size: 0.875rem;
                            text-transform: uppercase;
                            letter-spacing: 0.05em;
                        }
                        .credential-value {
                            font-family: 'Consolas', 'Monaco', monospace;
                            background-color: #e5e7eb;
                            padding: 4px 8px;
                            border-radius: 4px;
                            color: #111827;
                            font-size: 1rem;
                        }
                        .button-container {
                            text-align: center;
                            margin-top: 30px;
                        }
                        .login-button {
                            display: inline-block;
                            background-color: #dc2626;
                            color: white;
                            text-decoration: none;
                            padding: 12px 24px;
                            border-radius: 6px;
                            font-weight: 600;
                            transition: background-color 0.2s;
                        }
                        .login-button:hover {
                            background-color: #b91c1c;
                        }
                        .footer {
                            background-color: #f9fafb;
                            padding: 20px;
                            text-align: center;
                            font-size: 0.875rem;
                            color: #6b7280;
                            border-top: 1px solid #e5e7eb;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-wrapper">
                        <div class="header">
                            <h1 class="header-title">Bienvenido a Fitel</h1>
                        </div>
                        <div class="content">
                            <p class="welcome-text">Hola <strong>%s</strong>,</p>
                            <p>Tu cuenta administrativa ha sido creada exitosamente. A continuación encontrarás tus credenciales de acceso:</p>
                            
                            <div class="credentials-box">
                                <div class="credential-item">
                                    <span class="credential-label">Usuario / Email</span>
                                    <span class="credential-value">%s</span>
                                </div>
                                <div class="credential-item">
                                    <span class="credential-label">Contraseña Temporal</span>
                                    <span class="credential-value">%s</span>
                                </div>
                            </div>
                            
                            <p>Por razones de seguridad, te recomendamos cambiar tu contraseña después de iniciar sesión por primera vez.</p>
                            
                            <div class="button-container">
                                <a href="https://fitel.com.co/admin/login" class="login-button">Iniciar Sesión</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 Fitel. Todos los derechos reservados.</p>
                            <p>Este es un mensaje automático, por favor no responder.</p>
                        </div>
                    </div>
                </body>
                </html>
            """.formatted(name, to, password);

            helper.setText(htmlContent, true);
            configuredSender.send(message);
            log.info("Email de creación de cuenta enviado a: {}", to);

        } catch (MessagingException e) {
            log.error("Error al crear mensaje de correo: {}", e.getMessage());
            throw new RuntimeException("Error al enviar el correo", e);
        } catch (Exception e) {
            log.error("Error al enviar email de creación de cuenta: {}", e.getMessage());
            throw new RuntimeException("Error enviando email: " + e.getMessage());
        }
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
     * Notifica solicitud de reanálisis (Apelación) a cliente y admins
     */
    public void sendReanalysisNotification(String to, String customerName, String cun, String appealReason) {
        try {
            EmailConfig config = getEmailConfig();
            JavaMailSender configuredSender = getConfiguredMailSender();
            
            // 1. Correo al Usuario
            MimeMessage userMessage = configuredSender.createMimeMessage();
            MimeMessageHelper userHelper = new MimeMessageHelper(userMessage, true, "UTF-8");
            userHelper.setFrom(config.getEmail());
            userHelper.setTo(to);
            userHelper.setSubject("Solicitud de Reanálisis Recibida - CUN: " + cun);
            
            String userHtml = """
                <!DOCTYPE html>
                <html>
                <body>
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2 style="color: #d32f2f;">Solicitud de Reanálisis Recibida</h2>
                        <p>Hola <strong>%s</strong>,</p>
                        <p>Hemos recibido su solicitud de revisión para la PQR con CUN <strong>%s</strong>.</p>
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <strong>Motivo de inconformidad:</strong><br/>
                            %s
                        </div>
                        <p>Su caso ha pasado a estado <strong>EN ANÁLISIS</strong>. Nuestro equipo revisará nuevamente su solicitud y le daremos respuesta en los próximos días hábiles.</p>
                        <p style="font-size: 12px; color: #666;">FITEL - Sistema de PQR</p>
                    </div>
                </body>
                </html>
                """.formatted(customerName, cun, appealReason.replace("\n", "<br/>"));
            
            userHelper.setText(userHtml, true);
            configuredSender.send(userMessage);

            // 2. Correo a la Empresa (Admin)
            MimeMessage adminMessage = configuredSender.createMimeMessage();
            MimeMessageHelper adminHelper = new MimeMessageHelper(adminMessage, true, "UTF-8");
            adminHelper.setFrom(config.getEmail());
            adminHelper.setTo(config.getEmail()); 
            adminHelper.setSubject("[ALERTA] Nueva Solicitud de Reanálisis - CUN: " + cun);
            
            String adminHtml = """
                <!DOCTYPE html>
                <html>
                <body>
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2 style="color: #d32f2f;">⚠️ Nueva Solicitud de Reanálisis/Apelación</h2>
                        <p>El usuario ha marcado inconformidad con la respuesta de una PQR.</p>
                        <ul>
                            <li><strong>CUN:</strong> %s</li>
                            <li><strong>Cliente:</strong> %s</li>
                            <li><strong>Email:</strong> %s</li>
                        </ul>
                        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border: 1px solid #ffeeba; margin: 20px 0;">
                            <strong>Motivo de apelación:</strong><br/>
                            %s
                        </div>
                        <p>Por favor, revisar el caso en el panel administrativo lo antes posible.</p>
                    </div>
                </body>
                </html>
                """.formatted(cun, customerName, to, appealReason.replace("\n", "<br/>"));
            
            adminHelper.setText(adminHtml, true);
            configuredSender.send(adminMessage);
            
            log.info("Notificaciones de reanálisis enviadas para CUN {}", cun);
        } catch (Exception e) {
            log.error("Error enviando notificaciones de reanálisis para CUN {}: {}", cun, e.getMessage()); 
        }
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

    /**
     * Envía las credenciales de acceso al nuevo usuario administrativo.
     */
    public void sendAccountCreationEmail(String to, String name, String username, String initialPassword) {
        try {
            EmailConfig config = getEmailConfig();
            JavaMailSender configuredSender = getConfiguredMailSender();

            MimeMessage message = configuredSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(config.getEmail());
            helper.setTo(to);
            helper.setSubject("Bienvenido al Panel Administrativo de FITEL");

            String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            line-height: 1.6;
                            color: #1f2937;
                            background-color: #f3f4f6;
                            padding: 20px;
                        }
                        .email-wrapper {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background-color: #dc2626;
                            color: white;
                            padding: 24px;
                            text-align: center;
                        }
                        .content {
                            padding: 32px;
                        }
                        .credentials-box {
                            background-color: #f8fafc;
                            border: 1px solid #e2e8f0;
                            border-radius: 6px;
                            padding: 16px;
                            margin: 20px 0;
                        }
                        .credential-row {
                            margin-bottom: 8px;
                        }
                        .label {
                            font-weight: 600;
                            color: #64748b;
                        }
                        .value {
                            font-family: monospace;
                            font-size: 1.1em;
                            color: #0f172a;
                        }
                        .footer {
                            background-color: #f1f5f9;
                            padding: 16px;
                            text-align: center;
                            font-size: 12px;
                            color: #64748b;
                        }
                        .button {
                            display: inline-block;
                            background-color: #dc2626;
                            color: white;
                            padding: 12px 24px;
                            border-radius: 6px;
                            text-decoration: none;
                            font-weight: 600;
                            margin-top: 16px;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-wrapper">
                        <div class="header">
                            <h1 style="margin:0; font-size: 24px;">Bienvenido a FITEL</h1>
                        </div>
                        <div class="content">
                            <p>Hola <strong>{{NAME}}</strong>,</p>
                            <p>Se ha creado una cuenta de administrador para ti en el portal web de FITEL.</p>
                            <p>A continuación encontrarás tus credenciales de acceso:</p>
                            
                            <div class="credentials-box">
                                <div class="credential-row">
                                    <span class="label">Usuario:</span><br>
                                    <span class="value">{{USERNAME}}</span>
                                </div>
                                <div class="credential-row">
                                    <span class="label">Contraseña:</span><br>
                                    <span class="value">{{PASSWORD}}</span>
                                </div>
                            </div>
                            
                            <p>Por seguridad, te recomendamos cambiar tu contraseña al iniciar sesión por primera vez.</p>
                            
                            <div style="text-align: center;">
                                <a href="https://fitel.com.co/admin" class="button">Ir al Panel de Administración</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p>Este es un mensaje automático, por favor no responder.</p>
                            <p>&copy; 2024 FITEL. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .replace("{{NAME}}", name)
                .replace("{{USERNAME}}", username)
                .replace("{{PASSWORD}}", initialPassword);

            helper.setText(htmlContent, true);

            configuredSender.send(message);
            log.info("Correo de creación de cuenta enviado a: {}", to);

        } catch (MessagingException e) {
            log.error("Error enviando correo de creación de cuenta a {}: {}", to, e.getMessage());
        } catch (Exception e) {
            log.error("Error inesperado enviando correo a {}: {}", to, e.getMessage());
        }
    }
    
    /**
     * Generar link de recuperación de contraseña
     */
    public String generatePasswordResetLink(String token) {
        // En producción, usar el dominio del frontend
        String frontendUrl = System.getenv("FRONTEND_URL");
        if (frontendUrl == null || frontendUrl.isEmpty()) {
            frontendUrl = "https://fitel-frontend.blackocean-69d60157.eastus.azurecontainerapps.io";
        }
        return frontendUrl + "/operaciones-internas/reset-password?token=" + token;
    }
    
    /**
     * Enviar email de recuperación de contraseña
     */
    public void sendPasswordResetEmail(String to, String name, String resetLink) {
        JavaMailSender configuredSender = getConfiguredMailSender();
        if (configuredSender == null) {
            return;
        }

        EmailConfig emailConfig = getEmailConfig();

        try {
            MimeMessage message = configuredSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(emailConfig.getFromEmail());
            helper.setTo(to);
            helper.setSubject("Recuperación de Contraseña - FITEL");

            String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .container {
                            background-color: #f9f9f9;
                            border-radius: 10px;
                            padding: 30px;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 20px;
                            border-radius: 10px 10px 0 0;
                            text-align: center;
                        }
                        .content {
                            padding: 20px;
                            background: white;
                        }
                        .button {
                            display: inline-block;
                            padding: 15px 30px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            margin: 20px 0;
                            font-weight: bold;
                        }
                        .footer {
                            text-align: center;
                            padding: 20px;
                            color: #666;
                            font-size: 0.9em;
                        }
                        .warning {
                            background-color: #fff3cd;
                            border-left: 4px solid #ffc107;
                            padding: 15px;
                            margin: 20px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Recuperación de Contraseña</h1>
                        </div>
                        <div class="content">
                            <p>Hola <strong>{{NAME}}</strong>,</p>
                            
                            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en FITEL.</p>
                            
                            <p>Si solicitaste este cambio, haz clic en el siguiente botón para crear una nueva contraseña:</p>
                            
                            <div style="text-align: center;">
                                <a href="{{RESET_LINK}}" class="button">Restablecer Contraseña</a>
                            </div>
                            
                            <div class="warning">
                                <strong>⚠️ Importante:</strong>
                                <ul>
                                    <li>Este enlace expirará en <strong>1 hora</strong></li>
                                    <li>Si no solicitaste este cambio, ignora este correo</li>
                                    <li>Nunca compartas este enlace con nadie</li>
                                </ul>
                            </div>
                            
                            <p>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
                            <p style="word-break: break-all; color: #667eea;">{{RESET_LINK}}</p>
                        </div>
                        <div class="footer">
                            <p>Este es un mensaje automático, por favor no responder.</p>
                            <p>&copy; 2024 FITEL. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .replace("{{NAME}}", name)
                .replace("{{RESET_LINK}}", resetLink);

            helper.setText(htmlContent, true);

            configuredSender.send(message);
            log.info("Correo de recuperación de contraseña enviado a: {}", to);

        } catch (MessagingException e) {
            log.error("Error enviando correo de recuperación a {}: {}", to, e.getMessage());
            throw new RuntimeException("Error al enviar el correo de recuperación");
        } catch (Exception e) {
            log.error("Error inesperado enviando correo a {}: {}", to, e.getMessage());
            throw new RuntimeException("Error al enviar el correo de recuperación");
        }
    }
    
    /**
     * Enviar email de confirmación de cambio de contraseña
     */
    public void sendPasswordChangedConfirmation(String to, String name) {
        JavaMailSender configuredSender = getConfiguredMailSender();
        if (configuredSender == null) {
            return;
        }

        EmailConfig emailConfig = getEmailConfig();

        try {
            MimeMessage message = configuredSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(emailConfig.getFromEmail());
            helper.setTo(to);
            helper.setSubject("Contraseña Actualizada - FITEL");

            String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .container {
                            background-color: #f9f9f9;
                            border-radius: 10px;
                            padding: 30px;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                            color: white;
                            padding: 20px;
                            border-radius: 10px 10px 0 0;
                            text-align: center;
                        }
                        .content {
                            padding: 20px;
                            background: white;
                        }
                        .footer {
                            text-align: center;
                            padding: 20px;
                            color: #666;
                            font-size: 0.9em;
                        }
                        .success-box {
                            background-color: #d4edda;
                            border-left: 4px solid #28a745;
                            padding: 15px;
                            margin: 20px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ Contraseña Actualizada</h1>
                        </div>
                        <div class="content">
                            <p>Hola <strong>{{NAME}}</strong>,</p>
                            
                            <div class="success-box">
                                <p><strong>Tu contraseña ha sido actualizada exitosamente.</strong></p>
                            </div>
                            
                            <p>Si no realizaste este cambio, contacta inmediatamente al administrador del sistema.</p>
                            
                            <p>Fecha y hora del cambio: <strong>{{TIMESTAMP}}</strong></p>
                        </div>
                        <div class="footer">
                            <p>Este es un mensaje automático, por favor no responder.</p>
                            <p>&copy; 2024 FITEL. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .replace("{{NAME}}", name)
                .replace("{{TIMESTAMP}}", java.time.LocalDateTime.now().format(
                    java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")
                ));

            helper.setText(htmlContent, true);

            configuredSender.send(message);
            log.info("Correo de confirmación de cambio de contraseña enviado a: {}", to);

        } catch (MessagingException e) {
            log.error("Error enviando correo de confirmación a {}: {}", to, e.getMessage());
        } catch (Exception e) {
            log.error("Error inesperado enviando correo a {}: {}", to, e.getMessage());
        }
    }

    /**
     * Generar link de alerta de seguridad (botón "No fui yo")
     */
    public String generateSecurityAlertLink(String token) {
        String frontendUrl = System.getenv("FRONTEND_URL");
        if (frontendUrl == null || frontendUrl.isEmpty()) {
            frontendUrl = "https://fitel-frontend.blackocean-69d60157.eastus.azurecontainerapps.io";
        }
        return frontendUrl + "/operaciones-internas/security-alert?token=" + token;
    }

    /**
     * Enviar notificación de inicio de sesión con botón "No fui yo"
     */
    public void sendLoginNotificationEmail(String to, String name, String loginTime, String ip, String userAgent, String notMeLink) {
        JavaMailSender configuredSender = getConfiguredMailSender();
        if (configuredSender == null) {
            log.warn("Email no configurado, omitiendo notificación de login para: {}", to);
            return;
        }

        EmailConfig emailConfig = getEmailConfig();

        // Abreviar user-agent si es muy largo
        String deviceInfo = userAgent != null && userAgent.length() > 80
            ? userAgent.substring(0, 80) + "..."
            : (userAgent != null ? userAgent : "Desconocido");

        try {
            MimeMessage message = configuredSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(emailConfig.getFromEmail());
            helper.setTo(to);
            helper.setSubject("⚠️ Nuevo inicio de sesión detectado - FITEL");

            String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                        .container { background-color: #f9f9f9; border-radius: 10px; padding: 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #c0392b 0%, #922b21 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
                        .content { padding: 20px; background: white; }
                        .info-box { background: #f0f4f8; border-left: 4px solid #c0392b; padding: 15px; margin: 15px 0; border-radius: 0 5px 5px 0; }
                        .info-row { margin: 8px 0; font-size: 0.9em; }
                        .info-label { font-weight: bold; color: #555; }
                        .btn-danger { display: inline-block; padding: 14px 28px; background: #c0392b; color: white !important; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; font-size: 1em; }
                        .btn-ok { display: inline-block; padding: 10px 20px; background: #27ae60; color: white !important; text-decoration: none; border-radius: 6px; margin: 5px 0; font-size: 0.9em; }
                        .footer { text-align: center; padding: 20px; color: #888; font-size: 0.85em; }
                        .warning { background: #fef9c3; border-left: 4px solid #f59e0b; padding: 12px 15px; margin: 15px 0; border-radius: 0 5px 5px 0; font-size: 0.9em; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2 style="margin:0">🔐 Nuevo Inicio de Sesión</h2>
                            <p style="margin:5px 0 0; font-size:0.9em; opacity:0.9">Panel Administrativo FITEL</p>
                        </div>
                        <div class="content">
                            <p>Hola <strong>{{NAME}}</strong>,</p>
                            <p>Se detectó un nuevo inicio de sesión en tu cuenta de administrador FITEL:</p>

                            <div class="info-box">
                                <div class="info-row"><span class="info-label">🕐 Fecha y hora:</span> {{LOGIN_TIME}}</div>
                                <div class="info-row"><span class="info-label">🌐 Dirección IP:</span> {{IP}}</div>
                                <div class="info-row"><span class="info-label">💻 Dispositivo:</span> {{DEVICE}}</div>
                            </div>

                            <div class="warning">
                                <strong>¿No fuiste tú?</strong> Si no reconoces este inicio de sesión, actúa de inmediato para proteger tu cuenta.
                            </div>

                            <div style="text-align: center; margin: 25px 0;">
                                <a href="{{NOT_ME_LINK}}" class="btn-danger">🚨 No fui yo — Revocar sesiones y cambiar contraseña</a>
                            </div>

                            <p style="font-size:0.85em; color:#666; text-align:center">Si reconoces este acceso, puedes ignorar este mensaje.</p>
                            <p style="font-size:0.8em; color:#999; text-align:center">Este enlace expira en <strong>24 horas</strong>.</p>
                        </div>
                        <div class="footer">
                            <p>Este es un mensaje automático, por favor no responder.</p>
                            <p>&copy; 2024 FITEL. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .replace("{{NAME}}", name != null ? name : to)
                .replace("{{LOGIN_TIME}}", loginTime)
                .replace("{{IP}}", ip != null ? ip : "No disponible")
                .replace("{{DEVICE}}", deviceInfo)
                .replace("{{NOT_ME_LINK}}", notMeLink);

            helper.setText(htmlContent, true);
            configuredSender.send(message);
            log.info("Notificación de login enviada a: {}", to);

        } catch (MessagingException e) {
            log.error("Error enviando notificación de login a {}: {}", to, e.getMessage());
            throw new RuntimeException("Error al enviar notificación de login");
        } catch (Exception e) {
            log.error("Error inesperado enviando notificación de login a {}: {}", to, e.getMessage());
            throw new RuntimeException("Error al enviar notificación de login");
        }
    }

}

