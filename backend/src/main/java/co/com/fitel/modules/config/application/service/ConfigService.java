package co.com.fitel.modules.config.application.service;

import co.com.fitel.modules.config.application.dto.CarouselImageDTO;
import co.com.fitel.modules.config.application.dto.ContactConfigDTO;
import co.com.fitel.modules.config.application.dto.EmailConfigDTO;
import co.com.fitel.modules.config.domain.model.CarouselImage;
import co.com.fitel.modules.config.domain.model.ContactConfig;
import co.com.fitel.modules.config.domain.model.EmailConfig;
import co.com.fitel.modules.config.domain.repository.CarouselImageRepository;
import co.com.fitel.modules.config.domain.repository.ContactConfigRepository;
import co.com.fitel.modules.config.domain.repository.EmailConfigRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConfigService {
    
    private static final Logger log = LoggerFactory.getLogger(ConfigService.class);
    
    private final ContactConfigRepository contactConfigRepository;
    private final CarouselImageRepository carouselImageRepository;
    private final EmailConfigRepository emailConfigRepository;

    public ConfigService(ContactConfigRepository contactConfigRepository, CarouselImageRepository carouselImageRepository, EmailConfigRepository emailConfigRepository) {
        this.contactConfigRepository = contactConfigRepository;
        this.carouselImageRepository = carouselImageRepository;
        this.emailConfigRepository = emailConfigRepository;
    }
    
    @Transactional(readOnly = true)
    public ContactConfigDTO getContactConfig() {
        ContactConfig config = contactConfigRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> {
                    // Crear configuración por defecto si no existe
                    ContactConfig defaultConfig = new ContactConfig();
                    defaultConfig.setPhone("573108830925");
                    defaultConfig.setPhoneDisplay("+57 310 883 0925");
                    defaultConfig.setEmail("contacto@fitel.com.co");
                    defaultConfig.setWhatsapp("573108830925");
                    return contactConfigRepository.save(defaultConfig);
                });
        
        ContactConfigDTO dto = new ContactConfigDTO();
        dto.setPhone(config.getPhone());
        dto.setPhoneDisplay(config.getPhoneDisplay());
        dto.setEmail(config.getEmail());
        dto.setWhatsapp(config.getWhatsapp());
        return dto;
    }
    
    @Transactional
    public ContactConfigDTO updateContactConfig(ContactConfigDTO dto) {
        ContactConfig config = contactConfigRepository.findFirstByOrderByIdAsc()
                .orElse(new ContactConfig());
        
        config.setPhone(dto.getPhone());
        config.setPhoneDisplay(dto.getPhoneDisplay());
        config.setEmail(dto.getEmail());
        config.setWhatsapp(dto.getWhatsapp());
        
        ContactConfig saved = contactConfigRepository.save(config);
        
        ContactConfigDTO response = new ContactConfigDTO();
        response.setPhone(saved.getPhone());
        response.setPhoneDisplay(saved.getPhoneDisplay());
        response.setEmail(saved.getEmail());
        response.setWhatsapp(saved.getWhatsapp());
        
        log.info("Contact config updated: phone={}, email={}", saved.getPhone(), saved.getEmail());
        return response;
    }
    
    @Transactional(readOnly = true)
    public List<CarouselImageDTO> getCarouselImages() {
        List<CarouselImage> images = carouselImageRepository.findAllByOrderByOrderIndexAsc();
        return images.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public CarouselImageDTO addCarouselImage(String filename, String filePath) {
        // Obtener el siguiente orden
        List<CarouselImage> existing = carouselImageRepository.findAllByOrderByOrderIndexAsc();
        int nextOrder = existing.isEmpty() ? 1 : existing.get(existing.size() - 1).getOrderIndex() + 1;
        
        CarouselImage image = new CarouselImage();
        image.setFilename(filename);
        image.setFilePath(filePath);
        image.setOrderIndex(nextOrder);
        image.setIsActive(true);
        
        CarouselImage saved = carouselImageRepository.save(image);
        log.info("Carousel image added: id={}, filename={}", saved.getId(), saved.getFilename());
        return toDTO(saved);
    }
    
    @Transactional
    public void deleteCarouselImage(Long id) {
        carouselImageRepository.deleteById(id);
        log.info("Carousel image deleted: id={}", id);
    }
    
    @Transactional
    public void reorderCarouselImages(List<Long> imageIds) {
        for (int i = 0; i < imageIds.size(); i++) {
            final int index = i;
            final Long imageId = imageIds.get(index);
            CarouselImage image = carouselImageRepository.findById(imageId)
                    .orElseThrow(() -> new RuntimeException("Image not found: " + imageId));
            image.setOrderIndex(index + 1);
            carouselImageRepository.save(image);
        }
        log.info("Carousel images reordered: {} images", imageIds.size());
    }
    
    private CarouselImageDTO toDTO(CarouselImage image) {
        CarouselImageDTO dto = new CarouselImageDTO();
        dto.setId(image.getId());
        dto.setFilename(image.getFilename());
        dto.setUrl(image.getFilePath());
        dto.setOrder(image.getOrderIndex());
        dto.setIsActive(image.getIsActive());
        return dto;
    }
    
    // Email Config
    @Transactional(readOnly = true)
    public EmailConfigDTO getEmailConfig() {
        EmailConfig config = emailConfigRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> {
                    // Crear configuración por defecto si no existe
                    EmailConfig defaultConfig = new EmailConfig();
                    defaultConfig.setEmail("sebastincano12560@gmail.com");
                    defaultConfig.setAppPassword("zspgebdrjeoducpz");
                    defaultConfig.setSmtpHost("smtp.gmail.com");
                    defaultConfig.setSmtpPort(587);
                    defaultConfig.setEnabled(true);
                    return emailConfigRepository.save(defaultConfig);
                });
        
        EmailConfigDTO dto = new EmailConfigDTO();
        dto.setEmail(config.getEmail());
        dto.setAppPassword(""); // No devolver la contraseña por seguridad
        dto.setSmtpHost(config.getSmtpHost());
        dto.setSmtpPort(config.getSmtpPort());
        dto.setEnabled(config.getEnabled());
        return dto;
    }
    
    @Transactional
    public EmailConfigDTO updateEmailConfig(EmailConfigDTO dto) {
        EmailConfig config = emailConfigRepository.findFirstByOrderByIdAsc()
                .orElse(new EmailConfig());
        
        config.setEmail(dto.getEmail());
        if (dto.getAppPassword() != null && !dto.getAppPassword().isEmpty()) {
            // Solo actualizar si se proporciona una nueva contraseña
            config.setAppPassword(dto.getAppPassword().replaceAll("\\s+", "")); // Remover espacios
        }
        if (dto.getSmtpHost() != null) {
            config.setSmtpHost(dto.getSmtpHost());
        }
        if (dto.getSmtpPort() != null) {
            config.setSmtpPort(dto.getSmtpPort());
        }
        if (dto.getEnabled() != null) {
            config.setEnabled(dto.getEnabled());
        }
        
        EmailConfig saved = emailConfigRepository.save(config);
        
        EmailConfigDTO response = new EmailConfigDTO();
        response.setEmail(saved.getEmail());
        response.setAppPassword(""); // No devolver la contraseña
        response.setSmtpHost(saved.getSmtpHost());
        response.setSmtpPort(saved.getSmtpPort());
        response.setEnabled(saved.getEnabled());
        
        log.info("Email config updated: email={}, enabled={}", saved.getEmail(), saved.getEnabled());
        return response;
    }
}
