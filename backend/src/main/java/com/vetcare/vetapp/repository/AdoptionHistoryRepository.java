package com.vetcare.vetapp.repository;

import com.vetcare.vetapp.domain.AdoptionHistory;
import com.vetcare.vetapp.domain.Animal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AdoptionHistoryRepository extends JpaRepository<AdoptionHistory, UUID> {
    List<AdoptionHistory> findAdoptionHistoriesByAdopterId(UUID adopterId);
}
