package co.com.fitel.modules.pqr.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Long pendingPQRs;
    private Long activePlans;
    private Long activeUsers;
    private List<PQRTimeSeriesDTO> pqrTimeSeries;
}
