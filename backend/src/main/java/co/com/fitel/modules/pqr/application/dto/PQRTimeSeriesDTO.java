package co.com.fitel.modules.pqr.application.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

public class PQRTimeSeriesDTO {
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    private Long count;

    public PQRTimeSeriesDTO() {
    }

    public PQRTimeSeriesDTO(LocalDate date, Long count) {
        this.date = date;
        this.count = count;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
