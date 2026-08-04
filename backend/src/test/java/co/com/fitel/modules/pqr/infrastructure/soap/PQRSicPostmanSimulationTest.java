package co.com.fitel.modules.pqr.infrastructure.soap;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
public class PQRSicPostmanSimulationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void givenValidIp_whenPostmanSimulation_thenReturns200AndValidatesPayload() {
        String xmlPayload = """
                <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://fitel.com.co/pqr/soap">
                   <soapenv:Header/>
                   <soapenv:Body>
                      <soap:consultaCUNRequest>
                         <soap:IO>9999</soap:IO>
                         <soap:AA>2026</soap:AA>
                         <soap:CR>12345</soap:CR>
                         <soap:tipoIdentificacion></soap:tipoIdentificacion>
                         <soap:numeroIdentificacion></soap:numeroIdentificacion>
                      </soap:consultaCUNRequest>
                   </soapenv:Body>
                </soapenv:Envelope>
                """;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "text/xml; charset=utf-8");
        // Using localhost IP (127.0.0.1) which is allowed in application.yml for testing
        headers.set("X-Forwarded-For", "127.0.0.1");

        HttpEntity<String> request = new HttpEntity<>(xmlPayload, headers);

        ResponseEntity<String> response = restTemplate.exchange("/ws", HttpMethod.POST, request, String.class);

        assertEquals(HttpStatus.OK, response.getStatusCode(), "El HTTP Status debe ser 200 OK");
        
        String body = response.getBody();
        assertTrue(body != null, "El body no debe ser nulo");
        assertTrue(body.contains("<ns2:respuesta>"), "El body debe contener la etiqueta <ns2:respuesta>");
        assertTrue(body.contains("<![CDATA["), "Dentro de la respuesta debe existir el texto <![CDATA[");
        assertTrue(body.contains("ArrayOfIntegracionCUN"), "Dentro de la respuesta debe existir <tns:ArrayOfIntegracionCUN> o equivalente");
    }

    @Test
    public void givenInvalidIp_whenPostmanSimulation_thenReturns403Forbidden() {
        String xmlPayload = """
                <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://fitel.com.co/pqr/soap">
                   <soapenv:Header/>
                   <soapenv:Body>
                      <soap:consultaCUNRequest>
                         <soap:IO>9999</soap:IO>
                         <soap:AA>2026</soap:AA>
                         <soap:CR>12345</soap:CR>
                         <soap:tipoIdentificacion></soap:tipoIdentificacion>
                         <soap:numeroIdentificacion></soap:numeroIdentificacion>
                      </soap:consultaCUNRequest>
                   </soapenv:Body>
                </soapenv:Envelope>
                """;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "text/xml; charset=utf-8");
        // IP no autorizada según los requerimientos
        headers.set("X-Forwarded-For", "192.168.99.99");

        HttpEntity<String> request = new HttpEntity<>(xmlPayload, headers);

        ResponseEntity<String> response = restTemplate.exchange("/ws", HttpMethod.POST, request, String.class);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode(), "El HTTP Status debe ser 403 Forbidden para IP no autorizada");
    }
}
