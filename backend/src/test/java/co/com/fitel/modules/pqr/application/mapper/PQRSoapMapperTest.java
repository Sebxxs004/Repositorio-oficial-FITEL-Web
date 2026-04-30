package co.com.fitel.modules.pqr.application.mapper;

import co.com.fitel.modules.pqr.domain.model.PQR;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.IntegracionCUN;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class PQRSoapMapperTest {

    private final PQRToSicXmlMapper mapper = new PQRToSicXmlMapper();

    @Test
    @DisplayName("Debe mapear correctamente una PQR de Persona Natural (CC)")
    void shouldMapPersonaNatural() {
        // Arrange
        PQR pqr = PQR.builder()
                .cun("FITEL24000123")
                .type("QUEJA")
                .customerName("Juan Carlos Perez Gomez")
                .customerDocumentType("CC")
                .customerDocumentNumber("10101010")
                .status("RECIBIDA")
                .build();
        pqr.setCreatedAt(LocalDateTime.of(2024, 1, 15, 10, 30));

        // Act
        IntegracionCUN result = mapper.toIntegracionCUN(pqr);

        // Assert
        assertThat(result.getCun()).isEqualTo("FITEL24000123");
        // Para CC, concatena o usa el nombre completo
        assertThat(result.getNombres()).isEqualTo("Juan Carlos Perez Gomez");
        assertThat(result.getIdentificacion()).isEqualTo("10101010");
        assertThat(result.getTipoQueja()).isEqualTo("QUEJA");
        assertThat(result.getEstadoTramite()).isEqualTo("En tramite");
        assertThat(result.getFechaAsignacion()).isEqualTo("2024-01-15");
        assertThat(result.getFechaRespuesta()).isNull();
    }

    @Test
    @DisplayName("Debe mapear correctamente una PQR de Persona Jurídica (NIT)")
    void shouldMapPersonaJuridica() {
        // Arrange
        PQR pqr = PQR.builder()
                .cun("FITEL24000124")
                .type("PETICION")
                .customerName("Empresa de Pruebas S.A.S.")
                .customerDocumentType("NIT")
                .customerDocumentNumber("900123456-1")
                .status("RESUELTA")
                .responseDate(LocalDateTime.of(2024, 2, 25, 9, 0))
                .build();
        pqr.setCreatedAt(LocalDateTime.of(2024, 2, 20, 14, 0));

        // Act
        IntegracionCUN result = mapper.toIntegracionCUN(pqr);

        // Assert
        assertThat(result.getCun()).isEqualTo("FITEL24000124");
        // Para NIT, extrae la razón social
        assertThat(result.getNombres()).isEqualTo("Empresa de Pruebas S.A.S.");
        assertThat(result.getIdentificacion()).isEqualTo("900123456-1");
        assertThat(result.getTipoQueja()).isEqualTo("PETICION");
        assertThat(result.getEstadoTramite()).isEqualTo("Resuelta");
        assertThat(result.getFechaAsignacion()).isEqualTo("2024-02-20");
        assertThat(result.getFechaRespuesta()).isEqualTo("2024-02-25");
    }

    @Test
    @DisplayName("Debe traducir los estados internos al texto exigido por la SIC")
    void shouldTranslateStatuses() {
        assertThat(mapper.mapStatusToSic("RECIBIDA")).isEqualTo("En tramite");
        assertThat(mapper.mapStatusToSic("EN_ANALISIS")).isEqualTo("En tramite");
        assertThat(mapper.mapStatusToSic("EN_RESPUESTA")).isEqualTo("En tramite");
        assertThat(mapper.mapStatusToSic("RESUELTA")).isEqualTo("Resuelta");
        assertThat(mapper.mapStatusToSic("CERRADA")).isEqualTo("Cerrada");
        assertThat(mapper.mapStatusToSic("OTRO")).isEqualTo("En tramite"); // Default
    }
}
