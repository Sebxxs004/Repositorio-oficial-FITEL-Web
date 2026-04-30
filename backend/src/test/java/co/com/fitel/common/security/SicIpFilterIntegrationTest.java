package co.com.fitel.common.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "fitel.sic.allowed-ips=192.168.100.10, 10.0.0.5",
    "spring.datasource.url=jdbc:h2:mem:testdb;MODE=MariaDB;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
    "spring.datasource.driverClassName=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect"
})
class SicIpFilterIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Debe devolver 403 Forbidden cuando una IP no autorizada accede a /ws/consultaCUN.wsdl")
    void shouldReturn403WhenUnauthorizedIp() throws Exception {
        mockMvc.perform(post("/ws/consultaCUN.wsdl")
                .with(request -> {
                    request.setRemoteAddr("1.2.3.4");
                    return request;
                }))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Debe devolver 200 OK (o 400 Bad Request si el payload SOAP falta, pero NO 403) cuando una IP autorizada accede a /ws/consultaCUN.wsdl")
    void shouldNotReturn403WhenAuthorizedIp() throws Exception {
        // En un @SpringBootTest real con endpoints SOAP, sin payload devolverá un 400 o un 200 con SOAP Fault,
        // pero lo importante es que el filtro deje pasar y NO sea 403.
        mockMvc.perform(post("/ws/consultaCUN.wsdl")
                .with(request -> {
                    request.setRemoteAddr("192.168.100.10");
                    return request;
                }))
                // Is not forbidden means the filter passed. It will likely be 200 OK or 400 Bad Request.
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    if (status == 403) {
                        throw new AssertionError("Se esperaba que pasara el filtro, pero devolvió 403 Forbidden");
                    }
                });
    }

    @Test
    @DisplayName("Debe permitir acceso a rutas que no son de la SIC sin importar la IP")
    void shouldAllowAccessToOtherRoutes() throws Exception {
        mockMvc.perform(post("/api/auth/admin/login")
                .with(request -> {
                    request.setRemoteAddr("9.9.9.9");
                    return request;
                }))
                // Como no enviamos credenciales y la ruta es pública, dará 400 (Bad Request) o 200, pero NO 403 por IP.
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    if (status == 403) {
                        throw new AssertionError("Bloqueó por IP una ruta pública que no es /ws/**");
                    }
                });
    }
}
