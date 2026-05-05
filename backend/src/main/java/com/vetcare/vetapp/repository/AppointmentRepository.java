package com.vetcare.vetapp.repository;

import com.vetcare.vetapp.domain.Appointment;
import com.vetcare.vetapp.domain.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    @Query("SELECT a FROM Appointment a WHERE a.isActive = true")
    List<Appointment> findAllActive();

    @Query("SELECT a FROM Appointment a WHERE a.isActive = true AND a.id = :id")
    Optional<Appointment> findActiveById(@Param("id") UUID id);

    @Query("SELECT a FROM Appointment a WHERE a.isActive = true AND a.client.id = :clientId")
    List<Appointment> findActiveByClientId(@Param("clientId") UUID clientId);

    @Query("SELECT a FROM Appointment a WHERE a.isActive = true AND a.animal.id = :animalId")
    List<Appointment> findActiveByAnimalId(@Param("animalId") UUID animalId);

    @Query("SELECT a FROM Appointment a WHERE a.isActive = true AND a.date = :date")
    List<Appointment> findActiveByDate(@Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE a.isActive = true AND a.status = :status")
    List<Appointment> findActiveByStatus(@Param("status") AppointmentStatus status);
}
