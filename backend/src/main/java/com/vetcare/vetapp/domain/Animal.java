package com.vetcare.vetapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "animal")
@Data
public class Animal {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(name = "name")
    private String name;

    @Column(name = "species", nullable = false)
    private String species;

    @Column(name = "status", nullable = false)
    private AnimalStatus status;

    @Column(name = "animal_image")
    private String animalImage;

    @Column(name = "is_active", nullable = false)
    @ColumnDefault("true")
    private boolean isActive;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "deleted_by")
    private UUID deletedBy;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "center_id")
    private Center center;

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<AdoptionHistory> adoptions;

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Appointment> appointments;
}
