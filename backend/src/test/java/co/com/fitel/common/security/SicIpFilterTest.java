package co.com.fitel.common.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.context.annotation.Import;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
@AutoConfigureMockMvc
@Import(SicIpFilterTest.DummyWsController.class)
public class SicIpFilterTest {

    @org.springframework.boot.test.context.TestConfiguration
    @RestController
    static class DummyWsController {
        @PostMapping("/ws")
        public String dummyWsEndpoint() {
            return "<response>OK</response>";
        }
    }

    @Autowired
    private MockMvc mockMvc;

    private static final String SOAP_REQUEST = 
        "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:soap=\"http://fitel.com.co/pqr/soap\">" +
        "   <soapenv:Header/>" +
        "   <soapenv:Body>" +
        "      <soap:consultaCUNRequest>" +
        "         <soap:AA>2023</soap:AA>" +
        "         <soap:CR>1</soap:CR>" +
        "         <soap:IO>12345</soap:IO>" +
        "         <soap:TipoIdentificacion>CC</soap:TipoIdentificacion>" +
        "         <soap:NumeroIdentificacion>101010</soap:NumeroIdentificacion>" +
        "      </soap:consultaCUNRequest>" +
        "   </soapenv:Body>" +
        "</soapenv:Envelope>";

    @Test
    public void givenInvalidIp_whenRequestToWs_thenForbidden() throws Exception {
        mockMvc.perform(post("/ws")
                        .header("X-Forwarded-For", "192.168.1.100")
                        .contentType(MediaType.TEXT_XML)
                        .content(SOAP_REQUEST))
                .andExpect(status().isForbidden());
    }

    @Test
    public void givenValidIp_whenRequestToWs_thenOk() throws Exception {
        mockMvc.perform(post("/ws")
                        .header("X-Forwarded-For", "192.168.1.10")
                        .contentType(MediaType.TEXT_XML)
                        .content(SOAP_REQUEST))
                .andExpect(status().isOk());
    }
}
