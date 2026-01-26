package co.com.fitel.modules.config.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactConfigDTO {
    private String phone;
    private String phoneDisplay;
    private String email;
    private String whatsapp;
}
