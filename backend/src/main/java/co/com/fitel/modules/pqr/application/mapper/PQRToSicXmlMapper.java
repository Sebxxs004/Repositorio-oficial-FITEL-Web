package co.com.fitel.modules.pqr.application.mapper;

import co.com.fitel.modules.pqr.domain.model.PQR;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.IntegracionCUN;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.CodigoUnicoNumerico;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.NomPersona;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.TipoIdNacionalPersona;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.TipoQuejaSic;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.ObjectFactory;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
public class PQRToSicXmlMapper {

    private final ObjectFactory factory = new ObjectFactory();
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
    private static final DateTimeFormatter DATE_ONLY_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public IntegracionCUN toIntegracionCUN(PQR pqr) {
        IntegracionCUN integracionCUN = factory.createIntegracionCUN();
        
        integracionCUN.setNombreOperador("FITEL COLOMBIA");
        
        // Mapeo CodigoUnicoNumerico
        CodigoUnicoNumerico codigoUnicoNumerico = factory.createCodigoUnicoNumerico();
        codigoUnicoNumerico.setIdentificadorOperador(7456);
        String cun = pqr.getCun();
        if (cun != null && !cun.isBlank()) {
            try {
                if (cun.length() >= 16) {
                    // Estructura nueva (16 dígitos): secuencia de 10 dígitos (p. ej. 7456260000000001)
                    codigoUnicoNumerico.setConsecutivoRadCun(Integer.parseInt(cun.substring(cun.length() - 10)));
                    codigoUnicoNumerico.setAnoRadicacionCun(Integer.parseInt(cun.substring(cun.length() - 12, cun.length() - 10)));
                } else if (cun.length() >= 12) {
                    // Estructura antigua estándar (12 dígitos): 4 de operador, 2 de año, 6 de consecutivo
                    codigoUnicoNumerico.setConsecutivoRadCun(Integer.parseInt(cun.substring(cun.length() - 6)));
                    codigoUnicoNumerico.setAnoRadicacionCun(Integer.parseInt(cun.substring(cun.length() - 8, cun.length() - 6)));
                } else if (cun.length() >= 6) {
                    // Estructura corta / simplificada
                    codigoUnicoNumerico.setConsecutivoRadCun(Integer.parseInt(cun.substring(cun.length() - 6)));
                    if (cun.length() >= 8) {
                        codigoUnicoNumerico.setAnoRadicacionCun(Integer.parseInt(cun.substring(cun.length() - 8, cun.length() - 6)));
                    } else {
                        codigoUnicoNumerico.setAnoRadicacionCun(0);
                    }
                } else {
                    fallbackCunValues(codigoUnicoNumerico, pqr);
                }
            } catch (NumberFormatException e) {
                fallbackCunValues(codigoUnicoNumerico, pqr);
            }
        } else {
            fallbackCunValues(codigoUnicoNumerico, pqr);
        }
        integracionCUN.setCodigoUnicoNumerico(codigoUnicoNumerico);
        
        // Mapeo NomPersona y RazonSocial
        NomPersona nomPersona = factory.createNomPersona();
        integracionCUN.setRazonSocial(""); // Por defecto vacío
        
        String tipoDoc = pqr.getCustomerDocumentType() != null ? pqr.getCustomerDocumentType().toUpperCase() : "";
        if ("NIT".equals(tipoDoc)) {
            integracionCUN.setRazonSocial(pqr.getCustomerName() != null ? pqr.getCustomerName() : "");
            nomPersona.setPrimerNombre("");
            nomPersona.setSegundoNombre("");
            nomPersona.setPrimerApellido("");
            nomPersona.setSegundoApellido("");
        } else {
            String[] parts = pqr.getCustomerName() != null ? pqr.getCustomerName().trim().split("\\s+") : new String[0];
            if (parts.length == 1) {
                nomPersona.setPrimerNombre(parts[0]);
                nomPersona.setSegundoNombre("");
                nomPersona.setPrimerApellido("");
                nomPersona.setSegundoApellido("");
            } else if (parts.length == 2) {
                nomPersona.setPrimerNombre(parts[0]);
                nomPersona.setSegundoNombre("");
                nomPersona.setPrimerApellido(parts[1]);
                nomPersona.setSegundoApellido("");
            } else if (parts.length == 3) {
                nomPersona.setPrimerNombre(parts[0]);
                nomPersona.setSegundoNombre(parts[1]);
                nomPersona.setPrimerApellido(parts[2]);
                nomPersona.setSegundoApellido("");
            } else if (parts.length >= 4) {
                nomPersona.setPrimerNombre(parts[0]);
                nomPersona.setSegundoNombre(parts[1]);
                nomPersona.setPrimerApellido(parts[2]);
                nomPersona.setSegundoApellido(parts[3]);
            } else {
                nomPersona.setPrimerNombre("");
                nomPersona.setSegundoNombre("");
                nomPersona.setPrimerApellido("");
                nomPersona.setSegundoApellido("");
            }
        }
        integracionCUN.setNomPersona(nomPersona);
        
        // Mapeo TipoIdNacionalPersona
        TipoIdNacionalPersona tipoIdNacionalPersona = factory.createTipoIdNacionalPersona();
        if ("NIT".equals(tipoDoc)) {
            tipoIdNacionalPersona.setCodTipoIdNacionalPersona("NI");
            tipoIdNacionalPersona.setNomTipoIdentificacionNacionalPersona("NUMERO DE IDENTIFICACION TRIBUTARIA");
        } else {
            tipoIdNacionalPersona.setCodTipoIdNacionalPersona(tipoDoc);
            if ("CC".equals(tipoDoc)) {
                tipoIdNacionalPersona.setNomTipoIdentificacionNacionalPersona("CEDULA DE CIUDADANIA");
            } else if ("CE".equals(tipoDoc)) {
                tipoIdNacionalPersona.setNomTipoIdentificacionNacionalPersona("CEDULA DE EXTRANJERIA");
            } else {
                tipoIdNacionalPersona.setNomTipoIdentificacionNacionalPersona("OTRO");
            }
        }
        integracionCUN.setTipoIdNacionalPersona(tipoIdNacionalPersona);
        
        integracionCUN.setGrupoNumeroIdentificacion(pqr.getCustomerDocumentNumber() != null ? pqr.getCustomerDocumentNumber() : "");
        integracionCUN.setDescripcionEstado(mapStatusToSic(pqr.getStatus()));
        
        if (pqr.getCreatedAt() != null) {
            integracionCUN.setFechaAsignacion(pqr.getCreatedAt().format(DATE_FORMATTER));
        } else {
            integracionCUN.setFechaAsignacion("");
        }
        
        if (pqr.getResponseDate() != null) {
            integracionCUN.setFechaEstRespuesta(pqr.getResponseDate().format(DATE_ONLY_FORMATTER));
        } else if (pqr.getSlaDeadline() != null) {
            integracionCUN.setFechaEstRespuesta(pqr.getSlaDeadline().format(DATE_ONLY_FORMATTER));
        } else if (pqr.getCreatedAt() != null) {
            integracionCUN.setFechaEstRespuesta(pqr.getCreatedAt().plusDays(15).format(DATE_ONLY_FORMATTER));
        } else {
            integracionCUN.setFechaEstRespuesta("");
        }
        
        // Mapeo TipoQuejaSic
        TipoQuejaSic tipoQuejaSic = factory.createTipoQuejaSic();
        tipoQuejaSic.setNomTipoQuejaSic(pqr.getType() != null ? pqr.getType() : "");
        if ("PETICION".equalsIgnoreCase(pqr.getType())) tipoQuejaSic.setCodTipoQuejaSic("1");
        else if ("QUEJA".equalsIgnoreCase(pqr.getType())) tipoQuejaSic.setCodTipoQuejaSic("2");
        else if ("RECURSO".equalsIgnoreCase(pqr.getType())) tipoQuejaSic.setCodTipoQuejaSic("3");
        else tipoQuejaSic.setCodTipoQuejaSic("0");
        integracionCUN.setTipoQuejaSic(tipoQuejaSic);
        
        return integracionCUN;
    }

    public String mapStatusToSic(String internalStatus) {
        if (internalStatus == null) {
            return "ANALISIS POR PARTE DEL OPERADOR";
        }
        return switch (internalStatus.toUpperCase()) {
            case "RESUELTA" -> "RESUELTA";
            case "CERRADA" -> "CERRADA";
            default -> "ANALISIS POR PARTE DEL OPERADOR";
        };
    }

    private void fallbackCunValues(CodigoUnicoNumerico codigoUnicoNumerico, PQR pqr) {
        int year = 26; // por defecto 2026
        if (pqr.getCreatedAt() != null) {
            year = pqr.getCreatedAt().getYear() % 100;
        }
        codigoUnicoNumerico.setAnoRadicacionCun(year);
        
        int consecutivo = 0;
        if (pqr.getId() != null) {
            consecutivo = pqr.getId().intValue();
        }
        codigoUnicoNumerico.setConsecutivoRadCun(consecutivo);
    }
}
