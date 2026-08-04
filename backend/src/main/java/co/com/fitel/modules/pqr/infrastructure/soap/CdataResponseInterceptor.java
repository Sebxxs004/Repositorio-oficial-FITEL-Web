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

                // Obtener el nodo padre (consultaCUNResponse)
                Node parentNode = respuestaNode.getParentNode();
                
                // Remover el nodo de respuesta antiguo del padre
                parentNode.removeChild(respuestaNode);

                // Crear los nuevos elementos con la estructura y namespaces exactos requeridos
                Document doc = soapMessage.getSOAPPart().getEnvelope().getOwnerDocument();
                
                // 1. Crear el elemento <parameters> con sus atributos xsi:type
                org.w3c.dom.Element parametersElem = doc.createElement("parameters");
                parametersElem.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
                parametersElem.setAttribute("xmlns:xsd", "http://www.w3.org/2001/XMLSchema");
                parametersElem.setAttribute("xmlns:tns", "http://WSConsultaOperador/");
                parametersElem.setAttribute("xsi:type", "tns:consultaCUNResponse");

                // 2. Crear el elemento <respuesta> con xsi:type="xsd:string"
                org.w3c.dom.Element respuestaElem = doc.createElement("respuesta");
                respuestaElem.setAttribute("xsi:type", "xsd:string");

                // 3. Crear el CDATA con el XML interno
                CDATASection cdataSection = doc.createCDATASection(rawXml != null ? rawXml : "");
                respuestaElem.appendChild(cdataSection);

                // 4. Armar el árbol DOM
                parametersElem.appendChild(respuestaElem);
                parentNode.appendChild(parametersElem);
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
