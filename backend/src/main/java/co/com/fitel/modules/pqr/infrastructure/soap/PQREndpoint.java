package co.com.fitel.modules.pqr.infrastructure.soap;

import co.com.fitel.modules.pqr.application.service.PQRSoapService;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.ArrayOfIntegracionCUN;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.ConsultaCUN;
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

    private static final String NAMESPACE_URI = "https://WSConsultaOperador/";
    
    private final PQRSoapService pqrSoapService;
    private final XmlStringConverter xmlStringConverter;
    private final ObjectFactory objectFactory = new ObjectFactory();

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "consultaCUN")
    @ResponsePayload
    public ConsultaCUNResponse consultarTramites(@RequestPayload ConsultaCUN request) {
        log.info("Recibida petición SOAP consultaCUN: anoRadicacionCun={}, ConsecutivoRadCun={}, identificadorOperador={}, TipoId={}, NumId={}", 
                request.getAnoRadicacionCun(), request.getConsecutivoRadCun(), request.getIdentificadorOperador(), request.getTipoIdentificacion(), request.getNumeroIdentificacion());
        
        // Extraer parámetros (ya vienen como int por el nuevo esquema)
        Integer aa = request.getAnoRadicacionCun();
        Integer cr = request.getConsecutivoRadCun();
        
        String tipoId = request.getTipoIdentificacion() != null ? request.getTipoIdentificacion() : "";
        String numeroId = String.valueOf(request.getNumeroIdentificacion());
        
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
