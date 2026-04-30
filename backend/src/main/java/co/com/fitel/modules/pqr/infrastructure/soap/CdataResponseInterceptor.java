package co.com.fitel.modules.pqr.infrastructure.soap;

import jakarta.xml.soap.SOAPBody;
import jakarta.xml.soap.SOAPMessage;
import org.springframework.stereotype.Component;
import org.springframework.ws.context.MessageContext;
import org.springframework.ws.server.EndpointInterceptor;
import org.springframework.ws.soap.saaj.SaajSoapMessage;
import org.w3c.dom.CDATASection;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

@Component
public class CdataResponseInterceptor implements EndpointInterceptor {

    @Override
    public boolean handleRequest(MessageContext messageContext, Object endpoint) throws Exception {
        return true; // Continuar
    }

    @Override
    public boolean handleResponse(MessageContext messageContext, Object endpoint) throws Exception {
        if (messageContext.hasResponse() && messageContext.getResponse() instanceof SaajSoapMessage) {
            SaajSoapMessage saajMessage = (SaajSoapMessage) messageContext.getResponse();
            SOAPMessage soapMessage = saajMessage.getSaajMessage();
            SOAPBody body = soapMessage.getSOAPBody();

            // Buscar la etiqueta <respuesta>
            NodeList respuestaNodes = body.getElementsByTagNameNS("*", "respuesta");
            if (respuestaNodes.getLength() > 0) {
                Node respuestaNode = respuestaNodes.item(0);
                String textContent = respuestaNode.getTextContent();
                
                // Limpiar si el PQREndpoint ya le había concatenado el CDATA manualmente
                String rawXml = textContent;
                if (textContent != null && textContent.startsWith("<![CDATA[") && textContent.endsWith("]]>")) {
                    rawXml = textContent.substring(9, textContent.length() - 3);
                }

                // Limpiar el nodo actual para quitar el texto escapado (TextNode)
                while (respuestaNode.hasChildNodes()) {
                    respuestaNode.removeChild(respuestaNode.getFirstChild());
                }

                // Crear un verdadero CDATASection en el DOM de SAAJ para que no sea escapado
                Document doc = soapMessage.getSOAPPart().getEnvelope().getOwnerDocument();
                CDATASection cdataSection = doc.createCDATASection(rawXml != null ? rawXml : "");
                respuestaNode.appendChild(cdataSection);
            }
        }
        return true;
    }

    @Override
    public boolean handleFault(MessageContext messageContext, Object endpoint) throws Exception {
        return true;
    }

    @Override
    public void afterCompletion(MessageContext messageContext, Object endpoint, Exception ex) throws Exception {
        // No-op
    }
}
