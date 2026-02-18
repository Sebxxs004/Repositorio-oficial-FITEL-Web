package co.com.fitel.common.infrastructure.controller;

import co.com.fitel.modules.pqr.domain.model.PQR;
import co.com.fitel.modules.pqr.domain.repository.PQRRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/uploads")
@RequiredArgsConstructor
public class SecureFileController {

    private final PQRRepository pqrRepository;

    @Value("${storage.local.location:uploads}")
    private String localUploadPath;

    /**
     * Sirve archivos públicos directamente desde /uploads/assets/ (carrusel, planes)
     * Soporta tanto archivos directos como en subcarpetas usando path wildcard
     */
    @GetMapping("/assets/**")
    public ResponseEntity<Resource> servePublicAssets(HttpServletRequest request) {
        // Extraer el path después de /uploads/assets/
        String fullPath = request.getRequestURI();
        String assetPath = fullPath.substring(fullPath.indexOf("/assets/") + 8); // +8 para saltar "/assets/"
        
        log.info("Requesting public asset: {}", assetPath);
        
        try {
            Path rootLocation = Paths.get(localUploadPath).toAbsolutePath().normalize();
            Path filePath = rootLocation.resolve("assets").resolve(assetPath).normalize();
            
            // Validar que el archivo esté dentro del directorio permitido
            if (!filePath.startsWith(rootLocation.resolve("assets"))) {
                log.warn("Path traversal attempt detected: {}", filePath);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Resource resource = new FileSystemResource(filePath);

            if (resource.exists() && resource.isReadable()) {
                String filename = filePath.getFileName().toString();
                String contentType = determineContentType(filename);
                
                log.info("Public asset found at {}, returning content type: {}", filePath, contentType);
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                log.error("Public asset NOT found at path: {}", filePath);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error serving public asset", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Sirve archivos protegidos de PQR - requiere CUN válido
     */
    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename, @RequestParam(required = false) String cun) {
        log.info("Requesting file: {} with CUN: {}", filename, cun);
        
        // Evitar que este endpoint maneje archivos de /assets/**
        if (filename.startsWith("assets/")) {
            log.warn("Attempt to access public assets through secure endpoint");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        if (cun == null || cun.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Validación de Contexto
        Optional<PQR> pqrOpt = pqrRepository.findByCun(cun);
        if (pqrOpt.isEmpty()) {
            log.warn("Access denied: Invalid CUN {}", cun);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        PQR pqr = pqrOpt.get();
        if (pqr.getDescription() == null || !pqr.getDescription().contains(filename)) {
            log.warn("Access denied: File {} not linked to PQR {}", filename, cun);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            Path rootLocation = Paths.get(localUploadPath).toAbsolutePath().normalize();
            Path filePath = rootLocation.resolve(filename).normalize();
            
            if (!filePath.getParent().equals(rootLocation)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            log.info("Attempting to read file from filesystem: {}", filePath);
            
            // Usar FileSystemResource que es más directo para archivos locales
            Resource resource = new FileSystemResource(filePath);

            if (resource.exists()) {
                String contentType = determineContentType(filename);
                
                log.info("File found, returning content type: {}", contentType);
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                log.error("File NOT found at path: {}. Exists: {}, Readable: {}", 
                    filePath, resource.exists(), resource.isReadable());
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error serving file", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Determina el content type basado en la extensión del archivo
     */
    private String determineContentType(String filename) {
        String lowerName = filename.toLowerCase();
        if (lowerName.endsWith(".pdf")) {
            return "application/pdf";
        } else if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (lowerName.endsWith(".png")) {
            return "image/png";
        } else if (lowerName.endsWith(".gif")) {
            return "image/gif";
        } else if (lowerName.endsWith(".webp")) {
            return "image/webp";
        } else if (lowerName.endsWith(".svg")) {
            return "image/svg+xml";
        }
        return "application/octet-stream";
    }
}
