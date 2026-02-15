package co.com.fitel.modules.pqr.application.dto;

import java.util.List;

public class DashboardStatsDTO {
    private Long pendingPQRs;
    private Long activePlans;
    private Long activeUsers;
    private List<PQRTimeSeriesDTO> pqrTimeSeries;

    public DashboardStatsDTO() {
    }

    public DashboardStatsDTO(Long pendingPQRs, Long activePlans, Long activeUsers, List<PQRTimeSeriesDTO> pqrTimeSeries) {
        this.pendingPQRs = pendingPQRs;
        this.activePlans = activePlans;
        this.activeUsers = activeUsers;
        this.pqrTimeSeries = pqrTimeSeries;
    }

    public Long getPendingPQRs() {
        return pendingPQRs;
    }

    public void setPendingPQRs(Long pendingPQRs) {
        this.pendingPQRs = pendingPQRs;
    }

    public Long getActivePlans() {
        return activePlans;
    }

    public void setActivePlans(Long activePlans) {
        this.activePlans = activePlans;
    }

    public Long getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(Long activeUsers) {
        this.activeUsers = activeUsers;
    }

    public List<PQRTimeSeriesDTO> getPqrTimeSeries() {
        return pqrTimeSeries;
    }

    public void setPqrTimeSeries(List<PQRTimeSeriesDTO> pqrTimeSeries) {
        this.pqrTimeSeries = pqrTimeSeries;
    }
}
