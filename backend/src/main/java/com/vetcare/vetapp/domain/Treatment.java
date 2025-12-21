package com.vetcare.vetapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Table(name = "treatments")
@Data
public class Treatment {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(name = "description", nullable = false)
    @NotBlank
    private String description;

    @Column(name = "medication")
    private String medication;

    @Column(name = "dosage")
    private String dosage;

    @ManyToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;
}
