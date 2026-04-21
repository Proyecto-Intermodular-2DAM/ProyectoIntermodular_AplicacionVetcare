package com.vetcare.vetapp.repository;

import com.vetcare.vetapp.domain.Center;
import com.vetcare.vetapp.domain.CenterType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CenterRepository extends JpaRepository<Center, UUID> {
    Center getCenterById(UUID id);

    List<Center> findByCityContainingIgnoreCase(String city);

    List<Center> findByType(CenterType type);

    List<Center> findByCityContainingIgnoreCaseAndType(String city, CenterType type);
}
