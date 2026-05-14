package com.vetcare.vetapp.repository;

import com.vetcare.vetapp.domain.AdoptionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AdoptionHistoryRepository extends JpaRepository<AdoptionHistory, UUID> {

    @Query("SELECT ah FROM AdoptionHistory ah WHERE ah.isActive = true")
    List<AdoptionHistory> findAllActive();

    @Query("SELECT ah FROM AdoptionHistory ah WHERE ah.isActive = true AND ah.id = :id")
    Optional<AdoptionHistory> findActiveById(@Param("id") UUID id);

    @Query("SELECT ah FROM AdoptionHistory ah WHERE ah.isActive = true AND ah.animal.id = :animalId")
    List<AdoptionHistory> findActiveByAnimalId(@Param("animalId") UUID animalId);

    @Query("SELECT ah FROM AdoptionHistory ah WHERE ah.isActive = true AND ah.adopter.id = :adopterId")
    List<AdoptionHistory> findActiveByAdopterId(@Param("adopterId") UUID adopterId);
}
