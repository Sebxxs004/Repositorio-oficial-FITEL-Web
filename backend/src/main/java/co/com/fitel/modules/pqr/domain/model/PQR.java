package co.com.fitel.modules.pqr.domain.model;

import co.com.fitel.common.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidad PQR (Petición, Queja, Recurso)
 * 
 * Módulo de PQRs - Dominio
 * Implementa el principio de Responsabilidad Única (SRP)
 */
@Entity
@Table(name = "pqr")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PQR extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 50)
    private String cun;

    @Column(nullable = false, length = 20)
    private String type; // PETICION, QUEJA, RECURSO

    @Column(name = "customer_name", nullable = false, length = 200)
    private String customerName;

    @Column(name = "customer_email", nullable = false, length = 255)
    private String customerEmail;

    @Column(name = "customer_phone", nullable = false, length = 20)
    private String customerPhone;

    @Column(name = "customer_document_type", nullable = false, length = 20)
    private String customerDocumentType;

    @Column(name = "customer_document_number", nullable = false, length = 50)
    private String customerDocumentNumber;

    @Column(nullable = false, length = 500)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "RECIBIDA"; // RECIBIDA, EN_PROCESO, RESUELTA, RECHAZADA

    @Column(length = 20)
    @Builder.Default
    private String priority = "NORMAL";

    @Column(name = "assigned_to", length = 100)
    private String assignedTo;

    @Column(columnDefinition = "TEXT")
    private String response;

    @Column(name = "response_date")
    private LocalDateTime responseDate;

    @Column(name = "resolution_date")
    private LocalDateTime resolutionDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_pqr_id")
    private PQR parentPqr;
}
