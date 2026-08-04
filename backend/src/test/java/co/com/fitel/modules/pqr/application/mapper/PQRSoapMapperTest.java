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
        PQR pqr = PQR.builder()
                .cun("745526000123")
                .type("QUEJA")
                .customerName("Juan Carlos Perez Gomez")
                .customerDocumentType("CC")
                .customerDocumentNumber("10101010")
                .status("RECIBIDA")
                .build();
        pqr.setCreatedAt(LocalDateTime.of(2024, 1, 15, 10, 30, 0));

        IntegracionCUN result = mapper.toIntegracionCUN(pqr);

        assertThat(result.getNombreOperador()).isEqualTo("FITEL COLOMBIA");
        assertThat(result.getCodigoUnicoNumerico().getIdentificadorOperador()).isEqualTo("7456");
        assertThat(result.getCodigoUnicoNumerico().getAnoRadicacionCun()).isEqualTo("26");
        assertThat(result.getCodigoUnicoNumerico().getConsecutivoRadCun()).isEqualTo("000123");

        // Persona Natural: nombre en nomPersona, razonSocial vacía
        assertThat(result.getNomPersona().getPrimerNombre()).isEqualTo("Juan");
        assertThat(result.getNomPersona().getSegundoNombre()).isEqualTo("Carlos");
        assertThat(result.getNomPersona().getPrimerApellido()).isEqualTo("Perez");
        assertThat(result.getNomPersona().getSegundoApellido()).isEqualTo("Gomez");
        assertThat(result.getRazonSocial()).isEmpty();

        assertThat(result.getTipoIdNacionalPersona().getCodTipoIdNacionalPersona()).isEqualTo("CC");
        assertThat(result.getTipoIdNacionalPersona().getNomTipoIdentificacionNacionalPersona())
                .isEqualTo("CEDULA DE CIUDADANIA");
        assertThat(result.getGrupoNumeroIdentificacion()).isEqualTo("10101010");
        assertThat(result.getDescripcionEstado()).isEqualTo("ANALISIS POR PARTE DEL OPERADOR");
        assertThat(result.getFechaAsignacion()).isEqualTo("2024-01-15T10:30:00");
        assertThat(result.getTipoQuejaSic().getNomTipoQuejaSic()).isEqualTo("QUEJA");
        assertThat(result.getTipoQuejaSic().getCodTipoQuejaSic()).isEqualTo("2");
        assertThat(result.getFechaEstRespuesta()).isNull();
    }

    @Test
    @DisplayName("Debe mapear correctamente una PQR de Persona Jurídica (NIT)")
    void shouldMapPersonaJuridica() {
        PQR pqr = PQR.builder()
                .cun("745524000124")
                .type("PETICION")
                .customerName("Empresa de Pruebas S.A.S.")
                .customerDocumentType("NIT")
                .customerDocumentNumber("900123456-1")
                .status("RESUELTA")
                .responseDate(LocalDateTime.of(2024, 2, 25, 9, 0, 0))
                .build();
        pqr.setCreatedAt(LocalDateTime.of(2024, 2, 20, 14, 0, 0));

        IntegracionCUN result = mapper.toIntegracionCUN(pqr);

        // Persona Jurídica: nombre en razonSocial, nomPersona vacía
        assertThat(result.getRazonSocial()).isEqualTo("Empresa de Pruebas S.A.S.");
        assertThat(result.getNomPersona().getPrimerNombre()).isEmpty();
        assertThat(result.getNomPersona().getSegundoNombre()).isEmpty();
        assertThat(result.getNomPersona().getPrimerApellido()).isEmpty();

        assertThat(result.getTipoIdNacionalPersona().getCodTipoIdNacionalPersona()).isEqualTo("NIT");
        assertThat(result.getTipoIdNacionalPersona().getNomTipoIdentificacionNacionalPersona())
                .isEqualTo("NUMERO DE IDENTIFICACION TRIBUTARIA");
        assertThat(result.getGrupoNumeroIdentificacion()).isEqualTo("900123456-1");
        assertThat(result.getDescripcionEstado()).isEqualTo("RESUELTA");
        assertThat(result.getFechaAsignacion()).isEqualTo("2024-02-20T14:00:00");
        assertThat(result.getFechaEstRespuesta()).isEqualTo("2024-02-25");
        assertThat(result.getTipoQuejaSic().getCodTipoQuejaSic()).isEqualTo("1");
    }

    @Test
    @DisplayName("Debe traducir los estados internos al texto exigido por la SIC")
    void shouldTranslateStatuses() {
        assertThat(mapper.mapStatusToSic("RECIBIDA")).isEqualTo("ANALISIS POR PARTE DEL OPERADOR");
        assertThat(mapper.mapStatusToSic("EN_ANALISIS")).isEqualTo("ANALISIS POR PARTE DEL OPERADOR");
        assertThat(mapper.mapStatusToSic("EN_RESPUESTA")).isEqualTo("ANALISIS POR PARTE DEL OPERADOR");
        assertThat(mapper.mapStatusToSic("RESUELTA")).isEqualTo("RESUELTA");
        assertThat(mapper.mapStatusToSic("CERRADA")).isEqualTo("CERRADA");
        assertThat(mapper.mapStatusToSic("OTRO")).isEqualTo("ANALISIS POR PARTE DEL OPERADOR");
    }
}
