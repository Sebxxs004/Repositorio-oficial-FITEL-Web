package co.com.fitel.modules.pqr.infrastructure.soap;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Prueba de integración que valida que el contexto de Spring arranca
 * correctamente y que el WSDL del servicio WSConsultaOperador se genera
 * y se expone en {@code /ws/consultaCUN.wsdl}.
 */
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class WebServiceConfigTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    @DisplayName("El WSDL de consultaCUN debe estar accesible y contener la definición del servicio")
    void wsdlIsAccessibleAndContainsServiceDefinition() {
        ResponseEntity<String> response =
                restTemplate.getForEntity("/ws/consultaCUN.wsdl", String.class);

        assertEquals(HttpStatus.OK, response.getStatusCode(),
                "El WSDL debe responder HTTP 200");

        String body = response.getBody();
        assertNotNull(body, "El cuerpo de la respuesta no debe ser nulo");

        // Verificar que es un documento WSDL válido
        assertTrue(body.contains("wsdl:definitions") || body.contains("definitions"),
                "Debe contener la raíz <wsdl:definitions>");

        // Verificar que el namespace del servicio está presente
        assertTrue(body.contains("http://fitel.com.co/pqr/soap"),
                "Debe contener el targetNamespace del servicio");

        // Verificar que los elementos del request/response están definidos
        assertTrue(body.contains("consultaCUNRequest"),
                "Debe contener el elemento consultaCUNRequest");
        assertTrue(body.contains("consultaCUNResponse"),
                "Debe contener el elemento consultaCUNResponse");

        // Verificar el port type del servicio
        assertTrue(body.contains("WSConsultaOperadorPort"),
                "Debe contener el portType WSConsultaOperadorPort");
    }
}
