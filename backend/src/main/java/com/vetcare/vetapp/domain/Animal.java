package com.vetcare.vetapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.vetcare.vetapp.domain.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;

import java.util.List;
import com.vetcare.vetapp.domain.AnimalStatus;
import com.vetcare.vetapp.domain.User;
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
    @Enumerated(EnumType.STRING)
    private AnimalStatus status;

    @Column(name = "animal_image")
    private String animalImage;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "center_id")
    private com.vetcare.vetapp.domain.Center center;

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<com.vetcare.vetapp.domain.AdoptionHistory> adoptions;

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<com.vetcare.vetapp.domain.Appointment> appointments;
}
