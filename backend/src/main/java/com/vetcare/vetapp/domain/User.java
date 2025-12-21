package com.vetcare.vetapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @UuidGenerator
    private UUID id;

    @Column(name = "dni", nullable = false, unique = true, length = 9)
    private String dni;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "email", nullable = false, unique = true)
    @Email
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    @ColumnDefault( "'CLIENT'")
    private UserRole role;

    @Column(name = "user_image")
    private String userImage;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "is_active" , nullable = false)
    @ColumnDefault( "'true'")
    private boolean isActive;

    @Column(name = "salary")
    private BigDecimal salary;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Animal> animals;

    @OneToMany(mappedBy = "adopter", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<AdoptionHistory> adoptions;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Appointment> clientAppointments;

    @OneToMany(mappedBy = "receptionist", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Appointment> receptionistAppointments;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Treatment> treatments;

    @ManyToMany
    @JoinTable(
        name = "working",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "center_id")
    )
    @JsonIgnore
    private List<Center> workingCenters;
}
