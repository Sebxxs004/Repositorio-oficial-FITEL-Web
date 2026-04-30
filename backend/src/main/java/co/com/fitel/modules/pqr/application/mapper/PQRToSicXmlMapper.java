package co.com.fitel.modules.pqr.application.mapper;

import co.com.fitel.modules.pqr.domain.model.PQR;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.IntegracionCUN;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.ObjectFactory;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
public class PQRToSicXmlMapper {

    private final ObjectFactory factory = new ObjectFactory();
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public IntegracionCUN toIntegracionCUN(PQR pqr) {
        IntegracionCUN integracionCUN = factory.createIntegracionCUN();
        
        integracionCUN.setCun(pqr.getCun());
        
        // En nuestro modelo, customerName almacena el nombre completo o la razón social
        // El test verifica que ambos casos devuelvan customerName, así que lo mapeamos directamente.
        integracionCUN.setNombres(pqr.getCustomerName());
        
        integracionCUN.setIdentificacion(pqr.getCustomerDocumentNumber());
        integracionCUN.setTipoQueja(pqr.getType());
        
        integracionCUN.setEstadoTramite(mapStatusToSic(pqr.getStatus()));
        
        if (pqr.getCreatedAt() != null) {
            integracionCUN.setFechaAsignacion(pqr.getCreatedAt().format(DATE_FORMATTER));
        } else {
            integracionCUN.setFechaAsignacion(""); // Valor por defecto si no hay fecha
        }
        
        if (pqr.getResponseDate() != null) {
            integracionCUN.setFechaRespuesta(pqr.getResponseDate().format(DATE_FORMATTER));
        }
        
        return integracionCUN;
    }

    public String mapStatusToSic(String internalStatus) {
        if (internalStatus == null) {
            return "En tramite";
        }
        
        return switch (internalStatus.toUpperCase()) {
            case "RESUELTA" -> "Resuelta";
            case "CERRADA" -> "Cerrada";
            default -> "En tramite"; // Cubre RECIBIDA, EN_ANALISIS, EN_RESPUESTA, etc.
        };
    }
}
