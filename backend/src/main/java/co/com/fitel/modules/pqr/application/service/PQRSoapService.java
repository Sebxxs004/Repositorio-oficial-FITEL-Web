package co.com.fitel.modules.pqr.application.service;

import co.com.fitel.modules.pqr.application.mapper.PQRToSicXmlMapper;
import co.com.fitel.modules.pqr.domain.model.PQR;
import co.com.fitel.modules.pqr.domain.repository.PQRRepository;
import co.com.fitel.modules.pqr.infrastructure.soap.gen.IntegracionCUN;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PQRSoapService {

    private final PQRRepository pqrRepository;
    private final PQRToSicXmlMapper mapper;

    @Transactional(readOnly = true)
    public List<IntegracionCUN> consultarTramites(Integer aa, Integer cr, String tipoId, String numeroId) {
        log.info("Consultando trámites SOAP: AA={}, CR={}, tipoId={}, numeroId={}", aa, cr, tipoId, numeroId);

        if (aa != null && aa > 0 && cr != null && cr > 0) {
            log.debug("Buscando PQR por partes del CUN");
            Optional<PQR> pqrOpt = pqrRepository.findByCunParts(aa, cr);
            return pqrOpt.map(pqr -> List.of(mapper.toIntegracionCUN(pqr)))
                         .orElse(Collections.emptyList());
        }

        log.debug("Buscando PQR por identificación del cliente");
        List<PQR> pqrs = pqrRepository.findByIdentificacion(tipoId, numeroId);
        return pqrs.stream()
                   .map(mapper::toIntegracionCUN)
                   .collect(Collectors.toList());
    }
}
