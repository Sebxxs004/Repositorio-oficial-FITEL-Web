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

        return PlanDTO.builder()
                .id(plan.getId())
                .name(plan.getName())
                .description(plan.getDescription())
                .internetSpeedMbps(plan.getInternetSpeedMbps())
                .tvChannels(plan.getTvChannels())
                .monthlyPrice(plan.getMonthlyPrice())
                .active(plan.getActive())
                .popular(plan.getPopular())
                .planType(plan.getPlanType())
                .backgroundImage(plan.getBackgroundImage())
                .createdAt(plan.getCreatedAt())
                .updatedAt(plan.getUpdatedAt())
                .build();
    }

    public Plan toEntity(PlanDTO dto) {
        if (dto == null) {
            return null;
        }

        return Plan.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .internetSpeedMbps(dto.getInternetSpeedMbps())
                .tvChannels(dto.getTvChannels())
                .monthlyPrice(dto.getMonthlyPrice())
                .active(dto.getActive())
                .popular(dto.getPopular())
                .planType(dto.getPlanType())
                .backgroundImage(dto.getBackgroundImage())
                .build();
    }
}
