package com.vetcare.vetapp.domain;

import com.vetcare.vetapp.domain.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "adoption_history")
@Data
public class AdoptionHistory {

    @Id
    @UuidGenerator
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "animal_id", nullable = false)
    private com.vetcare.vetapp.domain.Animal animal;

    @ManyToOne
    @JoinColumn(name = "adopter_id", nullable = false)
    private User adopter;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "is_active", nullable = false)
    @ColumnDefault("true")
    private boolean isActive;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "deleted_by")
    private UUID deletedBy;
}
