package co.com.fitel.modules.plans.application.service;

import co.com.fitel.modules.plans.application.dto.CreatePlanRequest;
import co.com.fitel.modules.plans.application.dto.PlanDTO;
import co.com.fitel.modules.plans.application.dto.UpdatePlanRequest;
import co.com.fitel.modules.plans.domain.model.Plan;
import co.com.fitel.modules.plans.domain.repository.PlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de gestión de planes para administradores
 * 
 * Implementa el principio de Responsabilidad Única (SRP) - solo lógica de negocio de gestión de planes
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PlanManagementService {

    private final PlanRepository planRepository;
    private final PlanMapper planMapper;

    /**
     * Obtiene todos los planes (activos e inactivos)
     */
    @Transactional(readOnly = true)
    public List<PlanDTO> getAllPlans() {
        log.debug("Fetching all plans (including inactive)");
        return planRepository.findAll()
                .stream()
                .map(planMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un plan por ID
     */
    @Transactional(readOnly = true)
    public PlanDTO getPlanById(Long id) {
        log.debug("Fetching plan with id: {}", id);
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + id));
        return planMapper.toDTO(plan);
    }

    /**
     * Crea un nuevo plan
     */
    public PlanDTO createPlan(CreatePlanRequest request) {
        log.info("Creating new plan: {}", request.getName());
        
        // Verificar si ya existe un plan con el mismo nombre
        if (planRepository.findByName(request.getName()).isPresent()) {
            throw new RuntimeException("Ya existe un plan con el nombre: " + request.getName());
        }

        // Si se marca como popular, desmarcar los otros planes populares
        Boolean isPopular = request.getPopular() != null ? request.getPopular() : false;
        if (isPopular) {
            List<Plan> popularPlans = planRepository.findByPopularTrue();
            for (Plan popularPlan : popularPlans) {
                popularPlan.setPopular(false);
                planRepository.save(popularPlan);
            }
            log.info("Unmarked {} other popular plan(s) to set new plan as popular", popularPlans.size());
        }

        Plan plan = Plan.builder()
                .name(request.getName())
                .description(request.getDescription())
                .internetSpeedMbps(request.getInternetSpeedMbps())
                .tvChannels(request.getTvChannels())
                .monthlyPrice(request.getMonthlyPrice())
                .active(request.getActive() != null ? request.getActive() : true)
                .popular(isPopular)
                .planType(request.getPlanType())
                .backgroundImage(request.getBackgroundImage())
                .build();

        Plan savedPlan = planRepository.save(plan);
        log.info("Plan created successfully with id: {}", savedPlan.getId());
        return planMapper.toDTO(savedPlan);
    }

    /**
     * Actualiza un plan existente
     */
    public PlanDTO updatePlan(Long id, UpdatePlanRequest request) {
        log.info("Updating plan with id: {}", id);
        
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + id));

        // Verificar si el nuevo nombre ya existe en otro plan
        if (!plan.getName().equals(request.getName())) {
            planRepository.findByName(request.getName())
                    .ifPresent(existingPlan -> {
                        if (!existingPlan.getId().equals(id)) {
                            throw new RuntimeException("Ya existe un plan con el nombre: " + request.getName());
                        }
                    });
        }

        plan.setName(request.getName());
        plan.setDescription(request.getDescription());
        plan.setInternetSpeedMbps(request.getInternetSpeedMbps());
        plan.setTvChannels(request.getTvChannels());
        plan.setMonthlyPrice(request.getMonthlyPrice());
        
        if (request.getActive() != null) {
            plan.setActive(request.getActive());
        }
        
        if (request.getPopular() != null) {
            Boolean newPopularValue = request.getPopular();
            // Si se marca como popular, desmarcar los otros planes populares (excepto el actual)
            if (newPopularValue && !plan.getPopular()) {
                List<Plan> popularPlans = planRepository.findByPopularTrue();
                for (Plan popularPlan : popularPlans) {
                    if (!popularPlan.getId().equals(id)) {
                        popularPlan.setPopular(false);
                        planRepository.save(popularPlan);
                    }
                }
                log.info("Unmarked other popular plan(s) to set plan {} as popular", id);
            }
            plan.setPopular(newPopularValue);
        }
        
        if (request.getPlanType() != null) {
            plan.setPlanType(request.getPlanType());
        }
        
        if (request.getBackgroundImage() != null) {
            plan.setBackgroundImage(request.getBackgroundImage());
        }

        Plan updatedPlan = planRepository.save(plan);
        log.info("Plan updated successfully with id: {}", updatedPlan.getId());
        return planMapper.toDTO(updatedPlan);
    }

    /**
     * Elimina un plan
     */
    public void deletePlan(Long id) {
        log.info("Deleting plan with id: {}", id);
        
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + id));

        planRepository.delete(plan);
        log.info("Plan deleted successfully with id: {}", id);
    }

    /**
     * Activa o desactiva un plan
     */
    public PlanDTO togglePlanActive(Long id) {
        log.info("Toggling active status for plan with id: {}", id);
        
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found with id: " + id));

        plan.setActive(!plan.getActive());
        Plan updatedPlan = planRepository.save(plan);
        log.info("Plan active status toggled to: {} for plan id: {}", updatedPlan.getActive(), id);
        return planMapper.toDTO(updatedPlan);
    }
}
