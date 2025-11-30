package com.vetcare.vetapp.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "adoption_history")
@Data
public class HistorialAdopcion {

    @Id
    @UuidGenerator
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "animal_id", nullable = false)
    private Animal animal;

    @ManyToOne
    @JoinColumn(name = "adopter_id", nullable = false)
    private User adopter;

    @Column(name = "date", nullable = false)
    private LocalDate date;
}
