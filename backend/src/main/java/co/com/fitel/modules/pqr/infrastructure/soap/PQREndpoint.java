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

    private static final String NAMESPACE_URI = "http://WSConsultaOperador/";
    
    private final PQRSoapService pqrSoapService;
    private final XmlStringConverter xmlStringConverter;
    private final ObjectFactory objectFactory = new ObjectFactory();

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "consultaCUN")
    @ResponsePayload
    public ConsultaCUNResponse consultarTramites(@RequestPayload ConsultaCUN request) {
        ConsultaCUN.Parameters params = request.getParameters();
        
        Integer aa = params != null ? params.getAnoRadicacionCun() : 0;
        Integer cr = params != null ? params.getConsecutivoRadCun() : 0;
        Integer io = params != null ? params.getIdentificadorOperador() : 0;
        String tipoId = params != null && params.getTipoIdentificacion() != null ? params.getTipoIdentificacion() : "";
        String numeroId = params != null ? String.valueOf(params.getNumeroIdentificacion()) : "0";

        log.info("Recibida petición SOAP consultaCUN: anoRadicacionCun={}, ConsecutivoRadCun={}, identificadorOperador={}, TipoId={}, NumId={}", 
                aa, cr, io, tipoId, numeroId);
        
        // Consultar el servicio
        List<IntegracionCUN> resultados = pqrSoapService.consultarTramites(aa, cr, tipoId, numeroId);
        
        // Construir la respuesta
        ConsultaCUNResponse response = objectFactory.createConsultaCUNResponse();
        ArrayOfIntegracionCUN array = objectFactory.createArrayOfIntegracionCUN();
        
        if (resultados == null || resultados.isEmpty()) {
            String emptyCdata = " \t\t\t\n\t\t\t<tns:ArrayOfIntegracionCUN xmlns:tns=\"http://ws.wso2.org/dataservice\" /> \n\t\t";
            response.setRespuesta("<![CDATA[" + emptyCdata + "]]>");
            return response;
        }
        
        try {
            String rawXml = xmlStringConverter.convertToString(array);
            // Envolver en CDATA
            String cdataResponse = "<![CDATA[" + rawXml + "]]>";
            response.setRespuesta(cdataResponse);
        } catch (Exception e) {
            log.error("Error al convertir la respuesta a XML String", e);
            response.setRespuesta("<![CDATA[ \t\t\t\n\t\t\t<tns:ArrayOfIntegracionCUN xmlns:tns=\"http://ws.wso2.org/dataservice\" /> \n\t\t]]>");
        }
        
        return response;
    }
}
