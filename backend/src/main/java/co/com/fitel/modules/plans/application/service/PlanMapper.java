package co.com.fitel.modules.plans.application.service;

import co.com.fitel.modules.plans.application.dto.PlanDTO;
import co.com.fitel.modules.plans.domain.model.Plan;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre Plan y PlanDTO
 * 
 * Implementa el principio de Responsabilidad Única (SRP) - solo mapeo
 */
@Component
public class PlanMapper {

    public PlanDTO toDTO(Plan plan) {
        if (plan == null) {
            return null;
        }

        PlanDTO dto = new PlanDTO();
        dto.setId(plan.getId());
        dto.setName(plan.getName());
        dto.setDescription(plan.getDescription());
        dto.setInternetSpeedMbps(plan.getInternetSpeedMbps());
        dto.setTvChannels(plan.getTvChannels());
        dto.setMonthlyPrice(plan.getMonthlyPrice());
        dto.setActive(plan.getActive());
        dto.setPopular(plan.getPopular());
        dto.setPlanType(plan.getPlanType());
        dto.setBackgroundImage(plan.getBackgroundImage());
        dto.setCreatedAt(plan.getCreatedAt());
        dto.setUpdatedAt(plan.getUpdatedAt());

        return dto;
    }

    public Plan toEntity(PlanDTO dto) {
        if (dto == null) {
            return null;
        }

        Plan plan = new Plan();
        plan.setId(dto.getId());
        plan.setName(dto.getName());
        plan.setDescription(dto.getDescription());
        plan.setInternetSpeedMbps(dto.getInternetSpeedMbps());
        plan.setTvChannels(dto.getTvChannels());
        plan.setMonthlyPrice(dto.getMonthlyPrice());
        plan.setActive(dto.getActive());
        plan.setPopular(dto.getPopular());
        plan.setPlanType(dto.getPlanType());
        plan.setBackgroundImage(dto.getBackgroundImage());

        return plan;
    }
}
