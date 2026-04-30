package co.com.fitel.modules.pqr.infrastructure.soap;

import co.com.fitel.modules.pqr.application.service.PQRSoapService;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.IntegracionCUN;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.webservices.server.WebServiceServerTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.ApplicationContext;
import org.springframework.xml.transform.StringSource;
import org.springframework.ws.test.server.MockWebServiceClient;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.ws.test.server.RequestCreators.withPayload;
import static org.springframework.ws.test.server.ResponseMatchers.noFault;
import static org.springframework.ws.test.server.ResponseMatchers.payload;
import static org.springframework.ws.test.server.ResponseMatchers.xpath;

@WebServiceServerTest(endpoints = PQREndpoint.class)
class PQREndpointIntegrationTest {

    @Autowired
    private MockWebServiceClient mockClient;

    @MockBean
    private PQRSoapService pqrSoapService;

    @MockBean
    private org.springframework.data.jpa.mapping.JpaMetamodelMappingContext jpaMetamodelMappingContext;

    @BeforeEach
    void setUp(ApplicationContext applicationContext) {
        // En algunas versiones de Spring Boot, el MockWebServiceClient se auto-configura con el ApplicationContext
        // pero por si acaso, ya está inyectado si se usa @WebServiceServerTest
    }

    @Test
    @DisplayName("A) Debe procesar petición por CUN válido y retornar 1 nodo IntegracionCUN")
    void testPeticionPorCunValido() throws Exception {
        // Arrange
        String requestXml = 
            "<soap:consultaCUNRequest xmlns:soap=\"http://fitel.com.co/pqr/soap\">" +
            "  <soap:IO>12345</soap:IO>" +
            "  <soap:AA>24</soap:AA>" +
            "  <soap:CR>1</soap:CR>" +
            "  <soap:tipoIdentificacion></soap:tipoIdentificacion>" +
            "  <soap:numeroIdentificacion></soap:numeroIdentificacion>" +
            "</soap:consultaCUNRequest>";

        IntegracionCUN mockIntegracion = new IntegracionCUN();
        mockIntegracion.setNombres("Juan Perez");
        mockIntegracion.setIdentificacion("101010");
        mockIntegracion.setCun("FITEL24000001");
        mockIntegracion.setFechaAsignacion("2024-01-01");
        mockIntegracion.setTipoQueja("QUEJA");
        mockIntegracion.setEstadoTramite("En tramite");

        when(pqrSoapService.consultarTramites(24, 1, "", "")).thenReturn(List.of(mockIntegracion));

        // Act & Assert
        mockClient.sendRequest(withPayload(new StringSource(requestXml)))
                .andExpect(noFault())
                .andExpect(xpath("/soap:consultaCUNResponse/soap:ArrayOfIntegracionCUN/soap:IntegracionCUN", 
                                 Collections.singletonMap("soap", "http://fitel.com.co/pqr/soap")).exists())
                .andExpect(xpath("/soap:consultaCUNResponse/soap:ArrayOfIntegracionCUN/soap:IntegracionCUN/soap:cun", 
                                 Collections.singletonMap("soap", "http://fitel.com.co/pqr/soap")).evaluatesTo("FITEL24000001"));
    }

    @Test
    @DisplayName("B) Debe procesar petición por Cédula y retornar múltiples nodos IntegracionCUN")
    void testPeticionPorCedula() throws Exception {
        // Arrange
        String requestXml = 
            "<soap:consultaCUNRequest xmlns:soap=\"http://fitel.com.co/pqr/soap\">" +
            "  <soap:IO></soap:IO>" +
            "  <soap:AA>0</soap:AA>" +
            "  <soap:CR>0</soap:CR>" +
            "  <soap:tipoIdentificacion>CC</soap:tipoIdentificacion>" +
            "  <soap:numeroIdentificacion>101010</soap:numeroIdentificacion>" +
            "</soap:consultaCUNRequest>";

        IntegracionCUN mockIntegracion1 = new IntegracionCUN();
        mockIntegracion1.setNombres("Juan Perez");
        mockIntegracion1.setIdentificacion("101010");
        mockIntegracion1.setCun("FITEL24000001");
        mockIntegracion1.setFechaAsignacion("2024-01-01");
        mockIntegracion1.setTipoQueja("QUEJA");
        mockIntegracion1.setEstadoTramite("En tramite");
        
        IntegracionCUN mockIntegracion2 = new IntegracionCUN();
        mockIntegracion2.setNombres("Juan Perez");
        mockIntegracion2.setIdentificacion("101010");
        mockIntegracion2.setCun("FITEL24000002");
        mockIntegracion2.setFechaAsignacion("2024-01-02");
        mockIntegracion2.setTipoQueja("PETICION");
        mockIntegracion2.setEstadoTramite("Resuelta");

        when(pqrSoapService.consultarTramites(0, 0, "CC", "101010")).thenReturn(List.of(mockIntegracion1, mockIntegracion2));

        // Act & Assert
        mockClient.sendRequest(withPayload(new StringSource(requestXml)))
                .andExpect(noFault())
                .andExpect(xpath("count(/soap:consultaCUNResponse/soap:ArrayOfIntegracionCUN/soap:IntegracionCUN)", 
                                 Collections.singletonMap("soap", "http://fitel.com.co/pqr/soap")).evaluatesTo(2));
    }

    @Test
    @DisplayName("C) Debe retornar ArrayOfIntegracionCUN vacío si no hay datos, sin dar error 500")
    void testPeticionSinDatos() throws Exception {
        // Arrange
        String requestXml = 
            "<soap:consultaCUNRequest xmlns:soap=\"http://fitel.com.co/pqr/soap\">" +
            "  <soap:IO></soap:IO>" +
            "  <soap:AA>99</soap:AA>" +
            "  <soap:CR>999</soap:CR>" +
            "  <soap:tipoIdentificacion></soap:tipoIdentificacion>" +
            "  <soap:numeroIdentificacion></soap:numeroIdentificacion>" +
            "</soap:consultaCUNRequest>";

        when(pqrSoapService.consultarTramites(99, 999, "", "")).thenReturn(Collections.emptyList());

        // Expected Payload (the array should be present but empty)
        String expectedResponseXml = 
            "<ns2:consultaCUNResponse xmlns:ns2=\"http://fitel.com.co/pqr/soap\">" +
            "  <ns2:ArrayOfIntegracionCUN/>" + 
            "</ns2:consultaCUNResponse>";

        // Act & Assert
        mockClient.sendRequest(withPayload(new StringSource(requestXml)))
                .andExpect(noFault())
                // Verify the Array wrapper exists
                .andExpect(xpath("/soap:consultaCUNResponse/soap:ArrayOfIntegracionCUN", 
                                 Collections.singletonMap("soap", "http://fitel.com.co/pqr/soap")).exists())
                // Verify no items inside it
                .andExpect(xpath("/soap:consultaCUNResponse/soap:ArrayOfIntegracionCUN/soap:IntegracionCUN", 
                                 Collections.singletonMap("soap", "http://fitel.com.co/pqr/soap")).doesNotExist());
    }
}
