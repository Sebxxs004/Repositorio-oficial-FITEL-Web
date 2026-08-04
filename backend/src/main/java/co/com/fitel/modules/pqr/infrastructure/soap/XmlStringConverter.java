package co.com.fitel.modules.pqr.infrastructure.soap;

import co.com.fitel.modules.pqr.infrastructure.soap.gen.ArrayOfIntegracionCUN;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.ObjectFactory;
import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.JAXBElement;
import jakarta.xml.bind.JAXBException;
import jakarta.xml.bind.Marshaller;
import org.springframework.stereotype.Component;

import java.io.StringWriter;

@Component
public class XmlStringConverter {

    private final JAXBContext jaxbContext;
    private final ObjectFactory objectFactory;

    public XmlStringConverter() throws JAXBException {
        // Inicializar el contexto JAXB
        this.jaxbContext = JAXBContext.newInstance(ArrayOfIntegracionCUN.class.getPackage().getName());
        this.objectFactory = new ObjectFactory();
    }

    public String convertToString(ArrayOfIntegracionCUN arrayObject) throws JAXBException {
        if (arrayObject == null) {
            return "";
        }
        Marshaller marshaller = jaxbContext.createMarshaller();
        // Evitar la declaración XML <?xml version="1.0" ... ?> para que sea solo el nodo
        marshaller.setProperty(Marshaller.JAXB_FRAGMENT, Boolean.TRUE);
        
        // Envolver el objeto en un JAXBElement para suplir la falta de @XmlRootElement
        JAXBElement<ArrayOfIntegracionCUN> jaxbElement = objectFactory.createArrayOfIntegracionCUN(arrayObject);
        
        StringWriter writer = new StringWriter();
        marshaller.marshal(jaxbElement, writer);
        
        String xml = writer.toString();
        // 1. Reemplazar cualquier prefijo de namespace existente (ej. ns2:) por tns:, o añadirlo si no hay
        xml = xml.replaceAll("<(/??)(?:[^\\s>/:#]+:)?([^\\s>/]+)(/??)([^>]*)>", "<$1tns:$2$3$4>");
        // 2. Reemplazar el namespace con prefijo por el requerido por la SIC (http://ws.wso2.org/dataservice)
        xml = xml.replaceAll("xmlns:[^=]+=\"[^\"]+\"", "xmlns:tns=\"http://ws.wso2.org/dataservice\"");
        
        // 3. Formatear ConsecutivoRadCun a 10 dígitos con ceros a la izquierda para cumplir la especificación de la SIC
        java.util.regex.Pattern p = java.util.regex.Pattern.compile("<tns:ConsecutivoRadCun>(\\d+)</tns:ConsecutivoRadCun>");
        java.util.regex.Matcher m = p.matcher(xml);
        if (m.find()) {
            String val = m.group(1);
            String padded = String.format("%010d", Long.parseLong(val));
            xml = m.replaceFirst("<tns:ConsecutivoRadCun>" + padded + "</tns:ConsecutivoRadCun>");
        }
        
        return xml;
    }
}
