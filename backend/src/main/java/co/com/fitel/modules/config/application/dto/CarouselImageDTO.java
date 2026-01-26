package co.com.fitel.modules.config.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarouselImageDTO {
    private Long id;
    private String filename;
    private String url;
    private Integer order;
    private Boolean isActive;
}
