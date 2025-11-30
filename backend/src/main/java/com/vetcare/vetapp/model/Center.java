package com.vetcare.vetapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.UuidGenerator;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "centers")
@Data
public class Center {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(name = "name")
    private String name;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "postcode", nullable = false)
    private String postcode;

    @Column(name = "center_type", nullable = false)
    @ColumnDefault( "'CLINIC'")
    private CenterType type;

    @OneToMany(mappedBy = "center", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Room> rooms;

    @ManyToMany(mappedBy = "workingCenters")
    @JsonIgnore
    private List<User> employees;
}
