package co.com.fitel.modules.pqr.application.service;

import co.com.fitel.modules.pqr.application.mapper.PQRToSicXmlMapper;
import co.com.fitel.modules.pqr.domain.model.PQR;
import co.com.fitel.modules.pqr.domain.repository.PQRRepository;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.IntegracionCUN;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PQRSoapServiceTest {

    @Mock
    private PQRRepository pqrRepository;

    @Mock
    private PQRToSicXmlMapper mapper;

    @InjectMocks
    private PQRSoapService pqrSoapService;

    @Test
    @DisplayName("Debe buscar por CUN cuando AA y CR son mayores a 0")
    void shouldFindByCunWhenAaAndCrAreGreaterThanZero() {
        // Arrange
        int aa = 24;
        int cr = 123;
        PQR mockPqr = new PQR();
        IntegracionCUN mockIntegracion = new IntegracionCUN();
        
        when(pqrRepository.findByCunParts(aa, cr)).thenReturn(Optional.of(mockPqr));
        when(mapper.toIntegracionCUN(mockPqr)).thenReturn(mockIntegracion);

        // Act
        List<IntegracionCUN> result = pqrSoapService.consultarTramites(aa, cr, "CC", "101010");

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0)).isSameAs(mockIntegracion);
        
        verify(pqrRepository).findByCunParts(aa, cr);
        verify(pqrRepository, never()).findByIdentificacion(any(), any());
        verify(mapper).toIntegracionCUN(mockPqr);
    }

    @Test
    @DisplayName("Debe buscar por Identificacion cuando AA o CR son 0 o nulos")
    void shouldFindByIdentificacionWhenAaOrCrAreZero() {
        // Arrange
        String tipoId = "CC";
        String numeroId = "101010";
        PQR mockPqr1 = new PQR();
        mockPqr1.setId(1L);
        PQR mockPqr2 = new PQR();
        mockPqr2.setId(2L);
        IntegracionCUN mockIntegracion1 = new IntegracionCUN();
        IntegracionCUN mockIntegracion2 = new IntegracionCUN();

        when(pqrRepository.findByIdentificacion(tipoId, numeroId)).thenReturn(List.of(mockPqr1, mockPqr2));
        when(mapper.toIntegracionCUN(mockPqr1)).thenReturn(mockIntegracion1);
        when(mapper.toIntegracionCUN(mockPqr2)).thenReturn(mockIntegracion2);

        // Act
        List<IntegracionCUN> result = pqrSoapService.consultarTramites(0, 0, tipoId, numeroId);

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result).containsExactly(mockIntegracion1, mockIntegracion2);
        
        verify(pqrRepository).findByIdentificacion(tipoId, numeroId);
        verify(pqrRepository, never()).findByCunParts(anyInt(), anyInt());
        verify(mapper, times(2)).toIntegracionCUN(any());
    }

    @Test
    @DisplayName("Debe retornar lista vacía si la búsqueda por CUN no arroja resultados")
    void shouldReturnEmptyListWhenCunNotFound() {
        // Arrange
        when(pqrRepository.findByCunParts(24, 123)).thenReturn(Optional.empty());

        // Act
        List<IntegracionCUN> result = pqrSoapService.consultarTramites(24, 123, "CC", "101010");

        // Assert
        assertThat(result).isEmpty();
        verify(mapper, never()).toIntegracionCUN(any());
    }

    @Test
    @DisplayName("Debe retornar lista vacía si la búsqueda por Identificación no arroja resultados")
    void shouldReturnEmptyListWhenIdentificacionNotFound() {
        // Arrange
        when(pqrRepository.findByIdentificacion("NIT", "900")).thenReturn(Collections.emptyList());

        // Act
        List<IntegracionCUN> result = pqrSoapService.consultarTramites(0, 0, "NIT", "900");

        // Assert
        assertThat(result).isEmpty();
        verify(mapper, never()).toIntegracionCUN(any());
    }
}
