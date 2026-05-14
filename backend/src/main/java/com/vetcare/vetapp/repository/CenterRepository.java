package com.vetcare.vetapp.repository;

import com.vetcare.vetapp.domain.Center;
import com.vetcare.vetapp.domain.CenterType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CenterRepository extends JpaRepository<Center, UUID> {

    @Query("SELECT c FROM Center c WHERE c.isActive = true")
    List<Center> findAllActive();

    @Query("SELECT c FROM Center c WHERE c.isActive = true AND c.id = :id")
    Optional<Center> findActiveById(@Param("id") UUID id);

    @Query("SELECT c FROM Center c WHERE c.isActive = true AND c.type = :type")
    List<Center> findActiveByType(@Param("type") CenterType type);
}
