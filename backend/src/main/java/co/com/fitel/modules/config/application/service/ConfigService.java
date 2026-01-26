package co.com.fitel.modules.config.application.service;

import co.com.fitel.modules.config.application.dto.CarouselImageDTO;
import co.com.fitel.modules.config.application.dto.ContactConfigDTO;
import co.com.fitel.modules.config.domain.model.CarouselImage;
import co.com.fitel.modules.config.domain.model.ContactConfig;
import co.com.fitel.modules.config.domain.repository.CarouselImageRepository;
import co.com.fitel.modules.config.domain.repository.ContactConfigRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConfigService {
    
    private final ContactConfigRepository contactConfigRepository;
    private final CarouselImageRepository carouselImageRepository;
    
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
}
