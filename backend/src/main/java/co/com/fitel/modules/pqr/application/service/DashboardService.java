package co.com.fitel.modules.pqr.application.service;

import co.com.fitel.modules.auth.domain.repository.AdminUserRepository;
import co.com.fitel.modules.pqr.application.dto.DashboardStatsDTO;
import co.com.fitel.modules.pqr.application.dto.PQRTimeSeriesDTO;
import co.com.fitel.modules.pqr.domain.repository.PQRRepository;
import co.com.fitel.modules.plans.domain.repository.PlanRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {
    
    private static final Logger log = LoggerFactory.getLogger(DashboardService.class);
    
    private final PQRRepository pqrRepository;
    private final PlanRepository planRepository;
    private final AdminUserRepository adminUserRepository;

    public DashboardService(PQRRepository pqrRepository, PlanRepository planRepository, AdminUserRepository adminUserRepository) {
        this.pqrRepository = pqrRepository;
        this.planRepository = planRepository;
        this.adminUserRepository = adminUserRepository;
    }
    
    public DashboardStatsDTO getDashboardStats() {
        log.debug("Fetching dashboard statistics");
        
        try {
            // PQRs pendientes - manejar caso donde la tabla no existe
            Long pendingPQRs = 0L;
            try {
                pendingPQRs = pqrRepository.countPendingPQRs();
                log.debug("Pending PQRs: {}", pendingPQRs);
            } catch (Exception e) {
                log.warn("Error contando PQRs pendientes (tabla puede no existir): {}", e.getMessage());
                pendingPQRs = 0L;
            }
            
            // Planes activos
            Long activePlans = 0L;
            try {
                activePlans = planRepository.countByActiveTrue();
                log.debug("Active plans: {}", activePlans);
            } catch (Exception e) {
                log.warn("Error contando planes activos: {}", e.getMessage());
                activePlans = 0L;
            }
            
            // Usuarios activos
            Long activeUsers = 0L;
            try {
                activeUsers = adminUserRepository.countByActiveTrue();
                log.debug("Active users: {}", activeUsers);
            } catch (Exception e) {
                log.warn("Error contando usuarios activos: {}", e.getMessage());
                activeUsers = 0L;
            }
            
            // Estadísticas de PQRs por tiempo (últimos 30 días)
            LocalDateTime endDateTime = LocalDateTime.now();
            LocalDateTime startDateTime = endDateTime.minusDays(30);
            
            // Convertir LocalDateTime a Timestamp para la consulta nativa
            java.sql.Timestamp startDate = java.sql.Timestamp.valueOf(startDateTime);
            java.sql.Timestamp endDate = java.sql.Timestamp.valueOf(endDateTime);
            
            List<PQRTimeSeriesDTO> pqrTimeSeries = new java.util.ArrayList<>();
            try {
                List<Object[]> timeSeriesData = pqrRepository.countByDateGrouped(startDate, endDate);
                log.debug("Time series data count: {}", timeSeriesData.size());
                
                pqrTimeSeries = timeSeriesData.stream()
                    .map(row -> {
                        try {
                            LocalDate date;
                            Object dateObj = row[0];
                            if (dateObj instanceof java.sql.Date) {
                                date = ((java.sql.Date) dateObj).toLocalDate();
                            } else if (dateObj instanceof java.sql.Timestamp) {
                                date = ((java.sql.Timestamp) dateObj).toLocalDateTime().toLocalDate();
                            } else if (dateObj instanceof LocalDate) {
                                date = (LocalDate) dateObj;
                            } else {
                                // Intentar parsear como string
                                date = LocalDate.parse(dateObj.toString());
                            }
                            Long count = ((Number) row[1]).longValue();
                            PQRTimeSeriesDTO dto = new PQRTimeSeriesDTO();
                            dto.setDate(date);
                            dto.setCount(count);
                            return dto;
                        } catch (Exception e) {
                            log.warn("Error procesando fila de time series: {}", e.getMessage());
                            return null;
                        }
                    })
                    .filter(java.util.Objects::nonNull)
                    .collect(Collectors.toList());
            } catch (Exception e) {
                log.warn("Error obteniendo time series, usando lista vacía: {}", e.getMessage());
                // Si hay error, usar lista vacía en lugar de fallar
            }
            
            DashboardStatsDTO stats = new DashboardStatsDTO();
            stats.setPendingPQRs(pendingPQRs != null ? pendingPQRs : 0L);
            stats.setActivePlans(activePlans != null ? activePlans : 0L);
            stats.setActiveUsers(activeUsers != null ? activeUsers : 0L);
            stats.setPqrTimeSeries(pqrTimeSeries != null ? pqrTimeSeries : java.util.Collections.emptyList());
            
            return stats;
        } catch (Exception e) {
            log.error("Error en getDashboardStats: {}", e.getMessage(), e);
            throw new RuntimeException("Error al obtener estadísticas del dashboard: " + e.getMessage(), e);
        }
    }
}
