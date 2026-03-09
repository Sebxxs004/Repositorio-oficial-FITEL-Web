package co.com.fitel.modules.config.infrastructure.controller;

import co.com.fitel.common.dto.ApiResponse;
import co.com.fitel.common.service.EmailService;
import co.com.fitel.modules.config.application.dto.CarouselImageDTO;
import co.com.fitel.modules.config.application.dto.ContactConfigDTO;
import co.com.fitel.modules.config.application.dto.EmailConfigDTO;
import co.com.fitel.modules.config.application.service.ConfigService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/config")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(originPatterns = "*", allowCredentials = "true", maxAge = 3600)
public class ConfigController {
    
    private final ConfigService configService;
    private final EmailService emailService;
    private static final String UPLOAD_DIR = "uploads/assets/";
    
    @GetMapping("/contact")
    public ResponseEntity<ApiResponse<ContactConfigDTO>> getContactConfig() {
        log.info("GET /api/config/contact - Fetching contact config");
        ContactConfigDTO config = configService.getContactConfig();
        return ResponseEntity.ok(ApiResponse.success("Configuración de contacto obtenida", config));
    }
    
    @PutMapping("/contact")
    public ResponseEntity<ApiResponse<ContactConfigDTO>> updateContactConfig(@RequestBody ContactConfigDTO dto) {
        log.info("PUT /api/config/contact - Updating contact config");
        ContactConfigDTO updated = configService.updateContactConfig(dto);
        return ResponseEntity.ok(ApiResponse.success("Configuración de contacto actualizada", updated));
    }
    
    @GetMapping("/carousel")
    public ResponseEntity<ApiResponse<List<CarouselImageDTO>>> getCarouselImages() {
        log.info("GET /api/config/carousel - Fetching carousel images");
        List<CarouselImageDTO> images = configService.getCarouselImages();
        return ResponseEntity.ok(ApiResponse.success("Imágenes del carrusel obtenidas", images));
    }
    
    @PostMapping("/carousel/upload")
    public ResponseEntity<ApiResponse<CarouselImageDTO>> uploadCarouselImage(@RequestParam("image") MultipartFile file) {
        log.info("POST /api/config/carousel/upload - Uploading carousel image");
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("El archivo está vacío"));
        }
        
        try {
            // Generar nombre único para el archivo
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                    : ".png";
            String filename = "slider_" + UUID.randomUUID().toString() + extension;
            String filePath = "/uploads/assets/" + filename;
            
            // Guardar el archivo
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            Path filePathFull = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePathFull, StandardCopyOption.REPLACE_EXISTING);
            
            // Guardar en la base de datos
            CarouselImageDTO saved = configService.addCarouselImage(originalFilename != null ? originalFilename : filename, filePath);
            
            return ResponseEntity.ok(ApiResponse.success("Imagen subida correctamente", saved));
        } catch (IOException e) {
            log.error("Error uploading carousel image", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al subir la imagen: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/carousel/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCarouselImage(@PathVariable Long id) {
        log.info("DELETE /api/config/carousel/{} - Deleting carousel image", id);
        configService.deleteCarouselImage(id);
        return ResponseEntity.ok(ApiResponse.success("Imagen eliminada correctamente", null));
    }
    
    @PutMapping("/carousel/reorder")
    public ResponseEntity<ApiResponse<Void>> reorderCarouselImages(@RequestBody ReorderRequest request) {
        log.info("PUT /api/config/carousel/reorder - Reordering carousel images");
        configService.reorderCarouselImages(request.getImageIds());
        return ResponseEntity.ok(ApiResponse.success("Orden actualizado correctamente", null));
    }
    
    // Clase interna para el request de reordenamiento
    public static class ReorderRequest {
        private List<Long> imageIds;
        
        public List<Long> getImageIds() {
            return imageIds;
        }
        
        public void setImageIds(List<Long> imageIds) {
            this.imageIds = imageIds;
        }
    }
    
    @GetMapping("/email")
    public ResponseEntity<ApiResponse<EmailConfigDTO>> getEmailConfig() {
        log.info("GET /api/config/email - Fetching email config");
        EmailConfigDTO config = configService.getEmailConfig();
        return ResponseEntity.ok(ApiResponse.success("Configuración de email obtenida", config));
    }
    
    @PutMapping("/email")
    public ResponseEntity<ApiResponse<EmailConfigDTO>> updateEmailConfig(@RequestBody EmailConfigDTO dto) {
        log.info("PUT /api/config/email - Updating email config");
        EmailConfigDTO updated = configService.updateEmailConfig(dto);
        return ResponseEntity.ok(ApiResponse.success("Configuración de email actualizada", updated));
    }
    
    @PostMapping("/email/test")
    public ResponseEntity<ApiResponse<String>> testEmail(@RequestParam String to) {
        log.info("POST /api/config/email/test - Testing email to: {}", to);
        try {
            String subject = "Correo de Prueba - FITEL Web";
            String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
                        .success-box { background-color: #d1fae5; border: 2px solid #10b981; padding: 15px; margin: 20px 0; text-align: center; border-radius: 8px; }
                        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>FITEL - Correo de Prueba</h1>
                        </div>
                        <div class="content">
                            <p>Estimado/a usuario,</p>
                            <div class="success-box">
                                <h2 style="margin: 0; color: #065f46;">✓ Correo de Prueba Exitoso</h2>
                                <p style="margin: 10px 0 0 0; color: #047857;">El sistema de envío de correos electrónicos está funcionando correctamente.</p>
                            </div>
                            <p>Este es un correo de prueba enviado desde el sistema FITEL Web para verificar que la configuración de email está funcionando correctamente.</p>
                            <p>Si recibió este correo, significa que:</p>
                            <ul>
                                <li>La configuración de SMTP es correcta</li>
                                <li>Las credenciales de email son válidas</li>
                                <li>El servicio de correo está operativo</li>
                            </ul>
                            <p>Atentamente,<br><strong>Equipo FITEL</strong></p>
                        </div>
                        <div class="footer">
                            <p>Este es un correo automático de prueba, por favor no responda a este mensaje.</p>
                            <p>FITEL - Uniendo Familias</p>
                        </div>
                    </div>
                </body>
                </html>
                """;
            
            emailService.sendHtmlEmail(to, subject, htmlContent);
            return ResponseEntity.ok(ApiResponse.success("Correo de prueba enviado exitosamente a: " + to, "OK"));
        } catch (Exception e) {
            log.error("Error enviando correo de prueba a {}: {}", to, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al enviar correo de prueba: " + e.getMessage()));
        }
    }
}
