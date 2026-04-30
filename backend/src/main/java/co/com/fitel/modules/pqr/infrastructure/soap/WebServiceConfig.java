package co.com.fitel.modules.pqr.infrastructure.soap;

import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.ws.config.annotation.EnableWs;
import org.springframework.ws.config.annotation.WsConfigurerAdapter;
import org.springframework.ws.transport.http.MessageDispatcherServlet;
import org.springframework.ws.wsdl.wsdl11.DefaultWsdl11Definition;
import org.springframework.xml.xsd.SimpleXsdSchema;
import org.springframework.xml.xsd.XsdSchema;

/**
 * Configuración del servicio SOAP WSConsultaOperador para integración con la SIC.
 *
 * <p>Expone el WSDL auto-generado en:
 * <code>http://{host}:{port}/ws/consultaCUN.wsdl</code></p>
 *
 * <p>El servlet de WS se monta en <code>/ws/*</code>, separado del
 * DispatcherServlet REST que sirve la API en <code>/api/*</code>.</p>
 */
import org.springframework.ws.server.EndpointInterceptor;
import java.util.List;

@EnableWs
@Configuration
public class WebServiceConfig extends WsConfigurerAdapter {

    private static final String NAMESPACE_URI = "http://fitel.com.co/pqr/soap";
    
    private final CdataResponseInterceptor cdataResponseInterceptor;

    public WebServiceConfig(CdataResponseInterceptor cdataResponseInterceptor) {
        this.cdataResponseInterceptor = cdataResponseInterceptor;
    }

    @Override
    public void addInterceptors(List<EndpointInterceptor> interceptors) {
        interceptors.add(cdataResponseInterceptor);
    }

    /**
     * Registra un {@link MessageDispatcherServlet} dedicado para
     * peticiones SOAP bajo el path <code>/ws/*</code>.
     */
    @Bean
    public ServletRegistrationBean<MessageDispatcherServlet> messageDispatcherServlet(
            ApplicationContext applicationContext) {

        MessageDispatcherServlet servlet = new MessageDispatcherServlet();
        servlet.setApplicationContext(applicationContext);
        servlet.setTransformWsdlLocations(true);
        return new ServletRegistrationBean<>(servlet, "/ws/*");
    }

    /**
     * Genera dinámicamente el WSDL a partir del XSD.
     *
     * <p>Accesible como: <code>/ws/consultaCUN.wsdl</code></p>
     *
     * <p>El nombre del bean (<code>consultaCUN</code>) determina el nombre
     * del fichero WSDL publicado.</p>
     */
    @Bean(name = "consultaCUN")
    public DefaultWsdl11Definition defaultWsdl11Definition(XsdSchema pqrConsultaSchema) {
        DefaultWsdl11Definition definition = new DefaultWsdl11Definition();
        definition.setPortTypeName("WSConsultaOperadorPort");
        definition.setLocationUri("/ws");
        definition.setTargetNamespace(NAMESPACE_URI);
        definition.setSchema(pqrConsultaSchema);
        return definition;
    }

    /**
     * Carga el esquema XSD desde el classpath.
     */
    @Bean
    public XsdSchema pqrConsultaSchema() {
        return new SimpleXsdSchema(new ClassPathResource("xsd/pqr-consulta.xsd"));
    }
}
