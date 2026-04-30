package co.com.fitel.modules.pqr.infrastructure.soap;

import co.com.fitel.modules.pqr.application.service.PQRSoapService;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.ArrayOfIntegracionCUN;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.ConsultaCUNRequest;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.ConsultaCUNResponse;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.IntegracionCUN;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.ObjectFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.util.List;

@Slf4j
@Endpoint
@RequiredArgsConstructor
public class PQREndpoint {

    private static final String NAMESPACE_URI = "http://fitel.com.co/pqr/soap";
    
    private final PQRSoapService pqrSoapService;
    private final XmlStringConverter xmlStringConverter;
    private final ObjectFactory objectFactory = new ObjectFactory();

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "consultaCUNRequest")
    @ResponsePayload
    public ConsultaCUNResponse consultarTramites(@RequestPayload ConsultaCUNRequest request) {
        log.info("Recibida petición SOAP consultaCUNRequest: AA={}, CR={}, IO={}, TipoId={}, NumId={}", 
                request.getAA(), request.getCR(), request.getIO(), request.getTipoIdentificacion(), request.getNumeroIdentificacion());
        
        // Extraer parámetros (si vienen nulos, los tratamos como 0 o vacío)
        Integer aa = 0;
        if (request.getAA() != null && !request.getAA().isBlank()) {
            try {
                aa = Integer.parseInt(request.getAA());
            } catch (NumberFormatException e) {
                log.warn("El parámetro AA no es un número válido: {}", request.getAA());
            }
        }
        
        Integer cr = 0;
        if (request.getCR() != null && !request.getCR().isBlank()) {
            try {
                cr = Integer.parseInt(request.getCR());
            } catch (NumberFormatException e) {
                log.warn("El parámetro CR no es un número válido: {}", request.getCR());
            }
        }
        
        String tipoId = request.getTipoIdentificacion() != null ? request.getTipoIdentificacion() : "";
        String numeroId = request.getNumeroIdentificacion() != null ? request.getNumeroIdentificacion() : "";
        
        // Consultar el servicio
        List<IntegracionCUN> resultados = pqrSoapService.consultarTramites(aa, cr, tipoId, numeroId);
        
        // Construir la respuesta
        ConsultaCUNResponse response = objectFactory.createConsultaCUNResponse();
        ArrayOfIntegracionCUN array = objectFactory.createArrayOfIntegracionCUN();
        
        if (resultados != null && !resultados.isEmpty()) {
            array.getIntegracionCUN().addAll(resultados);
        }
        
        try {
            String rawXml = xmlStringConverter.convertToString(array);
            // Envolver en CDATA
            String cdataResponse = "<![CDATA[" + rawXml + "]]>";
            response.setRespuesta(cdataResponse);
        } catch (Exception e) {
            log.error("Error al convertir la respuesta a XML String", e);
            response.setRespuesta("<![CDATA[]]>");
        }
        
        return response;
    }
}
