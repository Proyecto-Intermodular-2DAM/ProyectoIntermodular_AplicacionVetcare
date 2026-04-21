package com.vetcare.vetapp.repository;

import com.vetcare.vetapp.domain.Animal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AnimalRepository extends JpaRepository<Animal, UUID>{
    List<Animal> findByNameContainingIgnoreCase(String name);
}
