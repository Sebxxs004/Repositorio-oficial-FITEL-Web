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
        return writer.toString();
    }
}
