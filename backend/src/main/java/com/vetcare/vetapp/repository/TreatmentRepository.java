package com.vetcare.vetapp.repository;

import com.vetcare.vetapp.domain.Treatment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TreatmentRepository extends JpaRepository<Treatment, UUID> {

    @Query("SELECT t FROM Treatment t WHERE t.isActive = true")
    List<Treatment> findAllActive();

    @Query("SELECT t FROM Treatment t WHERE t.isActive = true AND t.id = :id")
    Optional<Treatment> findActiveById(@Param("id") UUID id);

    @Query("SELECT t FROM Treatment t WHERE t.isActive = true AND t.appointment.id = :appointmentId")
    List<Treatment> findActiveByAppointmentId(@Param("appointmentId") UUID appointmentId);

    @Query("SELECT t FROM Treatment t WHERE t.isActive = true AND t.employee.id = :employeeId")
    List<Treatment> findActiveByEmployeeId(@Param("employeeId") UUID employeeId);
}
