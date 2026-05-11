package com.vetcare.vetapp.domain;

import com.vetcare.vetapp.domain.Center;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Table(name = "rooms")
@Data
public class Room {

    @Id
    @UuidGenerator
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "center_id", nullable = false)
    private Center center;
}
