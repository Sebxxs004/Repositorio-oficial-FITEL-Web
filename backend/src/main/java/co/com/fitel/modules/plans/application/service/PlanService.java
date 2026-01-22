package co.com.fitel.modules.plans.application.service;

import co.com.fitel.modules.plans.application.dto.PlanDTO;
import co.com.fitel.modules.plans.domain.model.Plan;
import co.com.fitel.modules.plans.domain.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de Planes
 * 
 * Implementa el principio de Responsabilidad Única (SRP) - solo lógica de negocio de planes
 * Implementa el principio de Inversión de Dependencias (DIP) - depende de abstracciones
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PlanService {

    private final PlanRepository planRepository;
    private final PlanMapper planMapper;

    @Transactional(readOnly = true)
    public List<PlanDTO> getAllActivePlans() {
        log.debug("Fetching all active plans");
        return planRepository.findByActiveTrue()
                .stream()
                .map(planMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PlanDTO getPlanById(Long id) {
        log.debug("Fetching plan with id: {}", id);
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + id));
        return planMapper.toDTO(plan);
    }

    @Transactional(readOnly = true)
    public List<PlanDTO> getPopularPlans() {
        log.debug("Fetching popular plans");
        return planRepository.findByPopularTrueAndActiveTrue()
                .stream()
                .map(planMapper::toDTO)
                .collect(Collectors.toList());
    }
}
