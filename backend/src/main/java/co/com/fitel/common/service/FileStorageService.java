package co.com.fitel.common.service;

import co.com.fitel.common.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService(@Value("${fitel.storage.upload-dir:frontend/public/assets/canales}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            // Logear pero no fallar drásticamente si es un problema de permisos en dev, aunque debería
            System.err.println("Advertencia: No se pudo crear el directorio de subida: " + ex.getMessage());
        }
    }

    public String storeFile(MultipartFile file) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        
        try {
            if(originalFileName.contains("..")) {
                throw new BusinessException("Nombre de archivo inválido " + originalFileName, HttpStatus.BAD_REQUEST);
            }

            // Generar nombre único para evitar colisiones
            String fileExtension = "";
            int i = originalFileName.lastIndexOf('.');
            if (i > 0) {
                fileExtension = originalFileName.substring(i);
            }
            
            String fileName = UUID.randomUUID().toString() + fileExtension;

            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return "/assets/canales/" + fileName;
        } catch (IOException ex) {
            throw new BusinessException("No se pudo guardar el archivo " + originalFileName + ". Intente nuevamente.", HttpStatus.INTERNAL_SERVER_ERROR, ex);
        }
    }
}
