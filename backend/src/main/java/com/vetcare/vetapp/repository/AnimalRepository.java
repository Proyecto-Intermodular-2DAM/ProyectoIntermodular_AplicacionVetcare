package com.vetcare.vetapp.repository;

import com.vetcare.vetapp.domain.Animal;
import com.vetcare.vetapp.domain.AnimalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AnimalRepository extends JpaRepository<Animal, UUID> {

    @Query("SELECT a FROM Animal a WHERE a.isActive = true")
    List<Animal> findAllActive();

    @Query("SELECT a FROM Animal a WHERE a.isActive = true AND a.id = :id")
    Optional<Animal> findActiveById(@Param("id") UUID id);

    @Query("SELECT a FROM Animal a WHERE a.isActive = true AND a.owner.id = :clientId")
    List<Animal> findActiveByClientId(@Param("clientId") UUID clientId);

    @Query("SELECT a FROM Animal a WHERE a.isActive = true AND a.center.id = :centerId")
    List<Animal> findActiveByCenterId(@Param("centerId") UUID centerId);

    @Query("SELECT a FROM Animal a WHERE a.isActive = true AND a.status = :status")
    List<Animal> findActiveByStatus(@Param("status") AnimalStatus status);
}
