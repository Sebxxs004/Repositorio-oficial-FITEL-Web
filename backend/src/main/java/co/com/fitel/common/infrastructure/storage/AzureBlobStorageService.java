package co.com.fitel.common.infrastructure.storage;

import co.com.fitel.common.service.StorageService;
import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name = "storage.provider", havingValue = "azure")
public class AzureBlobStorageService implements StorageService {

    private final BlobContainerClient blobContainerClient;

    public AzureBlobStorageService(
            @Value("${azure.storage.connection-string}") String connectionString,
            @Value("${azure.storage.container-name}") String containerName) {
        
        BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
                .connectionString(connectionString)
                .buildClient();
                
        this.blobContainerClient = blobServiceClient.getBlobContainerClient(containerName);
        
        // Ensure container exists
        if (!blobContainerClient.exists()) {
            blobContainerClient.create();
            log.info("Created Azure Blob Container: {}", containerName);
        }
    }

    @Override
    public String uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            
            String fileName = UUID.randomUUID().toString() + extension;
            BlobClient blobClient = blobContainerClient.getBlobClient(fileName);

            log.info("Uploading file to Azure Blob Storage: {}", fileName);
            blobClient.upload(file.getInputStream(), file.getSize(), true);
            
            return blobClient.getBlobUrl();
        } catch (IOException e) {
            log.error("Error uploading file to Azure Blob Storage", e);
            throw new RuntimeException("Error uploading file to cloud storage", e);
        }
    }

    @Override
    public List<String> uploadFiles(List<MultipartFile> files) {
        List<String> urls = new ArrayList<>();
        if (files == null || files.isEmpty()) {
            return urls;
        }

        for (MultipartFile file : files) {
            String url = uploadFile(file);
            if (url != null) {
                urls.add(url);
            }
        }
        return urls;
    }
}
