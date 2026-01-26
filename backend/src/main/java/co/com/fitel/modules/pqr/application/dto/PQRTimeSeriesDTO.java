package co.com.fitel.modules.pqr.application.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PQRTimeSeriesDTO {
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    private Long count;
}
