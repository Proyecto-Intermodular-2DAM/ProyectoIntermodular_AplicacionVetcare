package com.vetcare.vetapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;

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
