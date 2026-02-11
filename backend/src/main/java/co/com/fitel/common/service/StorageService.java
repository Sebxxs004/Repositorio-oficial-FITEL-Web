package co.com.fitel.common.service;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface StorageService {
    String uploadFile(MultipartFile file);
    List<String> uploadFiles(List<MultipartFile> files);
}
