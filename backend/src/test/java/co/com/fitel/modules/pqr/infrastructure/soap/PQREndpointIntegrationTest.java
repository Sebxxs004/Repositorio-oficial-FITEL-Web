package co.com.fitel.modules.pqr.infrastructure.soap;

import co.com.fitel.modules.pqr.application.service.PQRSoapService;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.CodigoUnicoNumerico;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.IntegracionCUN;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.NomPersona;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.ObjectFactory;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.TipoIdNacionalPersona;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.TipoQuejaSic;
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
    }

    private IntegracionCUN buildMockIntegracion(String operadorId, String ano, String consecutivo,
                                                 String nombre, String tipoDoc, String numDoc,
                                                 String estado, String tipoQuejaNom, String tipoQuejaCode) {
        ObjectFactory factory = new ObjectFactory();
        IntegracionCUN integracion = factory.createIntegracionCUN();
        integracion.setNombreOperador("FITEL COLOMBIA");

        CodigoUnicoNumerico cod = factory.createCodigoUnicoNumerico();
        cod.setIdentificadorOperador(operadorId);
        cod.setAnoRadicacionCun(ano);
        cod.setConsecutivoRadCun(consecutivo);
        integracion.setCodigoUnicoNumerico(cod);

        NomPersona nomPersona = factory.createNomPersona();
        nomPersona.setPrimerNombre(nombre);
        nomPersona.setSegundoNombre("");
        nomPersona.setPrimerApellido("");
        nomPersona.setSegundoApellido("");
        integracion.setNomPersona(nomPersona);

        TipoIdNacionalPersona tipoId = factory.createTipoIdNacionalPersona();
        tipoId.setCodTipoIdNacionalPersona(tipoDoc);
        tipoId.setNomTipoIdentificacionNacionalPersona("CEDULA DE CIUDADANIA");
        integracion.setTipoIdNacionalPersona(tipoId);

        integracion.setGrupoNumeroIdentificacion(numDoc);
        integracion.setDescripcionEstado(estado);
        integracion.setFechaAsignacion("2024-01-01T00:00:00");
        integracion.setRazonSocial("");

        TipoQuejaSic tipoQuejaSic = factory.createTipoQuejaSic();
        tipoQuejaSic.setNomTipoQuejaSic(tipoQuejaNom);
        tipoQuejaSic.setCodTipoQuejaSic(tipoQuejaCode);
        integracion.setTipoQuejaSic(tipoQuejaSic);

        return integracion;
    }

    @Test
    @DisplayName("A) Debe procesar petición por CUN válido y retornar respuesta sin fault")
    void testPeticionPorCunValido() throws Exception {
        String requestXml =
            "<soap:consultaCUNRequest xmlns:soap=\"http://fitel.com.co/pqr/soap\">" +
            "  <soap:IO>12345</soap:IO>" +
            "  <soap:AA>24</soap:AA>" +
            "  <soap:CR>1</soap:CR>" +
            "  <soap:tipoIdentificacion></soap:tipoIdentificacion>" +
            "  <soap:numeroIdentificacion></soap:numeroIdentificacion>" +
            "</soap:consultaCUNRequest>";

        IntegracionCUN mockIntegracion = buildMockIntegracion(
                "7456", "24", "000001", "Juan", "CC", "101010",
                "ANALISIS POR PARTE DEL OPERADOR", "QUEJA", "2");

        when(pqrSoapService.consultarTramites(24, 1, "", "")).thenReturn(List.of(mockIntegracion));

        mockClient.sendRequest(withPayload(new StringSource(requestXml)))
                .andExpect(noFault())
                .andExpect(xpath("/soap:consultaCUNResponse/soap:respuesta",
                                 Collections.singletonMap("soap", "http://fitel.com.co/pqr/soap")).exists());
    }

    @Test
    @DisplayName("B) Debe procesar petición por Cédula y retornar respuesta sin fault con múltiples items")
    void testPeticionPorCedula() throws Exception {
        String requestXml =
            "<soap:consultaCUNRequest xmlns:soap=\"http://fitel.com.co/pqr/soap\">" +
            "  <soap:IO></soap:IO>" +
            "  <soap:AA>0</soap:AA>" +
            "  <soap:CR>0</soap:CR>" +
            "  <soap:tipoIdentificacion>CC</soap:tipoIdentificacion>" +
            "  <soap:numeroIdentificacion>101010</soap:numeroIdentificacion>" +
            "</soap:consultaCUNRequest>";

        IntegracionCUN mockIntegracion1 = buildMockIntegracion(
                "7456", "24", "000001", "Juan", "CC", "101010",
                "ANALISIS POR PARTE DEL OPERADOR", "QUEJA", "2");

        IntegracionCUN mockIntegracion2 = buildMockIntegracion(
                "7456", "24", "000002", "Juan", "CC", "101010",
                "RESUELTA", "PETICION", "1");

        when(pqrSoapService.consultarTramites(0, 0, "CC", "101010"))
                .thenReturn(List.of(mockIntegracion1, mockIntegracion2));

        mockClient.sendRequest(withPayload(new StringSource(requestXml)))
                .andExpect(noFault())
                .andExpect(xpath("/soap:consultaCUNResponse/soap:respuesta",
                                 Collections.singletonMap("soap", "http://fitel.com.co/pqr/soap")).exists());
    }

    @Test
    @DisplayName("C) Debe retornar ArrayOfIntegracionCUN vacío si no hay datos, sin dar error 500")
    void testPeticionSinDatos() throws Exception {
        String requestXml =
            "<soap:consultaCUNRequest xmlns:soap=\"http://fitel.com.co/pqr/soap\">" +
            "  <soap:IO></soap:IO>" +
            "  <soap:AA>99</soap:AA>" +
            "  <soap:CR>999</soap:CR>" +
            "  <soap:tipoIdentificacion></soap:tipoIdentificacion>" +
            "  <soap:numeroIdentificacion></soap:numeroIdentificacion>" +
            "</soap:consultaCUNRequest>";

        when(pqrSoapService.consultarTramites(99, 999, "", "")).thenReturn(Collections.emptyList());

        mockClient.sendRequest(withPayload(new StringSource(requestXml)))
                .andExpect(noFault())
                .andExpect(xpath("/soap:consultaCUNResponse/soap:respuesta",
                                 Collections.singletonMap("soap", "http://fitel.com.co/pqr/soap")).exists());
    }
}
