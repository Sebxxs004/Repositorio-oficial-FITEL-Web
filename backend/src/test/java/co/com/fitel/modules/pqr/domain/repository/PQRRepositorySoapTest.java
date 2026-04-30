package co.com.fitel.modules.pqr.domain.repository;

import co.com.fitel.modules.pqr.domain.model.PQR;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@org.springframework.test.context.TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;MODE=MariaDB;DB_CLOSE_DELAY=-1",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
class PQRRepositorySoapTest {

    @Autowired
    private PQRRepository pqrRepository;

    @Test
    @DisplayName("Debe guardar y buscar una PQR usando partes del CUN (anio, consecutivo)")
    void shouldFindPqrByCunParts() {
        // Arrange
        PQR pqr = PQR.builder()
                .cun("FITEL24000123")
                .type("QUEJA")
                .customerName("Juan Perez")
                .customerEmail("juan@test.com")
                .customerPhone("1234567")
                .customerDocumentType("CC")
                .customerDocumentNumber("101010")
                .subject("Test")
                .description("Desc")
                .status("RECIBIDA")
                .build();
        
        pqrRepository.saveAndFlush(pqr);

        // Act
        // año 2024 -> 24
        // consecutivo 123 -> 000123
        Optional<PQR> result = pqrRepository.findByCunParts(2024, 123);

        // Assert
        assertThat(result).isPresent();
        assertThat(result.get().getCun()).isEqualTo("FITEL24000123");
        assertThat(result.get().getCustomerName()).isEqualTo("Juan Perez");
    }

    @Test
    @DisplayName("Debe guardar 3 PQRs y buscarlas por tipo y numero de identificacion")
    void shouldFindPqrsByIdentificacion() {
        // Arrange
        PQR pqr1 = PQR.builder()
                .cun("FITEL24000001")
                .type("PETICION")
                .customerName("Empresa S.A.")
                .customerEmail("contacto@empresa.com")
                .customerPhone("9876543")
                .customerDocumentType("NIT")
                .customerDocumentNumber("900123456")
                .subject("Test 1")
                .description("Desc 1")
                .status("RECIBIDA")
                .build();

        PQR pqr2 = PQR.builder()
                .cun("FITEL24000002")
                .type("QUEJA")
                .customerName("Empresa S.A.")
                .customerEmail("contacto@empresa.com")
                .customerPhone("9876543")
                .customerDocumentType("NIT")
                .customerDocumentNumber("900123456")
                .subject("Test 2")
                .description("Desc 2")
                .status("RECIBIDA")
                .build();

        PQR pqr3 = PQR.builder()
                .cun("FITEL24000003")
                .type("RECURSO")
                .customerName("Empresa S.A.")
                .customerEmail("contacto@empresa.com")
                .customerPhone("9876543")
                .customerDocumentType("NIT")
                .customerDocumentNumber("900123456")
                .subject("Test 3")
                .description("Desc 3")
                .status("RECIBIDA")
                .build();
                
        // PQR de otro usuario
        PQR pqrOther = PQR.builder()
                .cun("FITEL24000004")
                .type("QUEJA")
                .customerName("Otro")
                .customerEmail("otro@test.com")
                .customerPhone("1111111")
                .customerDocumentType("CC")
                .customerDocumentNumber("999999")
                .subject("Test")
                .description("Desc")
                .status("RECIBIDA")
                .build();

        pqrRepository.saveAllAndFlush(List.of(pqr1, pqr2, pqr3, pqrOther));

        // Act
        List<PQR> results = pqrRepository.findByIdentificacion("NIT", "900123456");

        // Assert
        assertThat(results).hasSize(3);
        assertThat(results).extracting("cun")
                .containsExactlyInAnyOrder("FITEL24000001", "FITEL24000002", "FITEL24000003");
        
        // Verifica que se obtiene la entidad correctamente (ignorando los campos nativos extra)
        assertThat(results.get(0).getCustomerDocumentType()).isEqualTo("NIT");
    }
}
